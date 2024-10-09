import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Datatabledinas from "../../components/datatabledinas/Datatabledinas";


const Home = () => {
  return (
    <div className="home">
        <Sidebar />
        <div className="homeContainer">
            <Navbar/>
            <br />
            <h1>DAFTAR TPDK KECAMATAN</h1>
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
  );
};

export default Home;