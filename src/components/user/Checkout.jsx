import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../services/api';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';
const stripePromise = loadStripe('pk_live_51Oda4PHSvDuMR6pwVmcCmszQnbOosphNs3Xpzl0h57BH2idPzuBRXiNgfXpuTXPHF5QPqMPHxMULCChp7fzG11R600irHtNpUs');
// const stripePromise = loadStripe('pk_test_51Oda4PHSvDuMR6pwhSgqNrMgZNSlmr4LUGSGwPSuUpG7ns3YltEjeTW7oOIGOkKk8EmY7yt8MnxRXzhRin0sxqcR0045cbxygI')
function Checkout() {
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { eventId } = useParams();
  const { token,logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/stripe/checkout/${eventId}`, {}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
    
        if (response.status === 200) {
          const data = response.data;
          setClientSecret(data.clientSecret);
          setIsLoading(false); // Set loading to false after setting clientSecret
        } else {
          console.error("Failed to fetch client secret", response);
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
        if (error.response) {
          if (error.response.status === 401) {
            console.log("Token expired");
            logout();
            navigate("/login", { replace: true,state: { message: "Session expired. Please log in again.",from: location.pathname }  });
          } else {
            console.error("API request failed with status:", error.response.status);
          }
        } else {
          console.error("Error response:", error.response);
        }
      }
    };

    fetchClientSecret();
  }, []);


  return (
    <>
      {message && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">{message}</h1>
          <Link to='/user/view-events' className="text-blue-500 mt-4 hover:underline">Go Back to Events</Link>
        </div>
      )}
      {!message && !isLoading && (
        <div className="flex justify-center">
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
