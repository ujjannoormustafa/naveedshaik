// ChangeProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { mdiCamera } from "@mdi/js";
import Icon from "@mdi/react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
const ChangeProfile = () => {
  const { token, userData } = useAuth();
  const [NewuserData, setUserData] = useState({
    full_name: "",
    profileImage: "",
    phone_number: "",
    email: "",
  });

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          console.error("User token not available");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/user/${userData._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setNewProfileImage(event.target.files[0]);
    handleUpload();
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", newProfileImage);

      if (!token) {
        console.error("User token not available");
        return;
      }
      console.log(token);
      const response = await axios.post(
        `${BASE_URL}/api/user/change-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("Profile image updated successfully");
        setUserData({
          ...NewuserData,
          profileImage: response.data.user.profileImage,
        });
      }
    } catch (error) {
      console.error("Error updating profile image:", error.message);
      setUploadStatus("Failed to update profile image");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Change Profile</h2>

      <div className="mb-4 relative">
        <div className="rounded-full overflow-hidden w-24 h-24 mx-auto">
          <img
            src={NewuserData.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <label
          htmlFor="profileImageInput"
          className="cursor-pointer absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white"
        >
          <Icon
            path={mdiCamera}
            title="Toggle Password"
            size={1}
            color="black"
          />
        </label>
        <input
          type="file"
          id="profileImageInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-600"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          value={NewuserData.full_name}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-600"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          value={NewuserData.phone_number}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          value={NewuserData.email}
          readOnly
        />
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={handleUpload}
        disabled={!newProfileImage}
      >
        Upload Profile Image
      </button>

      {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
    </div>
  );
};

export default ChangeProfile;
