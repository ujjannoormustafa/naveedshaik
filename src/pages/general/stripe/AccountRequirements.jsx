import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectComponentsProvider, ConnectAccountOnboarding } from "@stripe/react-connect-js";
import useStripeConnect from "../../../context/UseSttipeConnect";

export default function AccountRequirements() {
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
