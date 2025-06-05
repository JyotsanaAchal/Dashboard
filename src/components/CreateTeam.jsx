import React, { useState } from "react";
import employees from "../data/sampleEmployees.json";
import "./CreateTeam.css";

// Simulate logged-in manager - replace with actual auth logic
const LOGGED_IN_MANAGER = "John Doe"; // Example manager name

const managers = [...new Set(employees.map((e) => e.manager))];

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [searchMode, setSearchMode] = useState("managers");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedManager, setExpandedManager] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Pagination for direct reports
  const [directsPage, setDirectsPage] = useState(1);
  const DIRECTS_PER_PAGE = 5;

  // Get logged-in manager's direct reports
  const loggedInManagerDirects = employees.filter(
    (emp) => emp.manager === LOGGED_IN_MANAGER
  );

  // Pagination for direct reports
  const totalDirectsPages = Math.ceil(
    loggedInManagerDirects.length / DIRECTS_PER_PAGE
  );
  const paginatedDirects = loggedInManagerDirects.slice(
    (directsPage - 1) * DIRECTS_PER_PAGE,
    directsPage * DIRECTS_PER_PAGE
  );

  // Filter out logged-in manager from search results and their direct reports from employee search
  const filteredManagers =
    searchTerm.trim() === ""
      ? []
      : managers
          .filter(
            (mgr) =>
              mgr.toLowerCase().includes(searchTerm.toLowerCase()) &&
              mgr !== LOGGED_IN_MANAGER // Exclude logged-in manager
          )
          .slice(0, 5);

  const filteredEmployees =
    searchTerm.trim() === ""
      ? []
      : employees
          .filter(
            (emp) =>
              emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              emp.manager !== LOGGED_IN_MANAGER // Exclude manager's direct reports from employee search
          )
          .slice(0, 5);

  const directs = expandedManager
    ? employees.filter((emp) => emp.manager === expandedManager)
    : [];

  const isSelected = (emp) => selectedEmployees.some((e) => e.id === emp.id);

  const toggleEmployeeSelection = (emp) => {
    if (isSelected(emp)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  const removeSelected = (emp) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
  };

  const handleAddToTeam = () => {
    alert(
      `Team "${teamName}" created with ${
        selectedEmployees.length
      } employee(s): \n${selectedEmployees.map((e) => e.name).join(", ")}`
    );
    setSelectedEmployees([]);
    setTeamName("");
    setSearchTerm("");
    setExpandedManager(null);
    setDirectsPage(1);
  };

  // Handle search term changes and reset expanded manager
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setExpandedManager(null);
  };

  // Check if ALL direct reports are selected (not just current page)
  const allDirectsSelected =
    loggedInManagerDirects.length > 0 &&
    loggedInManagerDirects.every((emp) => isSelected(emp));

  // Handle select all direct reports (ALL, not just current page)
  const handleSelectAllDirects = (checked) => {
    if (checked) {
      // Select all direct reports that aren't already selected
      const newEmployees = loggedInManagerDirects.filter(
        (emp) => !isSelected(emp)
      );
      setSelectedEmployees([...selectedEmployees, ...newEmployees]);
    } else {
      // Deselect all direct reports
      const directReportIds = new Set(
        loggedInManagerDirects.map((emp) => emp.id)
      );
      const remaining = selectedEmployees.filter(
        (emp) => !directReportIds.has(emp.id)
      );
      setSelectedEmployees(remaining);
    }
  };

  return (
    <div className="create-team">
      <h1>Create Team</h1>

      {/* Team Name Input */}
      <div className="team-name-container">
        <label htmlFor="teamName" className="team-name-label">
          Team Name
        </label>
        <input
          id="teamName"
          type="text"
          placeholder="Enter a team name..."
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="team-name-input"
        />
      </div>

      {/* Your Direct Reports Section - Always visible if manager has direct reports */}
      {loggedInManagerDirects.length > 0 && (
        <div className="directs-section">
          <h3>Your Direct Reports ({loggedInManagerDirects.length})</h3>
          <div className="directs-container">
            {/* Single Select All for ALL direct reports */}
            <label className="checkbox-label select-all">
              <input
                type="checkbox"
                checked={allDirectsSelected}
                onChange={(e) => handleSelectAllDirects(e.target.checked)}
              />
              Select All Direct Reports
            </label>

            <div className="directs-list">
              {paginatedDirects.map((emp) => (
                <label key={emp.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isSelected(emp)}
                    onChange={() => toggleEmployeeSelection(emp)}
                  />
                  {emp.name} ({emp.email})
                </label>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalDirectsPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setDirectsPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={directsPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {directsPage} of {totalDirectsPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setDirectsPage((prev) =>
                      Math.min(totalDirectsPages, prev + 1)
                    )
                  }
                  disabled={directsPage === totalDirectsPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
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
          }}
        >
          Search Other Managers
        </button>
        <button
          className={searchMode === "employees" ? "active" : ""}
          onClick={() => {
            setSearchMode("employees");
            setSearchTerm("");
            setExpandedManager(null);
          }}
        >
          Search Other Employees
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={
          searchMode === "managers"
            ? "Search other managers..."
            : "Search other employees..."
        }
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="search-input"
      />

      {/* Results - Only show when there's a search term */}
      {searchTerm.trim() !== "" && (
        <div className="results-container">
          {searchMode === "managers" && filteredManagers.length === 0 && (
            <p>No other managers found.</p>
          )}

          {searchMode === "employees" && filteredEmployees.length === 0 && (
            <p>No other employees found.</p>
          )}

          {searchMode === "managers" &&
            filteredManagers.map((mgr) => {
              const isExpanded = expandedManager === mgr;
              const managerDirects = employees.filter(
                (emp) => emp.manager === mgr
              );
              const allSelected = managerDirects.every((emp) =>
                isSelected(emp)
              );

              return (
                <div key={mgr} className="manager-item">
                  <div className="manager-header">
                    <div
                      className="manager-left"
                      onClick={() =>
                        setExpandedManager(isExpanded ? null : mgr)
                      }
                    >
                      <span>{mgr}</span>
                      <span>({managerDirects.length} employees)</span>
                      <span>{isExpanded ? "▲" : "▼"}</span>
                    </div>

                    {isExpanded && managerDirects.length > 0 && (
                      <label className="checkbox-label select-all-inline">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newEmployees = managerDirects.filter(
                                (emp) => !isSelected(emp)
                              );
                              setSelectedEmployees([
                                ...selectedEmployees,
                                ...newEmployees,
                              ]);
                            } else {
                              const remaining = selectedEmployees.filter(
                                (emp) => emp.manager !== mgr
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
                            onChange={() => toggleEmployeeSelection(emp)}
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
            filteredEmployees.map((emp) => (
              <label key={emp.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isSelected(emp)}
                  onChange={() => toggleEmployeeSelection(emp)}
                />
                {emp.name} ({emp.email}) - Manager: {emp.manager}
              </label>
            ))}
        </div>
      )}

      {/* Selected Employees */}
      <div className="selected-container">
        <h3>Selected Employees ({selectedEmployees.length})</h3>
        {selectedEmployees.length === 0 && <p>No employees selected.</p>}
        <ul>
          {selectedEmployees.map((emp) => (
            <li key={emp.id}>
              {emp.name} ({emp.email}){" "}
              <button
                className="remove-btn"
                onClick={() => removeSelected(emp)}
                title="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Add to Team Button */}
      <button
        className="btn add-team-btn"
        onClick={handleAddToTeam}
        disabled={selectedEmployees.length === 0 || teamName.trim() === ""}
      >
        Create Team
      </button>
    </div>
  );
};

export default CreateTeam;
