import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  mdiCalendar,
  mdiClockTimeThree,
  mdiMapMarker,
  mdiTicket,
} from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Compressor from "compressorjs"; // Import Compressor library

const CreateEvent = () => {
  const { token, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [loading,setLoading] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    title: "",
    details: "",
    mediaFiles: [],
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
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e) => {
    const files = e.target.files;
    const updatedMediaFiles = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        console.warn('File is too large:', file.name);
        const message = `File ${file.name} is too large. Maximum allowed size is 100MB.`
        toast.error(message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        continue; // Skip files that are too large
      }
  
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        console.warn('Skipping non-image and non-video file:', file.name);
        continue; // Skip non-image and non-video files
      }
  
      updatedMediaFiles.push(file);
    }
  
    // Update eventInfo state to include all selected media files
    setEventInfo(prevEventInfo => ({
      ...prevEventInfo,
      mediaFiles: [...prevEventInfo.mediaFiles, ...updatedMediaFiles]
    }));
  };
  
  
  
  


  const handleRemoveMedia = (index) => {
    const updatedMediaFiles = [...eventInfo.mediaFiles];
    updatedMediaFiles.splice(index, 1);
    setEventInfo({ ...eventInfo, mediaFiles: updatedMediaFiles });
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error("User token not available");
        return;
      }
      if(!eventInfo.mediaFiles){
        console.log(eventInfo.mediaFiles);
        console.log("No Media Files");
      }else{
        console.log("Media files are present");
        console.log(eventInfo.mediaFiles);
      }
      const formData = new FormData();
      formData.append("title", eventInfo.title);
      formData.append("description", eventInfo.details);
      formData.append("date", eventInfo.date);
      formData.append("time", eventInfo.time);
      formData.append("venue", eventInfo.venue);
      formData.append("totalSeats", eventInfo.totalSeats);
      formData.append("ticketPrice", eventInfo.ticketPrice);

      for (const mediaFile of eventInfo.mediaFiles) {
        formData.append("mediaFiles", mediaFile);
      }

      const response = await axios.post(`${BASE_URL}/api/event/create-event`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000000, // Timeout set to 10 seconds
      });

      if (response.status === 200) {
        setLoading(false)
        const responseData = response.data;
        console.log("Event created successfully:", responseData.event);
        setEventInfo({
          title: "",
          details: "",
          mediaFiles: [],
          date: "",
          time: "",
          venue: "",
          totalSeats: "",
          ticketPrice: "",
        });
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
        setLoading(false)
        console.error("Failed to create event:", response);
        if (response.status === 401) {
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
          setLoading(false)
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
      setLoading(false)
      console.error("Error creating event:", error);
      if (error.response && error.response.status === 401) {
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
        setLoading(false)
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
            className="block text-lg font-bold text-black"
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
            className="block text-lg font-bold text-black"
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
            htmlFor="eventMedia"
            className="block text-lg font-bold text-black"
          >
            Event Media
          </label>
          <input
            type="file"
            id="eventMedia"
            name="mediaFiles"
            onChange={handleFileChange}
            onKeyPress={handleKeyPress}
            multiple
            accept="image/*,video/*"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          {eventInfo.mediaFiles.length > 0 && (
            <div className="m-2 flex flex-wrap">
              {eventInfo.mediaFiles.map((file, index) => (
                <div key={index} className="relative bg-green">
                  {console.log(file.type.startsWith("image/"))}
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Event Media ${index + 1}`}
                      width="100%"
                      height="100%"
                      className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      width="100%"
                      height="100%"
                      className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                    onClick={() => handleRemoveMedia(index)}
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
              className="block text-lg font-bold text-black"
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
              className="block text-lg font-bold text-black"
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
              className="mt-1 p-2 border border-black rounded-md w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="eventVenue"
            className="block text-lg font-bold text-black"
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
              className="block text-lg font-bold text-black"
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
              className="block text-lg font-bold text-black"
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
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
