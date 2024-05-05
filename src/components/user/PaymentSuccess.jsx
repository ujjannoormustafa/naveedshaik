import React from 'react';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600 mb-8">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        You have successfully reserved the seat. Check your email for the ticket!
      </p>
      <Link
        to="/user/view-events"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Explore more Events
      </Link>
    </div>
  );
}

export default PaymentSuccess;
