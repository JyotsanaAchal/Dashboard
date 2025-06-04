import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({
  managerName = "John Doe",
  managerEmail = "john@example.com",
  managerId = "MGR001",
}) => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const sidebarRef = useRef(null);
  const personalInfoRef = useRef(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleTeamsDropdown = () => setShowTeamsDropdown(!showTeamsDropdown);
  const togglePersonalInfo = () => setShowPersonalInfo(!showPersonalInfo);

  // Handle clicking outside the sidebar and personal info
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside sidebar and not on toggle button
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains("toggle-button")
      ) {
        setShowSidebar(false);
        setShowTeamsDropdown(false);
      }

      // Check if click is outside personal info
      if (
        personalInfoRef.current &&
        !personalInfoRef.current.contains(event.target) &&
        !event.target.classList.contains("personal-info-icon")
      ) {
        setShowPersonalInfo(false);
      }
    };

    if (showSidebar || showPersonalInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, showPersonalInfo]);

  const handleMenuClick = (path) => {
    navigate(path);
    setShowSidebar(false);
    setShowTeamsDropdown(false);
    setShowPersonalInfo(false);
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button className="toggle-button" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Personal Info Icon - Top Right Corner */}
      <div className="personal-info-container" ref={personalInfoRef}>
        <button
          className="personal-info-icon"
          onClick={togglePersonalInfo}
          aria-label="Personal Information"
        >
          👤
        </button>
        {showPersonalInfo && (
          <div className="personal-info-dropdown">
            <h3>{managerName}</h3>
            <p>ID: {managerId}</p>
            <p>Email: {managerEmail}</p>
          </div>
        )}
      </div>

      {/* Sidebar - Only visible when showSidebar is true */}
      {showSidebar && (
        <aside className="sidebar" ref={sidebarRef}>
          {/* Menu Options */}
          <nav className="sidebar-menu">
            {/* Manage Teams with Dropdown */}
            <div className="menu-item">
              <div className="menu-option" onClick={toggleTeamsDropdown}>
                <span>Manage Teams</span>
                <span
                  className={`dropdown-arrow ${
                    showTeamsDropdown ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              {showTeamsDropdown && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuClick("/create-team")}
                  >
                    Create Team
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuClick("/modify-teams")}
                  >
                    Modify Team
                  </div>
                </div>
              )}
            </div>

            {/* Generate Report */}
            <div className="menu-item">
              <div
                className="menu-option"
                onClick={() => handleMenuClick("/generate-report")}
              >
                <span>Generate Report</span>
              </div>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
