import React from "react";
import logo from "../../resources/images/logo.png";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <img src={logo} alt="Loading..." className="loader-logo rounded-full" />
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Loader;


