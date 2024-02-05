// EventCalendar.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Modal from "react-modal"; // Import Modal from your preferred modal library
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { token, userData } = useAuth();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events from your API
        const response = await fetch(`{${BASE_URL}/api/event/event-list}`, {
          headers: {
            Authorization: token, // Add your authorization token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const eventData = await response.json();
        // Transform API response data into FullCalendar format
        const transformedEvents = eventData.map((event) => ({
          id: event._id,
          title: event.title,
          start: event.date, // You may need to format this based on FullCalendar's requirements
          end: event.date, // You may need to format this based on FullCalendar's requirements
          description: event.description, // Add additional event details
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleEventClick = (arg) => {
    const { event } = arg;
    const parsedEvent = {
      id: event.id,
      title: event.title,
      description: event.extendedProps.description,
      start: event.start ? new Date(event.start) : null,
      end: event.end ? new Date(event.end) : null,
    };
    setSelectedEvent(parsedEvent);
  };

  const closeModal = () => {
    // Close the modal
    setSelectedEvent(null);
  };
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: events,
    themeSystem: "standard",
    eventContent: function (arg) {
      return (
        <div className="bg-black w-full text-white p-2 rounded">
          {arg.timeText} - {arg.event.title}
        </div>
      );
    },
    headerToolbar: {
      left: isMobile ? "" : "prev,next today",
      center: isMobile ? "title" : "title",
      right: isMobile
        ? "prev,next,today"
        : "dayGridMonth,timeGridWeek,timeGridDay",
    },
    aspectRatio: isMobile ? 1.5 : 2.5,
    height: isMobile ? "auto" : "100vh",
    fixedWeekCount: false,
    slotEventOverlap: false,
    editable: true,
    dayMaxEventRows: 2,
    moreLinkText: "View more",
    draggable: true,
    eventClick: handleEventClick, // Attach event click handler
  };

  return (
    <div className="container mx-auto my-10 p-4 bg-white rounded-lg h-full">
      <h1 className="text-3xl font-semibold mb-4">Calendar</h1>
      <div className="lg:w-3/4 mx-auto h-full">
        <FullCalendar {...calendarOptions} />
      </div>

      {/* Modal for displaying event details */}
      <Modal
        isOpen={selectedEvent !== null}
        onRequestClose={closeModal}
        contentLabel="Event Details"
      >
        {selectedEvent && (
          <div>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
            <p>Start: {selectedEvent.start.toISOString()}</p>
            <p>End: {selectedEvent.end.toISOString()}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventCalendar;
