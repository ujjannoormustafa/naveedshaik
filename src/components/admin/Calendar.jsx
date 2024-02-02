// EventCalendar.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch events data (replace with your own data fetching logic)
  useEffect(() => {
    // Example: Fetch events from an API
    // Replace this with actual API endpoint
    // For now, we're using dummy demo events
    const demoEvents = [
      {
        id: 1,
        title: "Team Meeting",
        start: "2024-02-01T10:00:00",
        end: "2024-02-01T11:30:00",
      },
      {
        id: 2,
        title: "Lunch with Clients",
        start: "2024-02-03T12:30:00",
        end: "2024-02-03T14:00:00",
      },
      {
        id: 3,
        title: "Product Demo",
        start: "2024-02-06T15:00:00",
        end: "2024-02-06T16:30:00",
      },
      {
        id: 4,
        title: "Product Demo",
        start: "2024-02-06T15:00:00",
        end: "2024-02-06T16:30:00",
      },
      {
        id: 5,
        title: "Product Demo",
        start: "2024-02-06T15:00:00",
        end: "2024-02-06T16:30:00",
      },
    ];

    setEvents(demoEvents);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: events,
    themeSystem: "standard", // Change to your preferred theme (e.g., 'standard', 'jquery-ui', etc.)
    eventContent: function (arg) {
      // Customize event content
      return (
        <div className="bg-black w-full text-white p-2  rounded">
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
    aspectRatio: isMobile ? 1.5 : 2.5, // Adjust the aspectRatio based on your design
    height: isMobile ? "auto" : "100vh",
    fixedWeekCount: false,
    slotEventOverlap: false,
    editable: true,
    dayMaxEventRows: 2, // Limit the maximum number of events displayed in a day
    moreLinkText: "View more",
    draggable: true,
  };

  return (
    <div className="container mx-auto my-10 p-4 bg-white rounded-lg h-full ">
      <h1 className="text-3xl font-semibold mb-4">Calendar</h1>
      <div className="lg:w-3/4 mx-auto h-full ">
        <FullCalendar {...calendarOptions} />
      </div>
    </div>
  );
};

export default EventCalendar;
