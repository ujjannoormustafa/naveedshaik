import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState, useSyncExternalStore } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../services/api';
import { Link } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe('pk_test_51Oda4PHSvDuMR6pwhSgqNrMgZNSlmr4LUGSGwPSuUpG7ns3YltEjeTW7oOIGOkKk8EmY7yt8MnxRXzhRin0sxqcR0045cbxygI');


  

function Checkout() {
  const [clientSecret, setClientSecret] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [message,setMessage] = useState(null)
  const { eventId } = useParams();
const {token} = useAuth()
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/stripe/checkout/${eventId}`, {
          method: "POST",
          headers: { 
            
            "Content-Type": "application/json",
            Authorization: token
        },
          
        });

        if (!response.ok) {
            const responseData = await response.json(); // Await the JSON parsing
            console.log(responseData.message);
            setMessage(responseData.message)
            setIsLoading(false)
            return;
            // setMessage(responseData);
        }

        const data = await response.json();
        // Ensure clientSecret is in the correct format
        
        setClientSecret(data.clientSecret);
        setIsLoading(false); // Set loading to false after setting clientSecret
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClientSecret();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
 

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
