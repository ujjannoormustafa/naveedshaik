// import { useState, useEffect } from "react";
// import { loadConnectAndInitialize } from "@stripe/connect-js";
// import { useAuth } from "./AuthContext";
// import { BASE_URL } from "../services/api";

// const useStripeConnect = () => {
//   const { token } = useAuth();
//   const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
//   const [clientSecret, setClientSecret] = useState(null);

//   useEffect(() => {
//     const fetchClientSecret = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/stripe/create-session`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//           },
//         });

//         if (!response.ok) {
//           const { error } = await response.json();
//           console.error('An error occurred: ', error);
//           return;
//         }

//         const { client_secret: secret } = await response.json();
//         console.log("client_secret: ", secret);
//         setClientSecret(secret);
//       } catch (error) {
//         console.error('An error occurred: ', error);
//       }
//     };

//     const initializeStripeConnect = async () => {
//       if (!clientSecret) {
//         await fetchClientSecret();
//       }

//       const instance = loadConnectAndInitialize({
//         publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
//         fetchClientSecret: () => Promise.resolve(clientSecret),
//         appearance: {
//           overlays: 'dialog',
//           variables: {
//             colorPrimary: '#625afa',
//           },
//         },
//       });

//       setStripeConnectInstance(instance);
//     };

//     initializeStripeConnect();
//   }, [token, clientSecret]);

//   return stripeConnectInstance;
// };

// export default useStripeConnect;

import React, { useState, useEffect, useContext } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../services/api";

const StripeConnectContext = React.createContext();

export const useStripeConnect = () => useContext(StripeConnectContext);

export const StripeConnectProvider = ({ children }) => {
  const { user,token } = useAuth();
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

 
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

      const { client_secret: secret } = await response.json();
      console.log("client_secret: ", secret);
      // setClientSecret(secret);
      return secret;
    } catch (error) {
      console.error('An error occurred: ', error);
    }
  }
  var connectInstance = loadConnectAndInitialize({
    // publishableKey: 'pk_test_51Oda4PHSvDuMR6pwhSgqNrMgZNSlmr4LUGSGwPSuUpG7ns3YltEjeTW7oOIGOkKk8EmY7yt8MnxRXzhRin0sxqcR0045cbxygI',
    publishableKey: 'pk_live_51Oda4PHSvDuMR6pwVmcCmszQnbOosphNs3Xpzl0h57BH2idPzuBRXiNgfXpuTXPHF5QPqMPHxMULCChp7fzG11R600irHtNpUs',
    fetchClientSecret: fetchClientSecret,
    appearance: {
      variables: {
        colorPrimary: '#000000', //optional appearance param,
      },
    }
  });
 
  

  return (
    <StripeConnectContext.Provider value={connectInstance}>
      {children}
    </StripeConnectContext.Provider>
  );
};