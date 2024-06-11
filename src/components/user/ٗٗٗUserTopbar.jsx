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

const UserTopbar = ({ onToggleSidebar }) => {
    
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
              {userData?.profileImage ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={userData?.profileImage}
                  alt="Rounded avatar"
                />
              ) : (
               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black">
          {userData.full_name ? (
            <span className="text-xl">{userData.full_name.charAt(0)}</span>
          ) : (
            <Icon path={mdiAccountCircle} size={1.5} color="white" />
          )}
        </div>
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
              <span className="block text-sm text-gray-900 dark:text-white">
               {userData.full_name}
              </span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                {userData.email}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <Link to='/user'
                  onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to='/user/change-profile'
                  onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                 Profile
                </Link>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li> */}
              <li>
                <Link
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
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

export default UserTopbar;
