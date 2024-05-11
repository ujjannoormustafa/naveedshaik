import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { BASE_URL } from '../../../services/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function ConnectStripe() {
  const { token, userData } = useAuth();
  const [connected, setConnected] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stripe/connected-account-exists`, {
          headers: {
            Authorization: token,
          },
        });
        const data = response.data;
        if (data.connected) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      } catch (error) {
        console.error('Error checking account status:', error);
      }
    };
    checkAccount();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    businessType: '',
    businessName: '',
    firstName: '',
    lastName: '',
    city: '',
    line1: '',
    postalCode: '',
    state: '',
    dob: '',
    phone: '',
    ssnLast4: '',
    statementDescriptor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Split the date of birth into day, month, year
    const dobDay = formData.dob.split('-')[2];
    const dobMonth = formData.dob.split('-')[1];
    const dobYear = formData.dob.split('-')[0];

    const formDataToSend = {
      ...formData,
      dobDay,
      dobMonth,
      dobYear
    };

    try {
      const response = await fetch(`${BASE_URL}/api/stripe/connect-account`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });
      const responseData = await response.json();

      if (responseData.status === 200) {
        toast.success(responseData.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setConnected(true);
      } else {
        toast.error(responseData.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    } catch (error) {
      console.error('Error creating connected account:', error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Connect Stripe Account</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {connected ? (
          <>
            <p className="mb-4">Your account is connected.</p>
            <p className="mb-4 ">Check Account Status <Link className='text-blue-500 underline' to='/admin/check-account-status'>here..</Link></p>
          </>
        ) : (
          <>
            <p className="mb-4">Please fill out the below information to connect your account.</p>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Type:</label>
                  <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Name:</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Address Line 1:</label>
                  <input type="text" name="line1" value={formData.line1} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code:</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">State:</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth:</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">SSN Last 4:</label>
                  <input type="text" name="ssnLast4" value={formData.ssnLast4} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Statement Descriptor:</label>
                  <input type="text" name="statementDescriptor" value={formData.statementDescriptor} onChange={handleChange} className="input border border-black rounded-md p-2 mt-2 focus:border-black" />
                </div>
              </div>
              <button type="submit" className="bg-black hover:bg-black text-white font-bold py-2 px-4 mt-3 rounded focus:outline-none focus:shadow-outline">Submit</button>
            </form>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ConnectStripe;