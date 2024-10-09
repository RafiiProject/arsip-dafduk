import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <div>SiPeta KTP</div>
          <div className="arsip">Arsip Pencetakan KTP</div>
        </div>
        <div className="items">
          <div className="item">
            <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: "TOGGLE" })} />
          </div>
          <div className="item">
          <img src="/src/assets/logo-new.png" width="300" height="50"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
