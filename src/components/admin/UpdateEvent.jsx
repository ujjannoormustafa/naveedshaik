import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  mdiCalendar,
  mdiClockTimeThree,
  mdiMapMarker,
  mdiTicket,
  mdiImage,
} from "@mdi/js";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
const UpdateEvent = () => {
  const { eventId } = useParams();
  const { token, userData } = useAuth();
  const [newPhotos, setNewPhotos] = useState([]);

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
    const fetchEventDetails = async () => {
      try {
        // Fetch existing event details
        const response = await fetch(`${BASE_URL}/api/event/${eventId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Set fetched details into state
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
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventInfo({ ...eventInfo, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewPhotos([...newPhotos, ...files]);
  };

  const handleRemovePhoto = (index) => {
    // const updatedPhotos = [...eventInfo.photos];
    // updatedPhotos.splice(index, 1);
    // setEventInfo({ ...eventInfo, photos: updatedPhotos });
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

      // Append existing Cloudinary URLs
      eventInfo.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });

      // Append new photos
      newPhotos.forEach((file, index) => {
        formData.append(`newPhotos[${index}]`, file);
      });
      // Send the update request
      const response = await fetch(`{${BASE_URL}/api/event/update-event}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Event updated successfully!");
        // You can redirect the user or perform other actions after successful update
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
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
          {eventInfo.photos.length > 0 && (
            <div className="m-2 flex flex-wrap ">
              {eventInfo.photos.map((photo, index) => (
                <div key={index} className="relative bg-green">
                  <img
                    src={
                      photo instanceof File ? URL.createObjectURL(photo) : photo
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
              type="text"
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
    </div>
  );
};

export default UpdateEvent;
