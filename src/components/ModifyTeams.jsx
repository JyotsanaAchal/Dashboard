import React, { useState } from "react";
import teams from "../data/sampleTeams.json";
import employees from "../data/sampleEmployees.json";
import "./ModifyTeams.css";

const ModifyTeams = ({ managerName = "John Doe" }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Filter only the logged-in manager's teams
  const managerTeams = teams.filter((team) => team.manager === managerName);

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
  };

  const getEmployeeDetails = (ids) => {
    return employees.filter((emp) => ids.includes(emp.id));
  };

  return (
    <div className="manage-teams-container">
      <h1 className="page-title">Manage Teams</h1>

      {selectedTeam ? (
        <div className="team-view">
          <div className="team-view-header">
            <h2>{selectedTeam.teamName}</h2>
            <p className="team-manager-label">
              Managed by: {selectedTeam.manager}
            </p>
          </div>

          <table className="team-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {getEmployeeDetails(selectedTeam.employeeIds).map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn back-btn"
            onClick={() => setSelectedTeam(null)}
          >
            ← Back to Teams
          </button>
        </div>
      ) : (
        <>
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
                <div key={team.teamName} className="team-card">
                  <h3>{team.teamName}</h3>
                  <p className="manager-label">Manager: {team.manager}</p>
                  <div className="card-buttons">
                    <button
                      className="btn primary"
                      onClick={() => handleViewTeam(team)}
                    >
                      View Team
                    </button>
                    <button className="btn secondary">Generate Report</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModifyTeams;
