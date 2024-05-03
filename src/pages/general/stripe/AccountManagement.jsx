import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectAccountManagement
} from "@stripe/react-connect-js";
import { useStripeConnect } from "../../../context/UseSttipeConnect";

export default function AccountManagement() {
  const connectInstance = useStripeConnect();
  const [loading, setLoading] = useState(true);

 

  return (
    <div className="container">
      {connectInstance ? (
        <ConnectComponentsProvider connectInstance={connectInstance}>
        <ConnectAccountManagement />
      </ConnectComponentsProvider>
      ):
      <h1>Loading</h1>
      }
    </div>
  );
}
