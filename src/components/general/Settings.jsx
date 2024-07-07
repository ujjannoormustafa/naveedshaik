import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { userData, token } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.full_name,
        email: userData.email,
        phone: userData.phone_number,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(profile);
    try {
      const response = await axios.put('/api/updateProfile', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="  lg:mx-10 mx-2 mt-10 p-5 border border-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5">Profile Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-black">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-black">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
