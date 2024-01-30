import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/admin/HomePage";
import MySidebar from "./components/Sidebar";
import AddEventPage from "./pages/admin/AddEventPage";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app flex flex-row w-full">
      <MySidebar isOpen={isSidebarOpen} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Topbar onToggleSidebar={handleToggleSidebar} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-event" element={<AddEventPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
