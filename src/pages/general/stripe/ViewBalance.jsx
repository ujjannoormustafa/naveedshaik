import { useState, useEffect } from "react";
import {
  ConnectBalances,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useAuth } from "../../../context/AuthContext";
import { useStripeConnect } from "../../../context/UseSttipeConnect";

const ViewBalance = () => {
  // const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  // We use `useState` to ensure the Connect instance is only initialized once
  const connectInstance = useStripeConnect();

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">View Balance</h1>
      <div className="md:flex md:justify-center">
        <div className="w-full md:w-2/3">
         
            <ConnectComponentsProvider connectInstance={connectInstance}>
              <ConnectBalances />
            </ConnectComponentsProvider>
        
        </div>
      </div>
    </div>
  );
};

export default ViewBalance;
