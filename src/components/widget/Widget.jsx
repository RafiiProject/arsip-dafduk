import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(0);           // Total entries
  const [todayAmount, setTodayAmount] = useState(0);  // Today's entries
  const [monthAmount, setMonthAmount] = useState(0);  // This month's entries
  const navigate = useNavigate();       // Hook for navigation

  // Define data object that will change based on 'type'
  let data;

  switch (type) {
    case "dinas":
      data = {
        title: "DUKCAPIL DINAS",
        isMoney: false,
        link: "See all data",
        query: "dinas",
        navigateTo: "/dinas",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "tengah":
      data = {
        title: "TPDK SEMARANG TENGAH",
        isMoney: false,
        link: "See all data",
        query: "tengah",
        navigateTo: "/tengah",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "barat":
      data = {
        title: "TPDK SEMARANG BARAT",
        isMoney: false,
        link: "See all data",
        query: "barat",
        navigateTo: "/barat",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "timur":
      data = {
        title: "TPDK SEMARANG TIMUR",
        isMoney: false,
        link: "See all data",
        query: "timur",
        navigateTo: "/timur",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "utara":
      data = {
        title: "TPDK SEMARANG UTARA",
        isMoney: false,
        link: "See all data",
        query: "utara",
        navigateTo: "/utara",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "selatan":
      data = {
        title: "SEMARANG SELATAN",
        isMoney: false,
        link: "See all data",
        query: "selatan",
        navigateTo: "/selatan",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "candisari":
      data = {
        title: "TPDK CANDISARI",
        isMoney: false,
        link: "See all data",
        query: "candisari",
        navigateTo: "/candisari",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "tembalang":
      data = {
        title: "TPDK TEMBALANG",
        isMoney: false,
        link: "See all data",
        query: "tembalang",
        navigateTo: "/tembalang",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "banyumanik":
      data = {
        title: "TPDK BANYUMANIK",
        isMoney: false,
        link: "See all data",
        query: "banyumanik",
        navigateTo: "/banyumanik",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "gajahmungkur":
      data = {
        title: "TPDK GAJAHMUNGKUR",
        isMoney: false,
        link: "See all data",
        query: "gajahmungkur",
        navigateTo: "/gajahmungkur",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "gunungpati":
      data = {
        title: "TPDK GUNUNG PATI",
        isMoney: false,
        link: "See all data",
        query: "gunungpati",
        navigateTo: "/gunungpati",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "ngaliyan":
      data = {
        title: "TPDK NGALIYAN",
        isMoney: false,
        link: "See all data",
        query: "ngaliyan",
        navigateTo: "/ngaliyan",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "pedurungan":
      data = {
        title: "TPDK PEDURUNGAN",
        isMoney: false,
        link: "See all data",
        query: "pedurungan",
        navigateTo: "/pedurungan",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "genuk":
      data = {
        title: "TPDK GENUK",
        isMoney: false,
        link: "See all data",
        query: "genuk",
        navigateTo: "/genuk",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "mijen":
      data = {
        title: "TPDK MIJEN",
        isMoney: false,
        link: "See all data",
        query: "mijen",
        navigateTo: "/mijen",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "tugu":
      data = {
        title: "TPDK TUGU",
        isMoney: false,
        link: "See all data",
        query: "tugu",
        navigateTo: "/tugu",  // Dynamic navigation route
        icon: (
          <BusinessRoundedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  // Fetching the counts from Firestore based on 'type'
  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      // Format today's date as YYYY-MM-DD
      const todayString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      console.log("Today String:", todayString); // Debugging

      // Get the first day of the current month as YYYY-MM-DD
      const startOfMonthString = `${year}-${month < 10 ? '0' + month : month}-01`;

      try {
        // Fetch total entries
        const q = query(collection(db, data.query));
        const querySnapshot = await getDocs(q);
        setAmount(querySnapshot.size);

        // Fetch today's entries
        const qToday = query(
          collection(db, data.query),
          where("date", "==", todayString)
        );
        const queryTodaySnapshot = await getDocs(qToday);
        setTodayAmount(queryTodaySnapshot.size);

        // Fetch this month's entries
        const qMonth = query(
          collection(db, data.query),
          where("date", ">=", startOfMonthString),
          where("date", "<=", todayString)
        );
        const queryMonthSnapshot = await getDocs(qMonth);
        setMonthAmount(queryMonthSnapshot.size);

        // Debug: Check if the documents have correct date field
        querySnapshot.forEach(doc => {
          const docData = doc.data();
          console.log("Document date:", docData.date ? docData.date : "undefined");
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data.query]);
  
  
  
    return (
      <div className="widget" onClick={() => navigate(data.navigateTo)}>
        <div className="left">
          <span className="title">{data.title}</span>
          <div className="percentage positive">
            <h3 style={{ marginRight: "-70px" }}>Total: {amount}</h3>
          </div>
          <span className="link">See all data</span>
        </div>
        <div className="right">
          <div className="icon" style={{ marginTop: "-140px", marginRight: "-5px" }}>
            {data.icon}
          </div>
        </div>
      </div>
    );
  };

export default Widget;
