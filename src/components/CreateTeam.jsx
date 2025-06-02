import React, { useState } from "react";
import employees from "../data/sampleEmployees.json";
import "./CreateTeam.css";

const managers = [...new Set(employees.map((e) => e.manager))];

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [searchMode, setSearchMode] = useState("managers");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedManager, setExpandedManager] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const filteredManagers = managers
    .filter((mgr) => mgr.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  const filteredEmployees = employees
    .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
          Search Managers
        </button>
        <button
          className={searchMode === "employees" ? "active" : ""}
          onClick={() => {
            setSearchMode("employees");
            setSearchTerm("");
            setExpandedManager(null);
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
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Results */}
      <div className="results-container">
        {searchMode === "managers" &&
          filteredManagers.length === 0 &&
          searchTerm.length > 0 && <p>No managers found.</p>}

        {searchMode === "employees" &&
          filteredEmployees.length === 0 &&
          searchTerm.length > 0 && <p>No employees found.</p>}

        {searchMode === "managers" &&
          filteredManagers.map((mgr) => {
            const isExpanded = expandedManager === mgr;
            const managerDirects = employees.filter(
              (emp) => emp.manager === mgr
            );
            const allSelected = managerDirects.every((emp) => isSelected(emp));

            return (
              <div key={mgr} className="manager-item">
                <div className="manager-header">
                  <div
                    className="manager-left"
                    onClick={() => setExpandedManager(isExpanded ? null : mgr)}
                  >
                    <span>{mgr}</span>
                    <span>{isExpanded ? "▲" : "▼"}</span>
                  </div>

                  {isExpanded && (
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
        Add to Team
      </button>
    </div>
  );
};

export default CreateTeam;
