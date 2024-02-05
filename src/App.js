import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import ChangeProfile from "./components/general/ChangeProfile";
import HomePage from "./pages/admin/HomePage";
import AddEventPage from "./pages/admin/AddEventPage";
import CalendarPage from "./pages/admin/CalendarPage";
import UpdateEventPage from "./pages/admin/UpdateEventPage";
import EventListPage from "./pages/admin/EventListPage";
import RegisterPage from "./pages/general/RegisterPage";
import LoginPage from "./pages/general/LoginPage";
import { useAuth } from "./context/AuthContext"; // replace with the actual path
import EventDetailPage from "./pages/general/EventDetailPage";
const ProtectedRoute = ({ element, role }) => {
  const { isLoggedIn, userData } = useAuth();
  console.log(userData);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && userData?.role !== role) {
    // Redirect to the default route based on the user's role
    return userData?.role === "admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/user" />
    );
  }

  return <>{element}</>;
};

function App() {
  const { isLoggedIn, userData } = useAuth();
  console.log(userData);
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<LoginPage />} />} />

        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route
            index
            element={<ProtectedRoute element={<HomePage />} role="admin" />}
          />
          <Route
            path="change-profile"
            element={
              <ProtectedRoute element={<ChangeProfile />} role="admin" />
            }
          />
          <Route
            path="create-event"
            element={<ProtectedRoute element={<AddEventPage />} role="admin" />}
          />
          <Route
            path="calendar"
            element={<ProtectedRoute element={<CalendarPage />} role="admin" />}
          />
          <Route
            path="update-event/:eventId"
            element={
              <ProtectedRoute element={<UpdateEventPage />} role="admin" />
            }
          />
          <Route
            path="event-list"
            element={
              <ProtectedRoute element={<EventListPage />} role="admin" />
            }
          />
          <Route
            path=":eventId"
            element={
              <ProtectedRoute element={<EventDetailPage />} role="admin" />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
