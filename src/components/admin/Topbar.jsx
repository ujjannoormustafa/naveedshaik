import React, { useState, useRef, useEffect } from "react";
import { mdiMenu, mdiMagnify, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const DropdownMenu = ({ onProfileClick, onLogoutClick, closeDropdown }) => {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
      }}
      className="dropdown-menu"
      onClick={closeDropdown}
    >
      <div className="menu-item" onClick={onProfileClick}>
        <Icon path={mdiAccountCircle} size={1} color="black" />
        Profile
      </div>
      <Link to='/login' className="menu-item" onClick={onLogoutClick}>
        <Icon path={mdiAccountCircle} size={1} color="black" />
        Logout
      </Link>
    </div>
  );
};

const Topbar = ({ onToggleSidebar }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { userData, token, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log("User profile clicked");
    setDropdownVisible(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    setDropdownVisible(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {isLoggedIn && (
        <div className="bg-black p-4 flex flex-row justify-between items-center text-white w-full block relative border-white">
          <div className="toggle-button" onClick={onToggleSidebar}>
            <Icon id="toggleButton" path={mdiMenu} size={1} />
          </div>

          <div
            className="flex items-center bg-white p-2 relative"
            style={{
              borderRadius: "5%",
            }}
            ref={dropdownRef}
          >
            <Icon path={mdiMagnify} size={1} color="black" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-white border-none focus:outline-none text-black"
            />
          </div>

          <div className="relative">
            <div className="cursor-pointer" onClick={toggleDropdown}>
              {userData.profileImage ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={userData.profileImage}
                  alt="Rounded avatar"
                />
              ) : (
                <Icon path={mdiAccountCircle} size={1.5} color="white" />
              )}
            </div>
          </div>

          <div
            className={`${
              dropdownVisible ? "block" : "hidden"
            } z-50 absolute top-14 right-4 text-base list-none bg-black divide-y divide-gray-100 rounded-lg shadow border border-white`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-white dark:text-white">
               {userData?.full_name}
              </span>
              <span className="block text-sm text-white truncate ">
                {userData?.email}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-white hover:bg-black  "
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-white hover:bg-black  "                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-white hover:bg-black  "                >
                  Earnings
                </a>
              </li>
              <li>
                <Link
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-white hover:bg-black  "                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
