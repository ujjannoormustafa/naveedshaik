import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import HomePage from "../pages/admin/HomePage";
import MySidebar from "../components/Sidebar";
import AddEventPage from "../pages/admin/AddEventPage";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import EventCalendar from "../components/Calendar";
import CalendarPage from "../pages/admin/CalendarPage";
import UpdateEventPage from "../pages/admin/UpdateEventPage";
import EventListPage from "../pages/admin/EventListPage";
import Signup from "../components/Register";

function AdminLayout() {
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
          <Outlet /> {/* Render nested routes */}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
