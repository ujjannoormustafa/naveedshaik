import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiCalendar, mdiClockOutline, mdiMapMarker, mdiTicket } from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { token, userData } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/event/${eventId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setEvent(data);
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

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
    createdBy,
    createdAt,
    updatedAt,
  } = event;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <img
          className="w-full h-64 object-cover object-center"
          src={images[0]}
          alt={title}
        />
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-black mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>

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

          {/* <div className="flex items-center text-gray-700 mb-4">
            <p className="font-semibold">{`Created At:`}</p>
            <p className="ml-2">{new Date(createdAt).toLocaleString()}</p>
          </div>

          <div className="flex items-center text-gray-700 mb-6">
            <p className="font-semibold">{`Updated At:`}</p>
            <p className="ml-2">{new Date(updatedAt).toLocaleString()}</p>
          </div> */}

          <div className="flex justify-end">
            {userData.role === "admin" ? (
              <Link
                to={`/admin/update-event/${event._id}`}
                className="px-4 py-2 bg-black text-white rounded-md h"
              >
                Update Event
              </Link>
            ) : (
              <Link 
              to={`/user/checkout/${event._id}`}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
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
