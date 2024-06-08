import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../../services/api";
import logo from "../../../resources/images/logo.png"

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${BASE_URL}/api/auth/activate-user`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-md w-full bg-white rounded-lg shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold mb-4">Verifying User</h1>
        {error ? (
          <p className="text-red-500">Your token is expired!</p>
        ) : (
          <>
            <p className="text-green-500 mb-2">Your account has been created successfully!</p>
            <p className="mb-4">You can now log in!</p>
            <Link to='/login'>
              <button className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
