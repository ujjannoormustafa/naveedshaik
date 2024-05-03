// Include this React component
import { useState,useEffect } from "react";
import {
  ConnectBalances,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../services/api";
import { useStripeConnect } from "../../../context/UseSttipeConnect";
const ViewBalance = ()=>{
  const [loading, setLoading] = useState(true);
  const {token} = useAuth();
  // We use `useState` to ensure the Connect instance is only initialized once
  const connectInstance =  useStripeConnect();

  return (
    <ConnectComponentsProvider connectInstance={connectInstance}>
      <ConnectBalances />
    </ConnectComponentsProvider>
  );

}

export default ViewBalance;

