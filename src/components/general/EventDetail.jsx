import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiCalendar,
  mdiClockOutline,
  mdiLocationEnter,
  mdiTicket,
} from "@mdi/js";
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
      <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover object-center"
          src={images[0]}
          alt={title}
        />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-black mb-2">{title}</h2>
          <p className="text-black mb-4">{description}</p>

          <div className="flex items-center text-black mb-4">
            <Icon path={mdiCalendar} size={1} className="mr-2" />
            <p>{new Date(date).toLocaleDateString()}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <Icon path={mdiClockOutline} size={1} className="mr-2" />
            <p>{time}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <Icon path={mdiLocationEnter} size={1} className="mr-2" />
            <p>{venue}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <Icon path={mdiTicket} size={1} className="mr-2" />
            <p>{`Price: $${ticketPrice}`}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <p>{`Total Seats: ${totalSeats}`}</p>
            <p className="ml-4">{`Available Seats: ${availableSeats}`}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <p>{`Created By: ${createdBy}`}</p>
          </div>

          <div className="flex items-center text-black mb-4">
            <h2 className="font-semibold text-lg">{`Created At: ${new Date(
              createdAt
            ).toLocaleString()}`}</h2>
          </div>

          <div className="flex items-center text-black mb-4">
            <p>{`Updated At: ${new Date(updatedAt).toLocaleString()}`}</p>
          </div>

          <div className="flex justify-end">
            {userData.role == "admin" ? (
              <Link
                to={`/admin/update-event/${event._id}`}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-black"
              >
                Update Event
              </Link>
            ) : (
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black">
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
