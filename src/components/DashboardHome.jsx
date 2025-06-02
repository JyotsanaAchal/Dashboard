import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import employees from "../data/sampleEmployees.json";
import "./DashboardHome.css";

const DashboardHome = ({ managerName = "John Doe" }) => {
  const navigate = useNavigate();

  const managedEmployees = employees.filter(
    (emp) => emp.manager === managerName
  );

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const totalPages = Math.ceil(managedEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const currentEmployees = managedEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Hey, {managerName} 👋</h1>
        <div className="dashboard-buttons">
          <button
            className="btn primary"
            onClick={() => navigate("/create-team")}
          >
            + Create Team
          </button>
          <button className="btn secondary">Manage Teams</button>
        </div>
      </header>

      {/* Employee Table */}
      <section className="dashboard-section">
        <h2>Your Employees</h2>
        <div className="table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            className="btn small"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn small"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
