import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/DashboardHome";
import CreateTeam from "./components/CreateTeam.jsx";
import ModifyTeams from "./components/ModifyTeams.jsx";
import GenerateReport from "./components/GenerateReport.jsx";
import Sidebar from "./core/Sidebar.jsx";
import Header from "./core/Header";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/modify-teams" element={<ModifyTeams />} />
          <Route path="/generate-report" element={<GenerateReport />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
