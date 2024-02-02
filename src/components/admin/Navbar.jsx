// MainLayout.jsx
import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-grow">
        <Topbar onToggleSidebar={handleToggleSidebar} />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
