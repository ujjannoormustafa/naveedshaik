import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiCalendar,
  mdiClockTimeFourOutline,
  mdiSeat,
  mdiCurrencyUsd,
  mdiMagnify,
} from "@mdi/js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../services/api";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
const EventList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]); // State to store events
  const { token, userData,logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/event/event-list`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          const data = response.data; // Use response.data directly with Axios
          setEvents(data);
        } else {
          // Handle errors if the request was not successful
          console.error("Failed to fetch events:", response);
          if (response.status === 401) {
            // Token expired, handle logout and redirection
            console.log("Token expired");
            logout();
            navigate("/login", {
              replace: true,
              state: {
                message: "Session expired. Please log in again.",
                from: location.pathname,
              },
            });
          } else {
            // Notify user of specific error message
            toast.error(response?.data?.message || "Failed to fetch events", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error fetching events:", error);
        if (error.response && error.response.status === 401) {
          // Token expired, handle logout and redirection
          console.log("Token expired");
          logout();
          navigate("/login", {
            replace: true,
            state: {
              message: "Session expired. Please log in again.",
              from: location.pathname,
            },
          });
        } else {
          // Notify user of specific error message
          toast.error(error.message || "Error fetching events", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    };

    fetchEvents();
  }, [ token, logout, navigate]); // Ensure all dependencies are included in the dependency array

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white container mx-auto mt-8 p-4">
      <ToastContainer/>
      <h1 className="text-3xl font-semibold mb-4">Events</h1>
      <div className="relative mb-8 w-full md:w-2/3 lg:w-1/2 mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon
            path={mdiMagnify}
            title="Search"
            size={1.5}
            className="text-gray-500 "
          />
        </div>
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3  pl-12 rounded-md w-full border-black focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchTerm !== "" ? (
          filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <Event key={index} event={event} />
            ))
          ) : (
            <p>No results found</p>
          )
        ) : (
          events.map((event, index) => <Event key={index} event={event} />)
        )}
      </div>
    </div>
  );
};

const Event = ({ event }) => {
  const {
    _id,
    title,
    description,
    images,
    date,
    time,
    venue,
    availableSeats,
    totalSeats,
    ticketPrice,
  } = event;

  return (
    <div className="relative  border m-2 rounded-md overflow-hidden hover:cursor-pointer">
      <Link to={`/admin/${event._id}`}>
        <div className="h-40 md:h-60 bg-cover bg-center transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-opacity-50 hover:opacity-70 transition-opacity duration-300 ease-in-out ">
          <img
            src={images.length > 0 ? images[0] : "default_image_url"} // Replace with your default image URL
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

          <div className="absolute top-0  left-0 w-full p-4 ">
            <h3 className="text-white text-2xl md:text-3xl font-semibold mb-2 text-center">
              {title}
            </h3>
            <div className="flex items-center text-white mb-2 font-semibold">
              <Icon path={mdiCalendar} title="Date" size={1} className="mr-1" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-white mb-4 font-semibold">
              <Icon
                path={mdiClockTimeFourOutline}
                title="Time"
                size={1}
                className="mr-1"
              />
              <span>{time}</span>
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center p-4 bg-grey ">
              {/* <p className="text-white text-sm md:text-base text-center font-semibold">{description}</p> */}
              {/* <Link href={`/componets/events/eventDetails/${_id}`}>
              <button
                className="bg-black hover:bg-black text-white font-semibold py-2 px-4 rounded-full transition-opacity duration-300 ease-in-out mt-10 self-bottom"
                onClick={() => console.log("View Details clicked")} // Add your functionality here
              >
                View Details
              </button>
            </Link> */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventList;
