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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const { userData, token, logout, isLoggedIn } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Tracks the selected index

  const navigate = useNavigate();
  const routes = [
    { name: 'Profile', path: '/admin/change-profile' },
    { name: 'Dashboard', path: '/admin' },
    { name: 'Settings', path: '/settings' },
    { name: 'Create Event', path: '/admin/create-event' },
    { name: 'Event List', path: '/admin/event-list' },
    { name: 'Calendar', path: '/admin/calendar' },
    { name: 'Connect Account', path: '/admin/connect-account' },
    { name: 'Check Account Status', path: '/admin/check-account-status' },
    { name: 'Verify Account Requirements', path: '/admin/verify-requirements' },
    { name: 'Add External Account', path: '/admin/add-external-account' },
    { name: 'View Balance', path: '/admin/view-balance' },
    { name: 'Manage Account', path: '/admin/manage-account' },
    { name: 'All Payments', path: '/admin/all-payments' },
  ];
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredRoutes.length - 1 ? prevIndex + 1 : 0
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredRoutes.length - 1
        );
      } else if (event.key === 'Enter' && selectedIndex !== -1) {
        handleSelect(filteredRoutes[selectedIndex].path);
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [filteredRoutes, selectedIndex]);
  const filterRoutes = (value) => {
    const filtered = routes.filter((route) =>
      route.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoutes(filtered);
    setSelectedIndex(-1); // Reset selectedIndex when filtering routes
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && filteredRoutes.length > 0) {
      if(filteredRoutes[selectedIndex] != undefined){
        handleSelect(filteredRoutes[selectedIndex].path);
      }else{
        const value = e.target.value.toLowerCase();
      const matchedRoute = routes.find(route =>
        route.name.toLowerCase() === value
      );
      if (matchedRoute) {
        navigate(matchedRoute.path);
      } else {
        console.log("No matching route found");
      }
      }
    }
  };
  const handleClickOption = (index) => {
    setSelectedIndex(index);
    handleSelect(filteredRoutes[index].path);
  };

  const handleChange = (e) => {
    setIsFocused(true)
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterRoutes(value);
  };

  const handleSelect = (path) => {
    console.log("handleSelect called");
    console.log(path);
    navigate(path);
    setIsFocused(false)
    setSearchTerm('');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200); // Delay to allow click to register before hiding
  };

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

          <div className="relative">
            <div
              className="flex items-center bg-white p-2 rounded-full"
              // style={{ borderRadius: '5%' }}
              ref={dropdownRef}
            >
              <Icon path={mdiMagnify} size={1} color="black" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-white border-none focus:outline-none text-black"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            {isFocused && filteredRoutes.length > 0 && (
              <ul className="absolute bg-white text-black border border-gray-300 w-full mt-1 rounded-md z-10">
                {filteredRoutes.map((route, index) => (
                  <li
                    key={index}
                    className={`p-2 cursor-pointer ${selectedIndex === index ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-900 hover:text-white'}`}
                    onMouseDown={() => handleClickOption(index)} // Using onMouseDown to prevent blur before click
                  >
                    {route.name}
                  </li>
                ))}
              </ul>
            )}
            {isFocused && filteredRoutes.length === 0 && (
              <ul className="absolute bg-white text-black border border-gray-300 w-full mt-1 rounded-md z-10">
                <li className="p-2 text-black hover:text-white cursor-pointer hover:bg-gray-900">
                  No matching Route
                </li>
              </ul>
            )}
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
