import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectComponentsProvider, ConnectAccountOnboarding } from "@stripe/react-connect-js";
import { useStripeConnect } from "../../../context/UseSttipeConnect";
export default function AccountRequirements() {
    const [loading, setLoading] = useState(true);
    const connectInstance = useStripeConnect();

  

    return (
        <div className="container">
            {console.log("rebdered,,,,")}
            <ConnectComponentsProvider connectInstance={connectInstance}>
                <ConnectAccountOnboarding
                    onExit={() => {
                        console.log("The account has exited onboarding");
                    }}
                    collectionOptions={{
                        fields: 'currently_due' | 'eventually_due',
                        futureRequirements: 'include',
                    }}
                />
            </ConnectComponentsProvider>
        </div>
    );
}
