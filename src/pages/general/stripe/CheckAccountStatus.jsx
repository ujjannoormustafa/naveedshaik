import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../../services/api';
import {
  ConnectNotificationBanner,
  ConnectComponentsProvider,
} from '@stripe/react-connect-js';
import { useStripeConnect } from '../../../context/UseSttipeConnect';


function CheckAccountStatus() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const connectInstance = useStripeConnect();


  useEffect(() => {
    const checkAccount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stripe/connected-account-exists`, {
          headers: { Authorization: token },
        });
        const { connected } = response.data;
        setConnected(connected);
        if (connected) {
          const accountResponse = await axios.get(`${BASE_URL}/api/stripe/get-account`, {
            headers: { Authorization: token },
          });
          setData(accountResponse.data.accountInfo);
        }
      } catch (error) {
        console.error('Error checking account status:', error);
      }
    };
    checkAccount();
  }, [token]);
  if(!data){
    //add loading indicator
    return <div>Loading...</div>


  }

  return (
    <>
     <ConnectComponentsProvider connectInstance={connectInstance}>
      <ConnectNotificationBanner />
    </ConnectComponentsProvider>
    <div className="container mx-auto p-8">
      {connected ? (
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-4">Payout Status</h1>
          {data && data.payouts_enabled ? (
            <div className="bg-green-200 text-green-800 p-4 rounded-md mb-4">
              <p className="font-bold">Your account is active for receiving payments.</p>
            </div>
          ) : (
            <div className="bg-red-200 text-red-800 p-4 rounded-md mb-4">
              <p className="font-bold">Your account needs verification to be activated for receiving payments.</p>
            </div>
          )}

          {data && (
            <>
              <h1 className="text-2xl font-bold">Personal Information</h1>
              <p>Name: {`${data.individual.first_name} ${data.individual.last_name}`}</p>
              <p>Email: {data.individual.email}</p>

              <h1 className="text-2xl font-bold mt-4">Company Information</h1>
              <p>Name: {data.business_profile.name}</p>
              <p>City: {data.company.address.city}</p>
              <p>Country: {data.company.address.country}</p>
              <p>Address: {`${data.company.address.line1}, ${data.company.address.postal_code}, ${data.company.address.state}`}</p>
              <p>Phone: {data.company.phone}</p>

              <h1 className="text-2xl font-bold mt-4">Requirements</h1>

              {
                data.requirements ? (
                <>
                   {data.requirements && (
                <>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">Currently Due</h3>
                    {data.requirements.currently_due.length > 0 ? (
                      <div>
                        {data.requirements.currently_due.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p>No currently_due requirements</p>
                    )}
                  </div>


                </>
              )}
                {data.requirements && (
                <>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">Past Due</h3>
                    {data.requirements.past_due.length > 0 ? (
                      <div>
                        {data.requirements.past_due.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p>No past due requirements</p>
                    )}
                  </div>


                </>
              )}
                {data.requirements && (
                <>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">eventually_due Due</h3>
                    {data.requirements.eventually_due.length > 0 ? (
                      <div>
                        {data.requirements.eventually_due.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p>No Eventually due requirements</p>
                    )}
                  </div>


                </>
              )}
               {data.requirements && (
                <>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold">pending verifications Due</h3>
                    {data.requirements.pending_verification.length > 0 ? (
                      <div>
                        {data.requirements.pending_verification.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p>No Eventually due requirements</p>
                    )}
                  </div>


                </>
              )}
                <Link to='/admin/verify-requirements' className="text-blue-500 hover:text-blue-700 hover:underline">Verify Requirements</Link>

                </>
                ): (
                  <>
                  <div className="bg-red-200 text-red-800 p-4 rounded-md mb-4">
                    <p className="font-bold">No Requirements Found</p>
                  </div>
                  
                  </>
                )
              }
            </>
          )}
        </div>
      ) : (
        <div className="bg-red-200 text-red-800 p-4 rounded-md mb-4">
          <p className="font-bold">No Account Connected. Please connect your <Link to='/admin/connect-account'>Account</Link></p>
        </div>
      )}
    </div>
    </>
  );
}

export default CheckAccountStatus;