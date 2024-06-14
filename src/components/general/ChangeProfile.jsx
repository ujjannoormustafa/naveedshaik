import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { mdiCamera, mdiAccount, mdiPhone, mdiEmail } from "@mdi/js";
import Icon from "@mdi/react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "./cropImage"; // Implement this function
import "./profile.css"
const ChangeProfile = () => {
  const { token, userData, logout } = useAuth();
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    setUserData(userData);
  }, [userData]);

  const handleFileChange = (event) => {
    setNewProfileImage(URL.createObjectURL(event.target.files[0]));
    setIsModalOpen(true);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(newProfileImage, croppedAreaPixels);
      handleUpload(croppedImage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleUpload = async (croppedImage) => {
    try {
      const formData = new FormData();
      formData.append("image", croppedImage);

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
        logout();
        navigate("/login", { replace: true, state: { message: "Session expired. Please log in again.", from: location.pathname } });
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

  const handleWheel = (event) => {
    event.preventDefault();
    setZoom((zoom) => Math.min(3, Math.max(1, zoom - event.deltaY / 100)));
  };

  return (
    <div className="max-w-screen-xl h-full mx-auto p-6 bg-white rounded-md flex flex-col lg:flex-row justify-center items-center overflow-hidden">
      <ToastContainer />
      <div className="relative mb-6 lg:mr-6 lg:mb-0">
        <div className="rounded-md overflow-hidden w-80 h-80 lg:w-96 lg:h-96 mx-auto">
          <img
            src={NewuserData.profileImage}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
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

      <div className="w-full max-w-md p-5 lg:ml-6">
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Profile Image"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto relative">
          <h2 className="text-xl font-semibold mb-4">Edit Profile Image</h2>
          {newProfileImage && (
            <div className="w-full h-96 relative mb-4">
              <Cropper
                image={newProfileImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                // cropSize={{ width: 200, height: 300 }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{
                  containerClassName: "cropper-container",
                  mediaClassName: "cropper-media"
                }}
              />
            </div>
          )}
          <button
            className="bg-black text-white py-2 px-4 rounded"
            onClick={handleCrop}
          >
            Crop and Upload
          </button>
          <button
            className="bg-black text-white py-2 px-4 rounded ml-2"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeProfile;
