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
const UpdateEvent = () => {
  const { eventId } = useParams();
  const { token, userData,logout } = useAuth();
  const [newPhotos, setNewPhotos] = useState([]);
  const [tokenExpired,setTokenExpired] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();

  const [eventInfo, setEventInfo] = useState({
    title: "",
    details: "",
    photos: [],
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
            photos: data.images,
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

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewPhotos([...newPhotos, ...files]);
  };
  const handleRemoveLocalPhoto = (index) => {
    // Copy the newPhotos array
    const updatedNewPhotos = [...newPhotos];

    // Remove the photo at the specified index
    updatedNewPhotos.splice(index, 1);

    // Update the newPhotos state
    setNewPhotos(updatedNewPhotos);
  };

  const handleRemovePhoto = async (index) => {
    try {
      const imageLinkToDelete = eventInfo.photos[index];
  
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
        const updatedPhotos = [...eventInfo.photos];
        updatedPhotos.splice(index, 1);
        setEventInfo({ ...eventInfo, photos: updatedPhotos });
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

  const handleUpdateEvent = async () => {
    try {
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
      newPhotos.forEach((file, index) => {
        formData.append("images", file);
      });
  
      // Send the update request using Axios
      const response = await axios.put(`${BASE_URL}/api/event/update-event`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data', // Set content type for FormData
        },
      });
  
      if (response.status === 200) {
        console.log("Event updated successfully!");
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
            Event Photos
          </label>
          <input
            type="file"
            id="eventPhotos"
            name="photos"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          <div className="m-2 flex flex-wrap ">
            {eventInfo.photos.length > 0 && (
              <>
                {eventInfo.photos.map((photo, index) => (
                  <div key={index} className="relative bg-green">
                    <img
                      src={
                        photo instanceof File
                          ? URL.createObjectURL(photo)
                          : photo
                      }
                      alt={`Event Photo ${index + 1}`}
                      width="100%"
                      height="100%"
                      className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0  p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                      onClick={() => handleRemovePhoto(index)}
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
            {newPhotos.length > 0 && (
              <>
                {newPhotos.map((photo, index) => (
                  <div key={index} className="relative bg-green">
                    <img
                      src={
                        photo instanceof File
                          ? URL.createObjectURL(photo)
                          : photo
                      }
                      alt={`Event Photo ${index + 1}`}
                      width="100%"
                      height="100%"
                      className="h-16 w-16 object-contain m-4 rounded-md sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0  p-1 bg-white rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                      onClick={() => handleRemoveLocalPhoto(index)}
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
          className="bg-black text-white py-2 px-4 rounded-md transition duration-300"
        >
          Update Event
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
