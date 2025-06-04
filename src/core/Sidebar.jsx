import React, { useState, useEffect, useRef } from "react";
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
  const [atTop, setAtTop] = useState(true);

  const sidebarRef = useRef(null);
  const personalInfoRef = useRef(null);

  // Hide buttons when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.classList.contains("toggle-button")
      ) {
        setShowSidebar(false);
        setShowTeamsDropdown(false);
      }

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSidebar, showPersonalInfo]);

  const handleMenuClick = (path) => {
    navigate(path);
    setShowSidebar(false);
    setShowTeamsDropdown(false);
    setShowPersonalInfo(false);
  };

  return (
    <>
      <button
        className={`toggle-button ${atTop ? "visible" : "hidden"} ${
          showSidebar ? "open" : ""
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰
      </button>

      <div
        className={`personal-info-container ${atTop ? "visible" : "hidden"}`}
        ref={personalInfoRef}
      >
        <button
          className="personal-info-icon"
          onClick={() => setShowPersonalInfo(!showPersonalInfo)}
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

      {showSidebar && <div className="sidebar-overlay"></div>}

      {showSidebar && (
        <aside className="sidebar" ref={sidebarRef}>
          <nav className="sidebar-menu">
            <div className="menu-item">
              <div
                className="menu-option"
                onClick={() => setShowTeamsDropdown(!showTeamsDropdown)}
              >
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
            <div className="menu-item">
              <div
                className="menu-option"
                onClick={() => handleMenuClick("/generate-report")}
              >
                Generate Report
              </div>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
