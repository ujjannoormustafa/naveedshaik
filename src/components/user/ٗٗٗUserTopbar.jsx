import React, { useState, useRef, useEffect } from "react";
import { mdiMenu, mdiMagnify, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../services/api";

const UserTopbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { userData, token, logout, isLoggedIn } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Tracks the selected index for sections
  const [selectedEventIndex, setSelectedEventIndex] = useState(-1); // Tracks the selected index for events
  const [selectedRoouteIndex, setSelectedRoouteIndex] = useState(-1); //
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const routes = [
    { name: 'Profile', path: '/user/change-profile' },
    { name: 'Dashboard', path: '/user' },
    { name: 'Events', path: '/user/view-events' },
    { name: 'Booked Events', path: '/user/booked-events' },
  ];

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/event/get-all-events`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          setEvents(response.data);
          console.log(response.data);
          setFilteredEvents(response.data)
        } else {
          console.error("Failed to fetch events", response);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired");
          logout();
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again.", from: location.pathname }
          });
        } else {
          console.error("API request failed with status:", error.response ? error.response.status : error.message);
        }
      }
    };
    fetchEvents();
  }, [token, logout, navigate, location.pathname]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
       if (filteredRoutes.length > 0 || filteredEvents.length > 0) {
        let newIndex;
        if (event.key === 'ArrowDown') {
        //  if(selectedIndex < filteredRoutes.length){
        //    newIndex = selectedIndex + 1;
        //    if (newIndex >= filteredRoutes.length) {
        //      newIndex = 0;
        //    }
        //  }else if (selectedIndex < filteredEvents.length+filteredRoutes.length){
        //    newIndex = selectedEventIndex + 1;
           
        //    if (newIndex >= filteredEvents.length+filteredRoutes.length) {
        //      newIndex = 0;
        //    }
        //  }
        setSelectedIndex(selectedIndex +1)

        console.log(selectedIndex);
          if (selectedIndex < filteredRoutes.length -2) {
            // setSelectedIndex(newIndex);
            setSelectedRoouteIndex(selectedIndex);
            setSelectedEventIndex(-1);
          } else {
            // setSelectedIndex(filteredEvents.length +1);
            setSelectedRoouteIndex(-1);
            setSelectedEventIndex(selectedIndex - filteredRoutes.length +1);
           
          }
         
          
          if(selectedIndex >= filteredRoutes.length + filteredEvents.length -2){
            console.log("Reset");
            setSelectedIndex(-1);
            setSelectedEventIndex(-1);
            setSelectedRoouteIndex(-1);
          }
        }else if (event.key === 'ArrowUp') {
          console.log("arrow up");
          setSelectedIndex(selectedIndex -1)

          console.log(selectedIndex);
          if (selectedIndex >= 0 && selectedIndex < filteredRoutes.length-1) {
            // setSelectedIndex(newIndex)
            setSelectedRoouteIndex(selectedIndex );
            setSelectedEventIndex(-1);
          } else {
            // setSelectedIndex(filteredEvents.length +1);
            setSelectedRoouteIndex(-1);
            setSelectedEventIndex(selectedIndex - filteredRoutes.length -1);
           
          }
         
          // setSelectedIndex(selectedIndex +3)
          if(selectedIndex <=0){
            console.log("Reset");
            setSelectedIndex(filteredEvents.length + filteredRoutes.length - 2);
            setSelectedEventIndex(filteredEvents.length);
            setSelectedRoouteIndex(0);
          }
          


          // if(selectedIndex < filteredRoutes.length){
          //   newIndex = filteredEvents.length + filteredRoutes.length - 1;
          //   if (newIndex <= filteredRoutes.length) {
          //     newIndex = 0;
          //   }
          // }else if (selectedIndex < filteredEvents.length+filteredRoutes.length){
          //   newIndex = selectedEventIndex -1 ;
            
          //   if (newIndex >= filteredEvents.length+filteredRoutes.length) {
          //     newIndex = 0;
          //   }
          // }
        
          }
          
         
          
        }
      } else if (event.key === 'Enter') {
        if (selectedIndex - filteredRoutes.length <0) {
          console.log("route index is " + selectedIndex);
          handleSelect(selectedIndex);
        } else if (selectedEventIndex !== -1) {
          console.log("event index is " + selectedEventIndex);
          handleSelectEvent(selectedEventIndex);
        }
        handleBlur()
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [filteredRoutes, filteredEvents, selectedIndex, selectedEventIndex]);

  const handleSelect = (index) => {
    const selectedRoute = filteredRoutes[index];
    console.log('Selected route:', selectedRoute);
    // Handle section selection logic here
    navigate(selectedRoute?.path);
  };

  const handleSelectEvent = (index) => {
    const selectedEvent = filteredEvents[index];
    console.log('Selected event:', selectedEvent);
    // Handle event selection logic here
    // Example: navigate to event details page
    navigate(`/user/${selectedEvent._id}`);
  };

  const filterRoutes = (value) => {
    const filteredSections = routes.filter((route) =>
      route.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoutes(filteredSections);
    setSelectedIndex(-1); // Reset selectedIndex when filtering routes
  };

  const filterEvents = (value) => {
    const filteredEvents = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );
    console.log("filtered events",filteredEvents);
    setFilteredEvents(filteredEvents);
    setSelectedEventIndex(-1); // Reset selectedEventIndex when filtering events
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (filteredRoutes.length > 0 && selectedIndex !== -1) {
        handleSelect(selectedIndex);
      } else if (filteredEvents.length > 0 && selectedEventIndex !== -1) {
        handleSelectEvent(selectedEventIndex);
      } else {
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
    console.log("handleClickOption");
   
      setSelectedIndex(index);
      setSelectedEventIndex(-1);
      navigate(filteredRoutes[index].path);
   
  };

  const handleChange = (e) => {
    setIsFocused(true);
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterRoutes(value);
    filterEvents(value);
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

  const handleLogout = () => {
    console.log("Logout clicked");
    setDropdownVisible(false);
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const handleEventClick = (eventId)=>{
    navigate(`/user/${eventId}`);
  }

  return (
    <>
      {isLoggedIn && (
        <div className="bg-black p-4 flex flex-row justify-between items-center text-white w-full block relative border-white">
          <div className="toggle-button" onClick={onToggleSidebar}>
            <Icon id="toggleButton" path={mdiMenu} size={1} />
          </div>

          <div className=" mx-2 relative w-full sm:max-w-xs">
            <div
              className="flex items-center bg-white p-2 rounded-full"
              ref={dropdownRef}
            >
              <Icon path={mdiMagnify} size={1} color="black" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2  bg-white border-none focus:outline-none text-black"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {isFocused && (filteredRoutes.length > 0 || filteredEvents.length > 0) && (
              <div className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md z-10">
                {filteredRoutes.length > 0 && (
                  <>
                    <h3 className="p-2 text-xl font-bold bg-gray-100 text-black">Sections</h3>
                    <ul>
                      {filteredRoutes.map((route, index) => (
                        <li
                          key={index}
                          className={`p-2 cursor-pointer ${selectedIndex === index ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-900 hover:text-white'}`}
                          // onMouseDown={() => handleClickOption(index)}
                          onClick={() => handleClickOption(index)}
                         
                        >
                          {route.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {filteredEvents.length > 0 && (
                  <>
                    <h3 className="p-2 text-xl font-bold bg-gray-100 text-black">Events</h3>
                    <ul>
                      {filteredEvents.map((event, index) => (
                        <li
                          key={index}
                          className={`p-2 cursor-pointer ${selectedEventIndex === index ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-900 hover:text-white'}`}
                          // onMouseDown={() => handleClickOption(index + filteredRoutes.length -1)}
                          onClick={() => handleEventClick(event._id)}

                        >
                          <div className="flex items-center">
                            {event.images && (
                              <img
                                src={event?.images[0]} // Assuming event.image contains the URL of the image
                                alt={event.title} // Provide a meaningful alt text
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="ml-3">
                              <h3 >{event.title}</h3>
                              {/* Add more attributes here like description, date, etc. if needed */}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {isFocused && filteredRoutes.length === 0 && filteredEvents.length === 0 && (
              <ul className="absolute bg-white text-black border border-gray-300 w-full mt-1 rounded-md z-10">
                <li className="p-2 text-black hover:text-white cursor-pointer hover:bg-gray-900">
                  No matching results
                </li>
              </ul>
            )}
          </div>

          <div className="relative   ">
            <div className="cursor-pointer" onClick={toggleDropdown}>
              {userData.profileImage ? (
                <img
                   className="w-12 h-10 sm:w-12 sm:h-auto rounded-full"
                  src={userData.profileImage}
                  alt="Rounded avatar"
                />
              ) : (
                <Icon path={mdiAccountCircle} size={1.5} color="white" />
              )}
            </div>
          </div>

          <div
            className={`${dropdownVisible ? "block" : "hidden"} z-50 absolute top-14 right-4 text-base list-none bg-black divide-y divide-gray-100 rounded-lg shadow border border-white`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-white dark:text-white">
                {userData?.full_name}
              </span>
              <span className="block text-sm text-white truncate">
                {userData?.email}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <Link
                  to="/user"
                  className="block px-4 py-2 text-sm text-white hover:bg-black"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to='/user/change-profile'
                  className="block px-4 py-2 text-sm text-white hover:bg-black"
                >
                  Profile
                </Link>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-white hover:bg-black"
                >
                  Earnings
                </a>
              </li> */}
              <li>
                <Link
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-white hover:bg-black"
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
