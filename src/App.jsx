import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/DashboardHome";
import CreateTeam from "./components/createTeam"; // Make sure the import matches the filename

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/create-team" element={<CreateTeam />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
