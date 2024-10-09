import "./listdinas.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatabledinas from "../../components/datatabledinas/Datatabledinas";

const Listdinas = ({columns}) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <br />
        <Datatabledinas columns={columns} />
      </div>
    </div>
  );
};

export default Listdinas;