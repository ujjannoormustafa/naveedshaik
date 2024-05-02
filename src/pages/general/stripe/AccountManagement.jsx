import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement
} from "@stripe/react-connect-js";
import useStripeConnect from "../../../context/UseSttipeConnect";

export default function AccountManagement() {
  const stripeConnectInstance = useStripeConnect();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stripeConnectInstance) {
        setLoading(false);
    }
}, [stripeConnectInstance]);

if (loading) {
    return (
        <div className="container">
            <p>Loading...</p>
        </div>
    );
}

  return (
    <div className="container">
      {stripeConnectInstance && (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
        <ConnectAccountManagement />
      </ConnectComponentsProvider>
      )}
    </div>
  );
}
