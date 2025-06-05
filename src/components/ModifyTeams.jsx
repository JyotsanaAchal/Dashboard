import React, { useState } from "react";
import teams from "../data/sampleTeams.json";
import employees from "../data/sampleEmployees.json";
import "./ModifyTeams.css";

const ModifyTeams = ({ managerName = "John Doe" }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [originalTeamName, setOriginalTeamName] = useState("");
  const [editNameMode, setEditNameMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // All members that should be displayed in the table
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 7;

  const [addMembersMode, setAddMembersMode] = useState(false);
  const [searchMode, setSearchMode] = useState("managers");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedManager, setExpandedManager] = useState(null);

  // Track employees that should be hidden from search after modal closes
  const [committedEmployeeIds, setCommittedEmployeeIds] = useState([]);

  // Pagination for Your Direct Reports
  const [directReportsPage, setDirectReportsPage] = useState(1);
  const directReportsPerPage = 10;

  // Pagination for Search Results
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const searchResultsPerPage = 5;

  const managerTeams = teams.filter((team) => team.manager === managerName);
  const allManagers = [...new Set(employees.map((e) => e.manager))];

  const handleModifyClick = (team) => {
    setSelectedTeam(team);
    setTeamName(team.teamName);
    setOriginalTeamName(team.teamName);
    const members = employees.filter((e) => team.employeeIds.includes(e.id));
    setSelectedEmployees(members); // Initially all team members are selected
    setTeamMembers(members); // Set the team members that should always be displayed
    // Set committed IDs to currently selected members
    setCommittedEmployeeIds(members.map((emp) => emp.id));
    setEditNameMode(false);
    setAddMembersMode(false);
    setSearchTerm("");
    setExpandedManager(null);
    setCurrentPage(1);
    setDirectReportsPage(1);
    setSearchResultsPage(1);
  };

  const handleEditName = () => {
    setEditNameMode(true);
  };

  const handleCancelEditName = () => {
    setTeamName(originalTeamName);
    setEditNameMode(false);
  };

  const handleSaveEditName = () => {
    setOriginalTeamName(teamName);
    setEditNameMode(false);
  };

  const handleAddMembers = () => {
    setAddMembersMode(true);
    setSearchTerm("");
    setExpandedManager(null);
    setDirectReportsPage(1);
    setSearchResultsPage(1);
  };

  const handleAddMembersDone = () => {
    // Add newly selected employees to team members if they're not already there
    const newMembers = selectedEmployees.filter(
      (emp) => !teamMembers.some((member) => member.id === emp.id)
    );
    setTeamMembers([...teamMembers, ...newMembers]);

    // Update committed employee IDs to current selection
    setCommittedEmployeeIds(selectedEmployees.map((emp) => emp.id));
    setAddMembersMode(false);
  };

  const handleAddMembersCancel = () => {
    // Revert to committed state
    const committedEmployees = employees.filter((emp) =>
      committedEmployeeIds.includes(emp.id)
    );
    setSelectedEmployees(committedEmployees);
    setAddMembersMode(false);
  };

  const toggleEmployee = (emp) => {
    if (selectedEmployees.some((e) => e.id === emp.id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  const isSelected = (emp) => selectedEmployees.some((e) => e.id === emp.id);
  const isCommitted = (emp) => committedEmployeeIds.includes(emp.id);

  const saveTeam = () => {
    alert(`Team "${teamName}" saved with ${selectedEmployees.length} members.`);
    setSelectedTeam(null);
  };

  // Modified filtering logic for search results
  const filteredManagers =
    searchTerm.trim() === ""
      ? []
      : allManagers
          .filter((mgr) => mgr.toLowerCase().includes(searchTerm.toLowerCase()))
          .filter((mgr) => mgr !== managerName) // Exclude the logged-in manager
          .filter((mgr) => {
            const managerDirects = employees.filter(
              (emp) => emp.manager === mgr && !isCommitted(emp) // Use committed instead of selected
            );
            return managerDirects.length > 0;
          });

  const filteredEmployees =
    searchTerm.trim() === ""
      ? []
      : employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !isCommitted(emp) // Use committed instead of selected
        );

  const getManagerDirects = (mgr) =>
    employees.filter((emp) => emp.manager === mgr && !isCommitted(emp)); // Use committed instead of selected

  const loggedInManagerDirects = employees.filter(
    (emp) => emp.manager === managerName && !isCommitted(emp) // Use committed instead of selected
  );

  // Pagination for main team table - use teamMembers instead of selectedEmployees
  const totalPages = Math.ceil(teamMembers.length / employeesPerPage);
  const paginatedEmployees = teamMembers.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Pagination for Your Direct Reports
  const totalDirectReportsPages = Math.ceil(
    loggedInManagerDirects.length / directReportsPerPage
  );
  const paginatedDirectReports = loggedInManagerDirects.slice(
    (directReportsPage - 1) * directReportsPerPage,
    directReportsPage * directReportsPerPage
  );

  // Pagination for Search Results
  const totalSearchResultsPages = Math.ceil(
    (searchMode === "managers"
      ? filteredManagers.length
      : filteredEmployees.length) / searchResultsPerPage
  );

  const paginatedSearchResults =
    searchMode === "managers"
      ? filteredManagers.slice(
          (searchResultsPage - 1) * searchResultsPerPage,
          searchResultsPage * searchResultsPerPage
        )
      : filteredEmployees.slice(
          (searchResultsPage - 1) * searchResultsPerPage,
          searchResultsPage * searchResultsPerPage
        );

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setExpandedManager(null);
    setSearchResultsPage(1);
  };

  const toggleManagerExpansion = (mgr) => {
    setExpandedManager(expandedManager === mgr ? null : mgr);
  };

  const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
    label = "Page",
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          className="btn small"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-info">
          {label} {currentPage} of {totalPages}
        </span>
        <button
          className="btn small"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="manage-teams-container">
      <h1 className="page-title">Your Teams</h1>
      {managerTeams.length === 0 ? (
        <div className="no-teams">
          <p>No teams yet. Start building your team.</p>
          <button
            className="btn primary"
            onClick={() => (window.location.href = "/create-team")}
          >
            + Create Team
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {managerTeams.map((team) => (
            <div className="team-card" key={team.teamName}>
              <h3>{team.teamName}</h3>
              <div className="card-buttons">
                <button
                  className="btn primary"
                  onClick={() => handleModifyClick(team)}
                >
                  Modify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTeam && (
        <div className="modal-overlay">
          <div className="modal">
            {!editNameMode ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h2 style={{ margin: 0 }}>{teamName}</h2>
                <button className="btn secondary" onClick={handleEditName}>
                  Edit Name
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="team-name-input"
                  placeholder="Edit team name"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <button className="btn primary" onClick={handleSaveEditName}>
                    Save
                  </button>
                  <button
                    className="btn secondary"
                    onClick={handleCancelEditName}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="team-stats">
              <p>Total Members: {selectedEmployees.length}</p>
            </div>

            <table className="team-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Manager</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected(emp)}
                        onChange={() => toggleEmployee(emp)}
                      />
                    </td>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              label="Page"
            />

            <div style={{ textAlign: "center", margin: "1rem 0" }}>
              <button className="btn secondary" onClick={handleAddMembers}>
                Add Members
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn primary" onClick={saveTeam}>
                Save
              </button>
              <button
                className="btn secondary"
                onClick={() => setSelectedTeam(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {addMembersMode && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Team Members</h2>

            {/* Your Direct Reports Section */}
            {loggedInManagerDirects.length > 0 && (
              <div className="add-members-section">
                <h3>
                  Your Direct Reports ({loggedInManagerDirects.length}{" "}
                  available)
                </h3>
                <div className="results-container">
                  {paginatedDirectReports.map((emp) => (
                    <label key={emp.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={isSelected(emp)}
                        onChange={() => toggleEmployee(emp)}
                      />
                      {emp.name} ({emp.email})
                    </label>
                  ))}
                </div>

                <PaginationComponent
                  currentPage={directReportsPage}
                  totalPages={totalDirectReportsPages}
                  onPageChange={setDirectReportsPage}
                  label="Direct Reports Page"
                />
              </div>
            )}

            {/* Search Mode Toggle */}
            <div className="toggle-container">
              <button
                className={searchMode === "managers" ? "active" : ""}
                onClick={() => {
                  setSearchMode("managers");
                  setSearchTerm("");
                  setExpandedManager(null);
                  setSearchResultsPage(1);
                }}
              >
                Search Managers
              </button>
              <button
                className={searchMode === "employees" ? "active" : ""}
                onClick={() => {
                  setSearchMode("employees");
                  setSearchTerm("");
                  setExpandedManager(null);
                  setSearchResultsPage(1);
                }}
              >
                Search Employees
              </button>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder={
                searchMode === "managers"
                  ? "Search managers..."
                  : "Search employees..."
              }
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="search-input"
            />

            {/* Search Results */}
            {searchTerm.trim() !== "" && (
              <div className="search-results-section">
                <div className="results-container">
                  {searchMode === "managers" &&
                    paginatedSearchResults.length === 0 && (
                      <p>No managers with unselected employees found.</p>
                    )}

                  {searchMode === "employees" &&
                    paginatedSearchResults.length === 0 && (
                      <p>No unselected employees found.</p>
                    )}

                  {searchMode === "managers" &&
                    paginatedSearchResults.map((mgr) => {
                      const isExpanded = expandedManager === mgr;
                      const managerDirects = getManagerDirects(mgr);

                      return (
                        <div key={mgr} className="manager-item">
                          <div className="manager-header">
                            <div
                              className="manager-left"
                              onClick={() => toggleManagerExpansion(mgr)}
                            >
                              <span>
                                {mgr} ({managerDirects.length} available)
                              </span>
                              <span>{isExpanded ? "▲" : "▼"}</span>
                            </div>

                            {isExpanded && managerDirects.length > 0 && (
                              <label className="checkbox-label select-all-inline">
                                <input
                                  type="checkbox"
                                  checked={managerDirects.every((emp) =>
                                    isSelected(emp)
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedEmployees([
                                        ...selectedEmployees,
                                        ...managerDirects.filter(
                                          (emp) => !isSelected(emp)
                                        ),
                                      ]);
                                    } else {
                                      const remaining =
                                        selectedEmployees.filter(
                                          (emp) =>
                                            !managerDirects.some(
                                              (d) => d.id === emp.id
                                            )
                                        );
                                      setSelectedEmployees(remaining);
                                    }
                                  }}
                                />
                                Select All
                              </label>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="directs-list">
                              {managerDirects.map((emp) => (
                                <label key={emp.id} className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={isSelected(emp)}
                                    onChange={() => toggleEmployee(emp)}
                                  />
                                  {emp.name} ({emp.email})
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {searchMode === "employees" &&
                    paginatedSearchResults.map((emp) => (
                      <label key={emp.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={isSelected(emp)}
                          onChange={() => toggleEmployee(emp)}
                        />
                        {emp.name} ({emp.email}) - Manager: {emp.manager}
                      </label>
                    ))}
                </div>

                <PaginationComponent
                  currentPage={searchResultsPage}
                  totalPages={totalSearchResultsPages}
                  onPageChange={setSearchResultsPage}
                  label={
                    searchMode === "managers"
                      ? "Managers Page"
                      : "Employees Page"
                  }
                />
              </div>
            )}

            <div className="modal-actions">
              <button className="btn primary" onClick={handleAddMembersDone}>
                Done
              </button>
              <button
                className="btn secondary"
                onClick={handleAddMembersCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyTeams;
