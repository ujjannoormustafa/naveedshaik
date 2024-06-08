import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "../../../resources/images/logo.png"

const PreActivation = () => {
    const location = useLocation();
    const email = location.state.emailAddress;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-md w-full bg-white rounded-lg shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
        <p className="text-gray-700 mb-4">
          We have sent an activation link to <span className="font-semibold">{email}</span>. Please check your inbox and click on the link to activate your account.
        </p>
        {/* <p className="text-gray-500 mb-4">
          If you didn't receive the email, please check your spam folder or click the button below to resend the activation email.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
          Resend Activation Email
        </button> */}
        <Link to='/login'>
          <button className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PreActivation;
