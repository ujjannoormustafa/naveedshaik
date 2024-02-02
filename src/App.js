// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/admin/HomePage";
import MySidebar from "./components/admin/Sidebar";
import AddEventPage from "./pages/admin/AddEventPage";
import Navbar from "./components/admin/Navbar";
import Topbar from "./components/admin/Topbar";
import EventCalendar from "./components/admin/Calendar";
import CalendarPage from "./pages/admin/CalendarPage";
import UpdateEventPage from "./pages/admin/UpdateEventPage";
import EventListPage from "./pages/admin/EventListPage";
import Signup from "./components/admin/Register";
import RegisterPage from "./pages/general/RegisterPage";
import LoginPage from "./pages/general/LoginPage";
// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const handleToggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="app flex flex-row w-full">
//       <MySidebar isOpen={isSidebarOpen} />
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <Topbar onToggleSidebar={handleToggleSidebar} />
//         <div style={{ flex: 1, overflowY: "auto" }}>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/create-event" element={<AddEventPage />} />
//             <Route path="/calendar" element={<CalendarPage />} />
//             <Route path="/update-event" element={<UpdateEventPage />} />
//             <Route path="/event-list" element={<EventListPage />} />
//             <Route path="/register" element={<Signup />} />

//             {/* Add more routes as needed */}
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
function App() {
  return (
    <div>
      <Routes>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route exact element={<HomePage />} />
          <Route path="create-event" element={<AddEventPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="update-event" element={<UpdateEventPage />} />
          <Route path="event-list" element={<EventListPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
