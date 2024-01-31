// Signup.js
import React, { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  const handleSignup = () => {
    // Send a request to your backend API to handle user registration
    // Include the necessary fields based on the role (admin or user)
    const userData = {
      username,
      email,
      password,
      role,
      businessInfo: role === "admin" ? { businessName, businessType } : null,
    };

    // Send a POST request to your backend API with userData
    // Example using fetch:
    // fetch('/api/signup', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userData),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Handle the response from the server
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     // Handle errors
    //     console.error('Error:', error);
    //   });
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form>
        {/* Add form fields based on your requirements */}
        {/* For example: */}
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />
        {role === "admin" && (
          <>
            <label>
              Business Name:
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Business Type:
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </label>
            <br />
          </>
        )}
        <button
          type="button"
          onClick={handleSignup}
          className="bg-blue-500 text-white px-4 py-2 mt-4"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
