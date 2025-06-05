import React, { useState } from "react";
import teams from "../data/sampleTeams.json";
import employees from "../data/sampleEmployees.json";
import "./GenerateReport.css";

const GenerateReport = ({ managerName = "John Doe" }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedEntitlements, setSelectedEntitlements] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const myTeams = teams.filter((team) => team.manager === managerName);

  const generateReportData = (team) => {
    const teamMembers = employees.filter((emp) =>
      team.employeeIds.includes(emp.id)
    );
    const entitlementCount = {};

    teamMembers.forEach((emp) => {
      emp.entitlements.forEach((ent) => {
        if (!entitlementCount[ent]) entitlementCount[ent] = 0;
        entitlementCount[ent]++;
      });
    });

    const total = teamMembers.length;
    return Object.entries(entitlementCount).map(([entitlement, count]) => ({
      entitlement,
      count,
      total,
      percentage: ((count / total) * 100).toFixed(1),
    }));
  };

  const reportData = selectedTeam ? generateReportData(selectedTeam) : [];

  const handleCheckboxChange = (ent) => {
    const updated = new Set(selectedEntitlements);
    if (updated.has(ent)) {
      updated.delete(ent);
    } else {
      updated.add(ent);
    }
    setSelectedEntitlements(updated);
    setSelectAll(updated.size === reportData.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEntitlements(new Set());
    } else {
      setSelectedEntitlements(new Set(reportData.map((r) => r.entitlement)));
    }
    setSelectAll(!selectAll);
  };

  const handleExport = () => {
    if (selectedEntitlements.size === 0) return;

    const header = "Entitlement,Users with Access,Total Members,% Access\n";
    const rows = reportData
      .filter((r) => selectedEntitlements.has(r.entitlement))
      .map((r) => `${r.entitlement},${r.count},${r.total},${r.percentage}%`)
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTeam.name}_entitlement_report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="team-report-container">
      <h2 className="page-title">Your Teams</h2>
      {!selectedTeam ? (
        <>
          {myTeams.length === 0 ? (
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
              {myTeams.map((team) => (
                <div className="team-card" key={team.teamName}>
                  <h3>{team.teamName}</h3>
                  <button
                    className="btn primary"
                    onClick={() => {
                      setSelectedTeam(team);
                      setSelectedEntitlements(new Set());
                      setSelectAll(false);
                    }}
                  >
                    Generate Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="page-title">Report: {selectedTeam.teamName}</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>
                  Select All &nbsp;
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Entitlement Name</th>
                <th>No. of Users with Access</th>
                <th>Total Count</th>
                <th>% of Users Access</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr key={row.entitlement}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEntitlements.has(row.entitlement)}
                      onChange={() => handleCheckboxChange(row.entitlement)}
                    />
                  </td>
                  <td>{row.entitlement}</td>
                  <td>{row.count}</td>
                  <td>{row.total}</td>
                  <td>{row.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="report-actions">
            <button
              className="btn secondary"
              onClick={() => setSelectedTeam(null)}
            >
              ⬅ Back
            </button>
            <button
              className="btn primary"
              onClick={handleExport}
              disabled={selectedEntitlements.size === 0}
            >
              Export Selected
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateReport;
