import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCalendar, mdiClockOutline, mdiMapMarker, mdiTicket } from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import isTokenExpired from "../../utils/verifyToken";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const { token, userData, logout } = useAuth();
  const location = useLocation();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchEventDetails = async () => {
      const tk = isTokenExpired(token);
      try {
        const response = await axios.get(`${BASE_URL}/api/event/${eventId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          const data = response.data;
          console.log(data)
          setEvent(data);
        } else {
          console.error("Failed to fetch event details", response);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
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
          console.error("API request failed with status:", error.response ? error.response.status : "unknown");
        }
      }
    };

    if (!tokenExpired) {
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

  if (!event) {
    return <p>Loading...</p>;
  }

  const {
    title,
    description,
    images,
    date,
    time,
    venue,
    totalSeats,
    availableSeats,
    ticketPrice,
  } = event;

  return (
    <div className="container mx-auto p-4">
      <div className=" bg-white rounded-lg overflow-hidden shadow-md">
       {images.length >0 &&  /\.(jpg|jpeg|png|gif|bmp)$/.test(images[0]) ? (
                    <img
                    src={
                      images[0] instanceof File
                      ? URL.createObjectURL(images[0])
                      : images[0]
                      }
                    alt={`Event Media`}
                    width="100%"
                    height="100%"
                    className="w-full h-64 object-cover object-center"
                    />
                ) : (
                  <video
                  src={
                    images[0] instanceof File
                    ? URL.createObjectURL(images[0])
                    : images[0]
                    }
                    width="100%"
                    height="100%"
                    className="w-full h-64 object-cover object-center"
                    autoPlay  // Enable autoplay
        controls  // Show playback controls
        loop  // Loop the video
  
                  />  )}
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-black mb-4">{title}</h2>
          <div className="flex  mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "details" ? "bg-black text-white" : "bg-white text-black border "} rounded-md  ml-5`}
              onClick={() => setActiveTab("details")}
            >
              Event Details
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "gallery" ? "bg-black text-white" : "bg-white text-black border "} rounded-md  ml-5`}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
            </button>
          </div>
          {activeTab === "details" && (
            <div>
            {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">Description:</h1> */}
<p className="text-lg text-gray-700 mb-6 leading-relaxed">{description}</p>

              <div className="flex items-center text-black mb-4">
                <Icon path={mdiCalendar} size={1} className="mr-2" />
                <p className="font-semibold">Date:</p>
                <p className="ml-2">{new Date(date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center text-black mb-4">
                <Icon path={mdiClockOutline} size={1} className="mr-2" />
                <p className="font-semibold">Time:</p>
                <p className="ml-2">{time}</p>
              </div>
              <div className="flex items-center text-black mb-4">
                <Icon path={mdiMapMarker} size={1} className="mr-2" />
                <p className="font-semibold">Venue:</p>
                <p className="ml-2">{venue}</p>
              </div>
              <div className="flex items-center text-black mb-4">
                <Icon path={mdiTicket} size={1} className="mr-2" />
                <p className="font-semibold">{`Price:`}</p>
                <p className="ml-2">{`$${ticketPrice}`}</p>
              </div>
              <div className="flex items-center text-black mb-4">
                <p className="font-semibold">{`Total Seats:`}</p>
                <p className="ml-2">{totalSeats}</p>
                <p className="ml-4 font-semibold">{`Available Seats:`}</p>
                <p className="ml-2">{availableSeats}</p>
              </div>
            </div>
          )}
          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images && images.map((image, index) => (
                   /\.(jpg|jpeg|png|gif|bmp)$/.test(image) ? (
                    <img
                    src={
                      image instanceof File
                      ? URL.createObjectURL(image)
                      : image
                      }
                    alt={`Event Media ${index + 1}`}
                    width="100%"
                    height="100%"
                    className="w-full h-64 object-cover object-center"
                    />
                ) : (
                  <video
                  src={
                    image instanceof File
                    ? URL.createObjectURL(image)
                    : image
                    }
                    width="100%"
                    height="100%"
                    className="w-full h-64 object-cover object-center"
                    controls
  
                  />  )
              ))}
            </div>
          )}


          <div className="flex justify-end mt-4">
            {userData.role === "admin" ? (
              <Link
                to={`/admin/update-event/${event._id}`}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Update Event
              </Link>
            ) : (
              <Link
                to={`/user/checkout/${event._id}`}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
