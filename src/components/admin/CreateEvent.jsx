import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  mdiCalendar,
  mdiClockTimeThree,
  mdiMapMarker,
  mdiTicket,
  mdiImage,
} from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
const CreateEvent = () => {
  const { token, userData,logout } = useAuth();
  const location = useLocation()
  const navigate = useNavigate()
  const [tokenExpired,setTokenExpired] = useState(false)
  const [eventInfo, setEventInfo] = useState({
    title: "",
    details: "",
    images: [],
    date: "",
    time: "",
    venue: "",
    totalSeats: "",
    ticketPrice: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventInfo({ ...eventInfo, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setEventInfo({ ...eventInfo, images: [...eventInfo.images, ...files] });
  };
  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...eventInfo.images];
    updatedPhotos.splice(index, 1);
    setEventInfo({ ...eventInfo, images: updatedPhotos });
  };
  const handleCreateEvent = async () => {
    try {
      // Check if the token is available
      if (!token) {
        console.error("User token not available");
        return;
      }
  
      // Prepare the form data
      const formData = new FormData();
      formData.append("title", eventInfo.title);
      formData.append("description", eventInfo.details);
      formData.append("date", eventInfo.date);
      formData.append("time", eventInfo.time);
      formData.append("venue", eventInfo.venue);
      formData.append("totalSeats", eventInfo.totalSeats);
      formData.append("ticketPrice", eventInfo.ticketPrice);
  
      // Append each image file to the form data
      for (const imageFile of eventInfo.images) {
        formData.append("images", imageFile); // Ensure this matches the API endpoint's field name
      }
  
      // Make the API request using axios
      const response = await axios.post(`${BASE_URL}/api/event/create-event`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data', // Ensure correct content type for FormData
        },
      });
  
      // Check if the request was successful (status code 2xx)
      if (response.status === 200) {
        const responseData = response.data;
        // Handle success scenario
        console.log("Event created successfully:", responseData.event);
        setEventInfo({
          title: "",
          details: "",
          images: [],
          date: "",
          time: "",
          venue: "",
          totalSeats: "",
          ticketPrice: "",
        });
        // Notify user of success
        toast.success("Event Created successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Handle errors if the request was not successful
        console.error("Failed to create event:", response);
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
          toast.error(response?.data?.message || "Failed to create event", {
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
      // Handle general error scenarios
      console.error("Error creating event:", error);
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
        toast.error(error.message || "Error creating event", {
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
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call your register function here
      handleCreateEvent();
    }
  };
  return (
    <div className="bg-white container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-semibold mb-4">Create Event</h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="eventTitle"
            className="block text-lg font-bold  text-black"
          >
            Event Title
          </label>
          <input
            type="text"
            id="eventTitle"
            name="title"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            value={eventInfo.title}
            className="mt-1 p-2 border border-black rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="eventDetails"
            className="block text-lg font-bold  text-black"
          >
            Event Details
          </label>
          <textarea
            id="eventDetails"
            name="details"
            rows="3"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            value={eventInfo.details}
            className="mt-1 p-2 border border-black rounded-md w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="eventPhotos"
            className="block text-lg font-bold  text-black"
          >
            Event Photos
          </label>
          <input
            type="file"
            id="eventPhotos"
            name="photos"
            onChange={handleFileChange}
            onKeyPress={handleKeyPress}
            multiple
            accept="image/*"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {eventInfo.images.length > 0 && (
            <div className="m-2 flex flex-wrap ">
              {eventInfo.images.map((photo, index) => (
                <div key={index} className="relative bg-green">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Event Photo ${index + 1}`}
                    width="100%"
                    height="100%"
                    className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0  p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                    onClick={() => handleRemovePhoto(index)}
                    onKeyPress={handleKeyPress}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-7 w-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="eventDate"
              className="block text-lg font-bold  text-black"
            >
              Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="date"
              onChange={handleInputChange}
              value={eventInfo.date}
              className="mt-1 p-2 border border-black rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventTime"
              className="block text-lg font-bold  text-black"
            >
              Time
            </label>
            <input
              type="time"
              id="eventTime"
              name="time"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={eventInfo.time}
              className="mt-1 p-2 border border-black rounded-md w-full "
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="eventVenue"
            className="block text-lg font-bold  text-black"
          >
            Venue
          </label>
          <input
            type="text"
            id="eventVenue"
            name="venue"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            value={eventInfo.venue}
            className="mt-1 p-2 border border-black rounded-md w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="eventSeats"
              className="block text-lg font-bold  text-black"
            >
              Total Seats
            </label>
            <input
              type="number"
              id="eventSeats"
              name="totalSeats"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={eventInfo.totalSeats}
              className="mt-1 p-2 border border-black rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="eventPrice"
              className="block text-lg font-bold  text-black"
            >
              Ticket Price
            </label>
            <input
              type="number"
              id="eventPrice"
              name="ticketPrice"
              required
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={eventInfo.ticketPrice}
              className="mt-1 p-2 border border-black rounded-md w-full"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCreateEvent}
          className="bg-black text-white py-2 px-4 rounded-md transition duration-300"
        >
          Create Event
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
