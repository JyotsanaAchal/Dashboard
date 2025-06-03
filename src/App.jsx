import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/DashboardHome";
import CreateTeam from "./components/CreateTeam.jsx";
import ManageTeams from "./components/ManageTeams.jsx"; // Assuming this is the correct path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/manage-teams" element={<ManageTeams />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
