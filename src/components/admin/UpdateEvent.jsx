import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import Compressor from "compressorjs"; // Import Compressor library

const UpdateEvent = () => {
  const { eventId } = useParams();
  const { token, userData,logout } = useAuth();
  const [newPhotos, setNewPhotos] = useState([]);
  const [tokenExpired,setTokenExpired] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    console.log('useEffect called'); // Add this to see when useEffect is called
    console.log('eventId:', eventId);
    console.log('token:', token);
    console.log('location:', location);
   
      
    

    const fetchEventDetails = async () => {

     

      try {
        const response = await axios.get(`${BASE_URL}/api/event/${eventId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setEventInfo({
            title: data.title,
            details: data.description,
            mediaFiles: data.images,
            date: data.date.split("T")[0],
            time: data.time,
            venue: data.venue,
            totalSeats: data.totalSeats,
            ticketPrice: data.ticketPrice,
          });
          
          console.log(data);
        } else {
          console.error("Failed to fetch event details", response);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token expired");
          logout();
          setTokenExpired(true)
          navigate("/login", {
            replace: true,
            state: {
              message: "Session expired. Please log in again.",
              from: location.pathname,
            },
          });
        } else {
          console.error("API request failed with status:", error.response ? error.response.status : "unknown");
        }
      }
    };

    if (!tokenExpired ) {
      fetchEventDetails();
    } else {
      navigate("/login", {
        replace: true,
        state: {
          message: "You need to be logged in to view this page.",
          from: location.pathname,
        },
      });
    }
  }, [eventId, token, logout, navigate]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventInfo({ ...eventInfo, [name]: value });
  };

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const handleFileChange = (e) => {
  const files = e.target.files;
  const validFiles = [];

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

    validFiles.push(file);
  }

  // Update state with valid files
  setNewPhotos(prevPhotos => [...prevPhotos, ...validFiles]);
};
  const handleRemoveLocalMedia = (index) => {
    // Copy the newPhotos array
    const updatedNewPhotos = [...newPhotos];

    // Remove the photo at the specified index
    updatedNewPhotos.splice(index, 1);

    // Update the newPhotos state
    setNewPhotos(updatedNewPhotos);
  };
  // const handleRemoveMedia = (index) => {
  //   const updatedMediaFiles = [...eventInfo.mediaFiles];
  //   updatedMediaFiles.splice(index, 1);
  //   setEventInfo({ ...eventInfo, mediaFiles: updatedMediaFiles });
  // };
  const handleRemoveMedia = async (index) => {
    try {
      const imageLinkToDelete = eventInfo.mediaFiles[index];
      console.log(imageLinkToDelete);
  
      // Make API request to delete the image
      const response = await axios.delete(`${BASE_URL}/api/event/delete-image`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        data: {
          eventId,
          imageLink: imageLinkToDelete,
        },
      });
  
      if (response.status === 200) {
        console.log("Image deleted successfully!");
  
        // Update state to rerender the component
        const updatedPhotos = [...eventInfo.mediaFiles];
        updatedPhotos.splice(index, 1);
        setEventInfo({ ...eventInfo, mediaFiles: updatedPhotos });
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      if (error.response && error.response.status === 401) {
        console.log("Token expired");
        logout();
        setTokenExpired(true);
        navigate("/login", {
          replace: true,
          state: {
            message: "Session expired. Please log in again.",
            from: location.pathname,
          },
        });
      }
    }
  };
  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     handleUpdateEvent();
  //   }
  // };

  const handleUpdateEvent = async () => {
    try {
      setLoading(true)
      // Prepare the update request body
      const formData = new FormData();
  
      formData.append("eventId", eventId);
      formData.append("title", eventInfo.title);
      formData.append("description", eventInfo.details);
      formData.append("date", eventInfo.date);
      formData.append("time", eventInfo.time);
      formData.append("venue", eventInfo.venue);
      formData.append("totalSeats", parseInt(eventInfo.totalSeats));
      formData.append("ticketPrice", parseFloat(eventInfo.ticketPrice));
  
      // Append new photos
      for (const mediaFile of eventInfo.mediaFiles) {
        formData.append("mediaFiles", mediaFile);
      }
      for (const mediaFile of newPhotos) {
        formData.append("mediaFiles", mediaFile);
      }
      console.log(formData.time);
      // Send the update request using Axios
      const response = await axios.put(`${BASE_URL}/api/event/update-event`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data', // Set content type for FormData
        },
      });
  
      if (response.status === 200) {
        console.log("Event updated successfully!");
        setLoading(false)
        // You can redirect the user or perform other actions after successful update
        toast.success("Event Updated successfully!", {
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
        setLoading(false)
        console.error("Failed to update event:", response);
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
          setLoading(false)
          // Notify user of specific error message
          toast.error(response?.data?.message || "Failed to update event", {
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
      console.error("Error updating event:", error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        // Token expired, handle logout and redirection
        console.log("Token expired");
        logout();
        setTokenExpired(true);
        navigate("/login", {
          replace: true,
          state: {
            message: "Session expired. Please log in again.",
            from: location.pathname,
          },
        });
      } else {
        // Notify user of error
        setLoading(false)
        toast.error(error.message || "Failed to update event", {
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
  return (
    <div className="bg-white container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-semibold mb-4">Update Event</h2>
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
            value={eventInfo.details}
            className="mt-1 p-2 border border-black rounded-md w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="eventPhotos"
            className="block text-lg font-bold  text-black"
          >
            Event Media
          </label>
          <input
            type="file"
            id="eventMedia"
            name="mediaFiles"
            onChange={handleFileChange}
            // onKeyPress={handleKeyPress}
            multiple
            accept="image/*,video/*"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          <div className="m-2 flex flex-wrap ">
            {/* {
              eventInfo.photos.map((link) => {
                const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(link);
                const isVideo = /\.(mp4|mov|webm)$/.test(link);
                console.log(isImage);
                console.log(isVideo);
              })
            } */}
            
            {eventInfo?.mediaFiles?.length > 0 && (
              <>
                {eventInfo?.mediaFiles?.map((photo, index) => (
                  <div key={index} className="relative bg-green">
                    { 
                    
                    /\.(jpg|jpeg|png|gif|bmp)$/.test(photo) ? (
                  <img
                  src={
                    photo instanceof File
                    ? URL.createObjectURL(photo)
                    : photo
                    }
                  alt={`Event Media ${index + 1}`}
                  width="100%"
                  height="100%"
                  className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                />
              ) : (
                <video
                src={
                  photo instanceof File
                  ? URL.createObjectURL(photo)
                  : photo
                  }
                  width="100%"
                  height="100%"
                  className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                  controls

                />  )
                  }
                    <button
                      type="button"
                      className="absolute top-0 right-0  p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                      onClick={() => handleRemoveMedia(index)}
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
              </>
            )}
            {newPhotos?.length > 0 && (
              <>
              {console.log(newPhotos)}
                {newPhotos?.map((photo, index) => (
                  <div key={index} className="relative bg-green">
                    {console.log(photo)}
                    { 
                    
                    /\.(jpg|jpeg|png|gif|bmp)$/.test(photo.name) ? (
                  <img
                  src={
                    photo instanceof File
                    ? URL.createObjectURL(photo)
                    : photo
                    }
                  alt={`Event Media ${index + 1}`}
                  width="100%"
                  height="100%"
                  className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                />
              ) : (
                <video
                src={
                  photo instanceof File
                  ? URL.createObjectURL(photo)
                  : photo
                  }
                  width="100%"
                  height="100%"
                  className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                  controls

                />  )
                  }
                    <button
                      type="button"
                      className="absolute top-0 right-0  p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                      onClick={() => handleRemoveLocalMedia(index)}
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
              </>
            )}
          </div>
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
              onChange={handleInputChange}
              value={eventInfo.ticketPrice}
              className="mt-1 p-2 border border-black rounded-md w-full"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleUpdateEvent}
          disabled={loading}
          className="bg-black text-white py-2 px-4 rounded-md transition duration-300"
        >
          {loading ? "Loading..." : "Update Event"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
