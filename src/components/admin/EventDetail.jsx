import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCalendar, mdiClockOutline, mdiMapMarker, mdiTicket } from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import isTokenExpired from "../../utils/verifyToken";
import axios from "axios";
import Papa from "papaparse";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const { token, userData, logout } = useAuth();
  const location = useLocation();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "full_name", direction: "ascending" });

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
          setEvent(data);
          if (userData.role === "admin") {
            fetchRegisteredUsers();
          }
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

    const fetchRegisteredUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/ticket/${eventId}/registrations`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          setRegisteredUsers(response.data);
        } else {
          console.error("Failed to fetch registered users", response);
        }
      } catch (error) {
        console.error("API request failed with status:", error.response ? error.response.status : "unknown");
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

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const csvData = registeredUsers.map(user => ({
      Name: user.full_name,
      Email: user.email,
      Phone: user.phone_number,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "registered_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = registeredUsers
    .filter(user =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

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
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        {images.length > 0 && /\.(jpg|jpeg|png|gif|bmp)$/.test(images[0]) ? (
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
            autoPlay
            controls
            loop
          />
        )}
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-black mb-4">{title}</h2>
          <div className="flex flex-wrap mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "details"
                  ? "bg-black text-white"
                  : "bg-white text-black border"
              } rounded-md ml-5`}
              onClick={() => setActiveTab("details")}
            >
              Event Details
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "gallery"
                  ? "bg-black text-white"
                  : "bg-white text-black border"
              } rounded-md ml-5`}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
            </button>
            {userData.role === "admin" && (
              <button
                className={`px-4 py-2 ${
                  activeTab === "registeredUsers"
                    ? "bg-black text-white"
                    : "bg-white text-black border"
                } rounded-md ml-5`}
                onClick={() => setActiveTab("registeredUsers")}
              >
                Registered Users
              </button>
            )}
          </div>
          {activeTab === "details" && (
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {description}
              </p>
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
              {images &&
                images.map((image, index) =>
                  /\.(jpg|jpeg|png|gif|bmp)$/.test(image) ? (
                    <img
                      key={index}
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
                      key={index}
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      width="100%"
                      height="100%"
                      className="w-full h-64 object-cover object-center"
                      controls
                    />
                  )
                )}
            </div>
          )}
          {activeTab === "registeredUsers" && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-4 text-black">
                Registered Users
              </h3>
              <div className="mb-4 flex flex-wrap justify-between items-center">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border rounded-md mb-2 md:mb-0"
                />
                <div className="flex flex-wrap">
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded-md mr-2 mb-2 md:mb-0"
                    onClick={() => sortData("full_name")}
                  >
                    Sort by Name
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded-md mr-2 mb-2 md:mb-0"
                    onClick={() => sortData("email")}
                  >
                    Sort by Email
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded-md"
                    onClick={exportToCSV}
                  >
                    Export to CSV
                  </button>
                </div>
              </div>
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b">{user.full_name}</td>
                          <td className="py-2 px-4 border-b">{user.email}</td>
                          <td className="py-2 px-4 border-b">{user.phone_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-700">No users registered for this event.</p>
              )}
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
