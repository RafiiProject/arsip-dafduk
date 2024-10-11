import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader"; // Import Loader Component

const Home = () => {
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    // Simulate loading time (can be replaced with actual logic)
    setTimeout(() => {
      setLoading(false); // Hide loader after home page loads
    }, 1000); // Simulating a 1-second delay
  }, []);

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <br />
        <div className="isicontainer">
          <h1 className="line-text">DAFTAR TPDK KECAMATAN</h1> {/* Add the class for line */}
          <div className="widgets">
            <Widget type="dinas" />
            <Widget type="tengah" />
            <Widget type="barat" />
            <Widget type="timur" />
          </div>
          <div className="widgets1">
            <Widget type="utara" />
            <Widget type="selatan" />
            <Widget type="tembalang" />
            <Widget type="banyumanik" />
          </div>
          <div className="widgets2">
            <Widget type="gajahmungkur" />
            <Widget type="candisari" />
            <Widget type="genuk" />
            <Widget type="gunungpati" />
          </div>
          <div className="widgets3">
            <Widget type="mijen" />
            <Widget type="ngaliyan" />
            <Widget type="pedurungan" />
            <Widget type="tugu" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
