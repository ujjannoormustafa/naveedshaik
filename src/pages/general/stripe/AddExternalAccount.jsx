import React, { useState,useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectPayments,
  ConnectComponentsProvider,
  ConnectAccountOnboarding
} from "@stripe/react-connect-js";
import { useAuth } from "../../../context/AuthContext";
import useStripeConnect from "../../../context/UseSttipeConnect";
export default function AddExternalAccount() {
  
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
    
    <div className="container">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {/* <ConnectPayments /> */}
          <ConnectAccountOnboarding
          onExit={() => {
            console.log("The account has exited onboarding");
          }}
          // Optional: make sure to follow our policy instructions above
          // fullTermsOfServiceUrl="{{URL}}"
          // recipientTermsOfServiceUrl="{{URL}}"
          // privacyPolicyUrl="{{URL}}"
          // skipTermsOfServiceCollection={false}
          collectionOptions={{
            fields: 'past_due',
            futureRequirements: 'include',
          }}
        />
        </ConnectComponentsProvider>
    </div>
  )
}