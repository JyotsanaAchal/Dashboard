import React, { useState } from "react";
import employees from "../data/sampleEmployees.json";
import "./CreateTeam.css";
const managers = [...new Set(employees.map((e) => e.manager))]; // unique managers

const CreateTeam = () => {
  const [searchMode, setSearchMode] = useState("managers"); // or "employees"
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedManager, setExpandedManager] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Filtered managers or employees based on search term & limit results to 5
  const filteredManagers = managers
    .filter((mgr) => mgr.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  const filteredEmployees = employees
    .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  // Employees under expanded manager
  const directs = expandedManager
    ? employees.filter((emp) => emp.manager === expandedManager)
    : [];

  // Add or remove employees from selected list
  const toggleEmployeeSelection = (emp) => {
    if (selectedEmployees.some((e) => e.id === emp.id)) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  // Check if employee is selected
  const isSelected = (emp) => selectedEmployees.some((e) => e.id === emp.id);

  // Remove employee from selected list
  const removeSelected = (emp) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
  };

  // Add to team handler (dummy)
  const handleAddToTeam = () => {
    alert(
      Added`${
        selectedEmployees.length
      } employee(s) to the team: \n${selectedEmployees
        .map((e) => e.name)
        .join(", ")}
    `
    );
    setSelectedEmployees([]);
    setSearchTerm("");
    setExpandedManager(null);
  };

  return (
    <div className="create-team">
      <h1>Create Team</h1>

      {/* Search mode toggle */}
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

      {/* Search bar */}
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

      {/* Search results */}
      <div className="results-container">
        {searchMode === "managers" &&
          filteredManagers.length === 0 &&
          searchTerm.length > 0 && <p>No managers found.</p>}

        {searchMode === "employees" &&
          filteredEmployees.length === 0 &&
          searchTerm.length > 0 && <p>No employees found.</p>}

        {searchMode === "managers" &&
          filteredManagers.map((mgr) => (
            <div key={mgr} className="manager-item">
              <div
                className="manager-header"
                onClick={() =>
                  setExpandedManager(expandedManager === mgr ? null : mgr)
                }
              >
                <span>{mgr}</span>
                <span>{expandedManager === mgr ? "▲" : "▼"}</span>
              </div>
              {expandedManager === mgr && (
                <div className="directs-list">
                  {employees
                    .filter((emp) => emp.manager === mgr)
                    .map((emp) => (
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
          ))}

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

      {/* Selected list */}
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

      {/* Add to Team button */}
      <button
        className="btn add-team-btn"
        onClick={handleAddToTeam}
        disabled={selectedEmployees.length === 0}
      >
        Add to Team
      </button>
    </div>
  );
};

export default CreateTeam;
