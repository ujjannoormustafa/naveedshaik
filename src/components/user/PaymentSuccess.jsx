import React from 'react';
import { Link } from 'react-router-dom';
function PaymentSuccess() {
  return (
    <div>
      <h1>Payment Successful! You reserved the seat. Check your email for ticket! </h1>
      <Link to='/user/view-events'>Explore more Events</Link>
    </div>
  );
}

export default PaymentSuccess;
