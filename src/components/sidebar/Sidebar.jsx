import "./sidebar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // <-- Add this line
import LogoutIcon from '@mui/icons-material/Logout';
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { fontSize } from "@mui/system";


const Sidebar = () => {
    const { dispatch } = useContext(DarkModeContext);
    const { dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                authDispatch({ type: "LOGOUT" });
                navigate("/login");
            })
            .catch((error) => {
                console.error("Logout error: ", error);
            });
    };

    // Helper function to check if a path is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <div className="top">
            <img src="src/assets/logoku.png" width="180" height="80"/>
            </div>
            <div className="center">
                <ul>
                    <Link to="/">
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <p className="title">TPDK KECAMATAN</p>
                    <Link to="/tengah">
                        <li className={isActive("/tengah") ? "active" : "/tengah"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Semarang Tengah</span>
                        </li>
                    </Link>
                    <Link to="/utara">
                        <li className={isActive("/utara") ? "active" : "/utara"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Semarang Utara</span>
                        </li>
                    </Link>
                    <Link to="/selatan">
                        <li className={isActive("/selatan") ? "active" : "/selatan"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Semarang Selatan</span>
                        </li>
                    </Link>
                    <Link to="/timur">
                        <li className={isActive("/timur") ? "active" : "/timur"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Semarang Timur</span>
                        </li>
                    </Link>
                    <Link to="/barat">
                        <li className={isActive("/barat") ? "active" : "/barat"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Semarang Barat</span>
                        </li>
                    </Link>
                    <Link to="/genuk">
                        <li className={isActive("/genuk") ? "active" : "/genuk"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Genuk</span>
                        </li>
                    </Link>
                    <Link to="/tembalang">
                        <li className={isActive("/tembalang") ? "active" : "/tembalang"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Tembalang</span>
                        </li>
                    </Link>
                    <Link to="/pedurungan">
                        <li className={isActive("/pedurungan") ? "active" : "/pedurungan"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Pedurungan</span>
                        </li>
                    </Link>
                    <Link to="/candisari">
                        <li className={isActive("/candisari") ? "active" : "/candisari"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Candisari</span>
                        </li>
                    </Link>
                    <Link to="/gajahmungkur">
                        <li className={isActive("/gajahmungkur") ? "active" : "/gajahmungkur"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Gajah Mungkur</span>
                        </li>
                    </Link>
                    <Link to="/banyumanik">
                        <li className={isActive("/banyumanik") ? "active" : "/banyumanik"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Banyumanik</span>
                        </li>
                    </Link>
                    <Link to="/gunungpati">
                        <li className={isActive("/gunungpati") ? "active" : "/gunungpati"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Gunung Pati</span>
                        </li>
                    </Link>
                    <Link to="/dinas">
                        <li className={isActive("/dinas") ? "active" : "/dinas"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Dinas</span>
                        </li>
                    </Link>
                    <Link to="/tugu">
                        <li className={isActive("/tugu") ? "active" : "/tugu"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Tugu</span>
                        </li>
                    </Link>
                    <Link to="/mijen">
                        <li className={isActive("/mijen") ? "active" : "/mijen"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Mijen</span>
                        </li>
                    </Link>
                    <Link to="/ngaliyan">
                        <li className={isActive("/ngaliyan") ? "active" : "/ngaliyan"}>
                            <BusinessRoundedIcon className="icon" />
                            <span>Ngaliyan</span>
                        </li>
                    </Link>
                    <p className="title"></p>
                    <li onClick={handleLogout}>
                        <ExitToAppIcon className="icon" />
                        <span style={{color: "red", fontSize:"16px"  }}>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={() => dispatch({ type: "LIGHT" })}></div>
                <div className="colorOption" onClick={() => dispatch({ type: "DARK" })}></div>
            </div>
        </div>
    );
};

export default Sidebar;
