import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import UserLayout from "./Layouts/UserLayout";
import ChangeProfile from "./components/general/ChangeProfile";
import HomePage from "./pages/admin/HomePage";
import AddEventPage from "./pages/admin/AddEventPage";
import CalendarPage from "./pages/admin/CalendarPage";
import UpdateEventPage from "./pages/admin/UpdateEventPage";
import EventListPage from "./pages/admin/EventListPage";
import EventDetailPage from "./pages/admin/EventDetailPage";

import ConnectStripe from "./pages/general/stripe/ConnectStripe";
import CheckAccountStatus from "./pages/general/stripe/CheckAccountStatus";
import AddExternalAccount from "./pages/general/stripe/AddExternalAccount";
import ViewBalance from "./pages/general/stripe/ViewBalance";
import AccountRequirements from "./pages/general/stripe/AccountRequirements";
import AccountManagement from "./pages/general/stripe/AccountManagement";
import ViewPayments from "./pages/general/stripe/ViewPayments";
import BankAccountForm from "./pages/general/stripe/BankAccountForm";

import UserHomePage from "./pages/user/UserHomePage";
import UserViewEventsPage from "./pages/user/UserViewEventsPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserPaymentSuccessPage from "./pages/user/UserPaymentSuccessPage";

//----------------------------------------------------------------
//    Authentication 
import RegisterPage from "./pages/general/authentication/RegisterPage";
import LoginPage from "./pages/general/authentication/LoginPage";
import ResetPassword from "./components/general/authentication/ResetPassword";
import VerifyCode from "./components/general/authentication/VerifyCode";
import NewPassword from "./components/general/authentication/NewPassword";
import { useAuth } from "./context/AuthContext"; // replace with the actual path



const ProtectedRoute = ({ element, role }) => {
  const { isLoggedIn, userData,token } = useAuth();
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
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-code" element={<VerifyCode />} />
        <Route path="/auth/new-password" element={<NewPassword />} />

        



      //admin Routes

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

          //stripe routes
          <Route path="connect-account"   
          element={
              <ProtectedRoute element={<ConnectStripe />} role="admin" />
            } />
        <Route path="check-account-status"   
          element={
              <ProtectedRoute element={<CheckAccountStatus />} role="admin" />
            } />

        <Route path="verify-requirements"  element={
              <ProtectedRoute element={<AccountRequirements />} role="admin" />
            }  />

        <Route path="add-external-account"  element={
              <ProtectedRoute element={<AddExternalAccount />} role="admin" />
            }  />
             <Route path="connect-bank-account"  element={
              <ProtectedRoute element={<BankAccountForm />} role="admin" />
            }  />
        <Route path="view-balance"   
          element={
              <ProtectedRoute element={<ViewBalance />} role="admin" />
            } />
             <Route path="manage-account"   
          element={
              <ProtectedRoute element={<AccountManagement />} role="admin" />
            } />
                <Route path="all-payments"   
          element={
              <ProtectedRoute element={<ViewPayments />} role="admin" />
            } />
        </Route>
       
       

       //User Routes
       <Route path="/user/*" element={<UserLayout />}>
          <Route
            index
            element={<ProtectedRoute element={<UserHomePage />} role="user" />}
          />
          <Route
            path="change-profile"
            element={
              <ProtectedRoute element={<ChangeProfile />} role="user" />
            }
          />
        
          <Route
            path="view-events"
            element={<ProtectedRoute element={<UserViewEventsPage />} role="user" />}
          />
           <Route
            path=":eventId"
            element={
              <ProtectedRoute element={<EventDetailPage />} role="user" />
            }
          />
           <Route
            path="checkout/:eventId"
            element={
              <ProtectedRoute element={<CheckoutPage />} role="user" />
            }
          />
           <Route
            path="payment-success"
            element={
              <ProtectedRoute element={<UserPaymentSuccessPage />} role="user" />
            }
          /> 
         {/*     
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

          //stripe routes
          <Route path="connect-account"   
          element={
              <ProtectedRoute element={<ConnectStripe />} role="admin" />
            } />
        <Route path="check-account-status"   
          element={
              <ProtectedRoute element={<CheckAccountStatus />} role="admin" />
            } />

        <Route path="verify-requirements"  element={
              <ProtectedRoute element={<AccountRequirements />} role="admin" />
            }  />

        <Route path="add-external-account"  element={
              <ProtectedRoute element={<AddExternalAccount />} role="admin" />
            }  />
        <Route path="view-balance"   
          element={
              <ProtectedRoute element={<ViewBalance />} role="admin" />
            } />
             <Route path="manage-account"   
          element={
              <ProtectedRoute element={<AccountManagement />} role="admin" />
            } />
                <Route path="all-payments"   
          element={
              <ProtectedRoute element={<ViewPayments />} role="admin" />
            } /> */}
        </Route>
        
      </Routes> 
    </div>
  );
}

export default App;
