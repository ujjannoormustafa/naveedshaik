import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectPayments
} from "@stripe/react-connect-js";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../services/api";
import { useStripeConnect } from "../../../context/UseSttipeConnect";
export default  function ViewPayments() {
    // const [loading, setLoading] = useState(true);
  
    const connectInstance =  useStripeConnect();
    // console.log("stripeConnectInstance: ", stripeConnectInstance);
    console.log("view payments...")
  //   useEffect(() => {
  //     if (stripeConnectInstance) {
  //         setLoading(false);
  //     }
  // }, [stripeConnectInstance]);
  

  // if (loading) {
  //     return (
  //         <div className="container">
  //             <p>Loading...</p>
  //         </div>
  //     );
  // }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Payments</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {console.log("rendered payment")}
        {connectInstance ? (
          <ConnectComponentsProvider connectInstance={connectInstance}>
            <ConnectPayments />
          </ConnectComponentsProvider>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
