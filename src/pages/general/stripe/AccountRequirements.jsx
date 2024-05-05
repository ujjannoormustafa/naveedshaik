import React, { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectComponentsProvider, ConnectAccountOnboarding } from "@stripe/react-connect-js";
import { useStripeConnect } from "../../../context/UseSttipeConnect";

export default function AccountRequirements() {
    const [loading, setLoading] = useState(true);
    const connectInstance = useStripeConnect();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Account Requirements</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
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
        </div>
    );
}
