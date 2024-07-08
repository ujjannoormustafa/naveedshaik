import React from 'react';
import { FaHome, FaCalendarAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      {/* <div className="bg-black text-white w-full lg:w-64 space-y-6 py-7 px-2 flex-shrink-0">
        <div className="text-3xl font-semibold text-center">
          Admin Dashboard
        </div>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="flex items-center py-2 px-4 text-white hover:bg-gray-700 hover:text-white rounded">
            <FaHome className="mr-3" /> Home
          </a>
          <a href="#" className="flex items-center py-2 px-4 text-white hover:bg-gray-700 hover:text-white rounded">
            <FaCalendarAlt className="mr-3" /> Manage Events
          </a>
          <a href="#" className="flex items-center py-2 px-4 text-white hover:bg-gray-700 hover:text-white rounded">
            <FaUsers className="mr-3" /> Manage Users
          </a>
          <a href="#" className="flex items-center py-2 px-4 text-white hover:bg-gray-700 hover:text-white rounded">
            <FaSignOutAlt className="mr-3" /> Logout
          </a>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-10 bg-white">
        <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black">Total Items</h2>
            <p className="text-gray-600 text-3xl">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black">Total Users</h2>
            <p className="text-gray-600 text-3xl">156</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black">Revenue</h2>
            <p className="text-gray-600 text-3xl">$12,340</p>
          </div>
        </div>

        {/* Manage Events */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-black">Manage Items</h2>
          <button className="bg-black text-white px-4 py-2 rounded mb-4">Add New Event</button>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Event Name</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Location</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Music Concert</td>
                <td className="py-2 px-4 border-b">July 25, 2024</td>
                <td className="py-2 px-4 border-b">New York</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-black text-white px-4 py-1 rounded mr-2">Edit</button>
                  <button className="bg-black text-white px-4 py-1 rounded">Delete</button>
                </td>
              </tr>
              {/* Add more events here */}
            </tbody>
          </table>
        </div>

        {/* Manage Users */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black">Manage Users</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">john_doe</td>
                <td className="py-2 px-4 border-b">john@example.com</td>
                <td className="py-2 px-4 border-b">User</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-black text-white px-4 py-1 rounded mr-2">Edit</button>
                  <button className="bg-black text-white px-4 py-1 rounded">Delete</button>
                </td>
              </tr>
              {/* Add more users here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
