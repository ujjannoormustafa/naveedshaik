import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../services/api";

const useStripeConnect = () => {
  const { token } = useAuth();
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/stripe/create-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const { error } = await response.json();
          console.error('An error occurred: ', error);
          return;
        }

        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      } catch (error) {
        console.error('An error occurred: ', error);
        return;
      }
    };

    const initializeStripeConnect = async () => {
      const secret = await fetchClientSecret();
      if (secret) {
        const instance = loadConnectAndInitialize({
          publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret: fetchClientSecret,
          appearance: {
            overlays: 'dialog',
            variables: {
              colorPrimary: '#625afa',
            },
          },
        });
        setStripeConnectInstance(instance);
      }
    };

    initializeStripeConnect();
  }, [token]);

  return stripeConnectInstance;
};

export default useStripeConnect;
