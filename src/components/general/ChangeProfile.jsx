// ChangeProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { mdiCamera, mdiCheck, mdiAccount, mdiPhone, mdiEmail } from "@mdi/js";
import Icon from "@mdi/react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ChangeProfile = () => {
  const { token, userData,logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [NewuserData, setUserData] = useState({
    full_name: "",
    profileImage: "",
    phone_number: "",
    email: "",
  });

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     if (!token) {
    //       console.error("User token not available");
    //       return;
    //     }

    //     const response = await axios.get(
    //       `${BASE_URL}/api/user/${userData._id}`,
    //       {
    //         headers: {
    //           Authorization: token,
    //         },
    //       }
    //     );
    //     console.log(response);
    //     setUserData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error.message);
    //   }
    // };

    // fetchData();
    setUserData(userData);
  }, []);

  const handleFileChange = (event) => {
    setNewProfileImage(event.target.files[0]);
    console.log("New Profile Image: " + JSON.stringify(event.target.files[0]))
    handleUpload();
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", newProfileImage);
  
      if (!token) {
        console.error("User token not available");
        setUploadStatus("Failed to update profile image: User token not available");
        return;
      }
  
      const response = await axios.post(
        `${BASE_URL}/api/user/change-profile`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      if (response.status === 200) {
        setUploadStatus("Profile image updated successfully");
        setUserData((prevUserData) => ({
          ...prevUserData,
          profileImage: response.data.user.profileImage,
        }));
        toast.success("Profile image updated successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.error("Failed to update profile image:", response);
        
        setUploadStatus("Failed to update profile image");
        toast.error("Failed to update profile image", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      if (error.response && error.response.status === 401) {
        setUploadStatus("Token expired. Please log in again.");
        // Handle token expiration, e.g., by logging out the user
        logout();
        navigate("/login", { replace: true,state: { message: "Session expired. Please log in again.",from: location.pathname }  });
      } else {
        setUploadStatus("Failed to update profile image");
        toast.error("Failed to update profile image", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
      }
    }
  };

  return (
    <div className="max-w-screen-xl h-full mx-auto p-6 bg-white rounded-md  flex flex-col  lg:flex-row justify-center items-center">
      <ToastContainer/>
      <div className="relative mb-6">
        <div className="rounded-md overflow-hidden w-96 h-96 mx-auto">
          <img
            src={NewuserData.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <label
          htmlFor="profileImageInput"
          className="cursor-pointer bg-white text-white p-2 m-2 rounded-full absolute bottom-0 right-0"
        >
          <Icon
            path={mdiCamera}
            title="Upload Profile Image"
            size={2}
            className="bg-transparent text-black "
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

      <div className="w-full max-w-md p-5">
        <div className="mb-6 flex items-center">
          <Icon
            path={mdiAccount}
            title="Full Name"
            size={2}
            className="text-black mr-4"
          />
          <div className="text-lg font-semibold text-black">
            {NewuserData.full_name}
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <Icon
            path={mdiPhone}
            title="Phone Number"
            size={2}
            className="text-black mr-4"
          />
          <div className="text-lg font-semibold text-black">
            {NewuserData.phone_number}
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <Icon
            path={mdiEmail}
            title="Email"
            size={2}
            className="text-black mr-4"
          />
          <div className="text-lg font-semibold text-black">
            {NewuserData.email}
          </div>
        </div>

        {/* {uploadStatus && (
          <p className="mt-4 flex items-center text-green-600">
            <Icon path={mdiCheck} title="Success" size={1.5} className="mr-2" />
            {uploadStatus}
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ChangeProfile;
