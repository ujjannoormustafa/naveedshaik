// Topbar.jsx
import React from "react";
import { mdiMenu, mdiMagnify, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";

const Topbar = ({ onToggleSidebar }) => {
  const handleProfileClick = () => {
    // Handle user profile click
    console.log("User profile clicked");
  };

  const handleLogoutClick = () => {
    // Handle logout click
    console.log("Logout clicked");
  };

  return (
    <div className="bg-gray-800 p-4 flex flex-row justify-between items-center text-white w-full block">
      <div className="toggle-button" onClick={onToggleSidebar}>
        <Icon id="toggleButton" path={mdiMenu} size={1} />
      </div>

      <div className="flex items-center">
        <Icon path={mdiMagnify} size={1} color="white" />
        <input
          type="text"
          placeholder="Search"
          className="ml-2 bg-transparent border-none focus:outline-none text-white"
        />
      </div>

      <div className="flex items-center">
        <div className="cursor-pointer mr-4" onClick={handleProfileClick}>
          <Icon path={mdiAccountCircle} size={1.5} color="white" />
        </div>
        <div className="cursor-pointer" onClick={handleLogoutClick}>
          <Icon path={mdiAccountCircle} size={1.5} color="white" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
