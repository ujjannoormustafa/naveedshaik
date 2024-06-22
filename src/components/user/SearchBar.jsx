import React, { useState, useRef } from "react";
import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import { Link, useNavigate } from "react-router-dom";

const SearchBar = ({ routes, sections, events }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter routes
    const filteredRoutes = routes.filter((route) =>
      route.toLowerCase().includes(value)
    );
    setFilteredRoutes(filteredRoutes);

    // Filter events
    const filteredEvents = events.filter((event) =>
      event.title.toLowerCase().includes(value)
    );
    setFilteredEvents(filteredEvents);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
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
        onChange={handleSearch}
        value={searchTerm}
      />

      {/* Display filtered routes */}
      {filteredRoutes.length > 0 && (
        <div className="search-results">
          {filteredRoutes.map((route, index) => (
            <div
              key={index}
              className="search-item"
              onClick={() => navigateTo(route.path)}
            >
              {route.name}
            </div>
          ))}
        </div>
      )}

      {/* Display filtered events */}
      {filteredEvents.length > 0 && (
        <div className="search-results">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className="search-item"
              onClick={() => navigateTo(`/events/${event._id}`)}
            >
              {event.title}
            </div>
          ))}
        </div>
      )}

      {/* Display no match message */}
      {filteredRoutes.length === 0 && filteredEvents.length === 0 && (
        <div className="search-results">
          <div className="search-item">No matching results found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
