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
  const [connected, setConnected] = useState()
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
  },[])
  const [formData, setFormData] = useState({
    country: '',
    email: '',
    businessType: '',
    businessName: '',
    mcc: '',
    url: '',
    firstName: '',
    lastName: '',
    city: '',
    line1: '',
    postalCode: '',
    state: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    phone: '',
    ssnLast4: '',
    statementDescriptor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(token)
    e.preventDefault();
    console.log(formData)
    try {
      const response = await fetch(`${BASE_URL}/api/stripe/connect-account`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if(responseData.message === "Account already connected"){
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
        return;
      }


      console.log('Connected account created:', responseData);
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
      // Handle success
    } catch (error) {

      console.error('Error creating connected account:', error.message);
      // Handle error

      toast.success(error.message, {
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
    {connected ? (
      <>
      <p className="mb-4">Your account is connected.</p>
      <p className="mb-4 ">Check Account Stauts <Link className='text-blue underline' to='/admin/check-account-status'>here..</Link></p>
      </>
    ) : (
      <>
      <p className="mb-4">Please fill out the below information to connect your account.</p>
   
      <form onSubmit={handleSubmit}>
      {/* Input fields */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <label lassName="block text-sm font-bold ml-3">Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
/>
        </div>
        <div>
          <label>Business Type:</label>
          <input type="text" name="businessType" value={formData.businessType} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Business Name:</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
/>
        </div>
        <div>
          <label>MCC:</label>
          <input type="text" name="mcc" value={formData.mcc} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>URL:</label>
          <input type="text" name="url" value={formData.url} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
/>
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Address Line 1:</label>
          <input type="text" name="line1" value={formData.line1} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Postal Code:</label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
/>
        </div>
        <div>
          <label>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Date of Birth (Day):</label>
          <input type="text" name="dobDay" value={formData.dobDay} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Date of Birth (Month):</label>
          <input type="text" name="dobMonth" value={formData.dobMonth} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Date of Birth (Year):</label>
          <input type="text" name="dobYear" value={formData.dobYear} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>SSN Last 4:</label>
          <input type="text" name="ssnLast4" value={formData.ssnLast4} onChange={handleChange}   className="input ml-3 p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
        <div>
          <label>Statement Descriptor:</label>
          <input  type="text" name="statementDescriptor" value={formData.statementDescriptor} onChange={handleChange}   className="input p-2 border border-bold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
 />
        </div>
      </div>
      <button type="submit"  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded d `}>Submit</button>
    </form>

      </>
    )}
   

    <ToastContainer />
  </div>
  );
}

export default ConnectStripe;
