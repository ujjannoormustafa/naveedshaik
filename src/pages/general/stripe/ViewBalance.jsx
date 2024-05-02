// Include this React component
import { useState,useEffect } from "react";
import {
  ConnectBalances,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useAuth } from "../../../context/AuthContext";
import useStripeConnect from "../../../context/UseSttipeConnect";
const ViewBalance = ()=>{
  const [loading, setLoading] = useState(true);
  const stripeConnectInstance = useStripeConnect();
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
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectBalances />
    </ConnectComponentsProvider>
  );

}

export default ViewBalance;
