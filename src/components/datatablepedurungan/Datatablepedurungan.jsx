import "./datatablepedurungan.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { borderRadius } from "@mui/system";

// Define the columns outside of the component
const getColumns = (isDateSortable) => [
  { field: "id", headerName: "ID", width: 70 },
  { field: "NIK", headerName: "NIK", width: 250 },
  { field: "NAMA", headerName: "NAMA", width: 400 },
  {
    field: "KETERANGAN",
    headerName: "KETERANGAN",
    type: "text",
    width: 200,
  },
  {
    field: "Date",
    headerName: "TANGGAL",
    width: 250,
    sortable: isDateSortable,
    sortComparator: (v1, v2) => {
      const date1 = new Date(v1.split("/").reverse().join("-")); // dd/mm/yyyy format
      const date2 = new Date(v2.split("/").reverse().join("-"));
      return date2 - date1; // Sort in descending order (latest first)
    },
  },
];

const Datatablepedurungan = () => {
  const location = useLocation();
  const type = location.pathname.split("/")[1];
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [dates, setDates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian
  const [isDateSortable, setIsDateSortable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, type),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          const docData = doc.data();
          list.push({
            id: doc.id,
            NIK: docData.nik || "",
            NAMA: docData.nama || "",
            KETERANGAN: docData.keterangan || "",
            Date: docData.tanggal || "",
          });
        });

        // Sort data by date (latest first)
        list.sort((a, b) => {
          const dateA = new Date(a.Date.split("/").reverse().join("-"));
          const dateB = new Date(b.Date.split("/").reverse().join("-"));
          return dateB - dateA; // Sort descending (latest first)
        });

        const groupedByDate = groupByDate(list);
        // Sort dates in descending order
        setDates(
          Object.keys(groupedByDate).sort((a, b) => {
            const dateA = new Date(a.split("/").reverse().join("-"));
            const dateB = new Date(b.split("/").reverse().join("-"));
            return dateB - dateA; // Latest date first
          })
        );
        setGroupedData(groupedByDate);
        setData(list); // Store all data for later filtering
        setFilteredData(list); // Set initial data to display all data
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [type]);

  const groupByDate = (dataList) => {
    const grouped = {};
    dataList.forEach((item) => {
      const date = item.Date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, type, id));
      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("pedurungan").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // To reload the page after printing
  };

  const handleDateSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    if (groupedData[date]) {
      setFilteredData(groupedData[date]);
    } else {
      setFilteredData([]); // No data found for the selected date
    }

    setIsDateSortable(!!date); // Enable date sorting only when there is a search date
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = data;
    
    // Jika ada pencarian berdasarkan tanggal
    if (searchDate && groupedData[searchDate]) {
      filtered = groupedData[searchDate];
    }

    // Filter berdasarkan NIK atau Nama
    filtered = filtered.filter((item) => {
      return (
        item.NIK.toLowerCase().includes(query) || item.NAMA.toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={"/" + type + "/" + params.row.id}
              style={{ textDecoration: "none" }}
            >
              <span className="viewButton">View</span>
            </Link>
            <span>
              <span
                className="deleteButton"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </span>
            </span>
          </div>
        );
      },
    },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div id="pedurungan" className="datatablepedurungan">
      <div style={{display: "flex",
        height: "30px",
        width: "1400px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "15px",  
        boxShadow: "5px 10px 20px rgba(0.1, 0.1, 0.1, 0.1)", /* Soft shadow for depth */
        transition: "transform 0.3s ease-in-out"}}>
        <div className="datatablepedurunganTitle">
        <Link
            to={"/" + type + "/new"}
            style={{ textDecoration: "none", marginLeft:"1200px"}}>
            Add New
          </Link>
          <button
            onClick={handlePrint}
            style={{ padding: "5px 10px", cursor: "pointer", marginLeft: "15px"}}
          >
            Print
          </button>
        </div>

        {/* Input untuk pencarian NIK/Nama */}
        <div style={{marginTop: "-25px", marginLeft:"-1400px", marginRight: "50px"}}>
          <h2>Search</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by NIK or Name"
            style={{ padding: "5px", marginBottom: "20px"}}
          />
        </div>

        {/* Input untuk pencarian berdasarkan tanggal */}
        <div style={{ marginTop: "-25px"}}>
          <h2>Tanggal</h2>
          <input
            type="date"
            value={searchDate}
            onChange={handleDateSearch}
            style={{ padding: "5px", marginBottom: "20px" }}
          />
        </div>
      </div>

      <div id="tableToPrint" style={{marginTop:"30px"}}>
        <h1>Pedurungan</h1>
        
        {/* Menampilkan tanggal yang sedang ditampilkan jika ada pencarian berdasarkan tanggal */}
        {searchDate && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Menampilkan Data untuk Tanggal: {searchDate}</h3>
          </div>
        )}

        {filteredData.length > 0 ? (
          <>
            <h3>Jumlah Data: {filteredData.length}</h3>
            <DataGrid
              className="datagrid"
              rows={filteredData}
              columns={getColumns(isDateSortable).concat(actionColumn)}
              pageSize={5}
              checkboxSelection
            />
          </>
        ) : (
          <p>No data found</p>
        )}
      </div>
    </div>
  );
};

export default Datatablepedurungan;
