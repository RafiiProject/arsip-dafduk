import React from "react";
import "./loader.scss"; // Gaya untuk loader

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <img src="/src/assets/logoku.png" alt="Logo" className="loader-logo" />
      </div>
    </div>
  );
};

export default Loader;
