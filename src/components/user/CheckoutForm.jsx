import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { BASE_URL,SITE_URL } from "../../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const eventId = useParams().eventId
  console.log("dvent ID: ",eventId)
  const { token } = useAuth();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(async({ paymentIntent, error }) => {
      if (error && error.type !== "validation_error") {
        // Handle other errors
        console.error(error.message);
        setMessage(`Error: ${error.message}`);
        return;
      }

      switch (paymentIntent.status) {
        case "succeeded":
          console.log("success")
          try{
             const response = await  fetch(`${BASE_URL}/api/ticket/buy-ticket/${eventId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              
              
              
              }
            
            )
            if (!response.ok) {
              setMessage("Error: Something went wrong. Please try again.");
            }else{
              const data = await response.json();
              console.log("data",data)
              if(data.message === "Ticket purchased successfully"){
                setMessage("Payment succeeded!");
                navigate(`/user/payment-success`, { replace: true });
              }

            }
          }catch(e){

          }
          setMessage("Payment succeeded!");
          break;
        case "processing":
          console.log("processing")
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          console.log("requre paymnt ethod")
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${SITE_URL}/user/checkout/${eventId}`
      },
    });

    if (error && error.type !== "validation_error") {
      // Handle other errors
      console.error(error.message);
      setMessage(`Error: ${error.message}`);
    }

    setIsLoading(false);
  };







//payment option
const paymentElementOptions = {

  //tabs
//layout: "tabs"

  //Accordion with radio button
  // layout: {
  //   type: 'accordion',
  //   defaultCollapsed: false,
  //   radios: true,
  //   spacedAccordionItems: false
  // },

  //accordion without readio buttons
  layout: {
    type: 'accordion',
    defaultCollapsed: false,
    radios: false,
    spacedAccordionItems: true
  },
  supportedCountries: ['SEPA'],
}
  return (
    <>
    <form id="payment-form" onSubmit={handleSubmit}>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>

   
    </>
  );
}
