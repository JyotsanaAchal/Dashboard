import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/DashboardHome";
import CreateTeam from "./components/CreateTeam.jsx";
import ModifyTeams from "./components/ModifyTeams.jsx";
import Sidebar from "./core/Sidebar.jsx";

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/modify-teams" element={<ModifyTeams />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
