import "./datatabletengah.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader"; // Import Loader Component
import { borderRadius } from "@mui/system";

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
      const date1 = new Date(v1.split("/").reverse().join("-"));
      const date2 = new Date(v2.split("/").reverse().join("-"));
      return date2 - date1; // Sort in descending order (latest first)
    },
  },
];

const Datatabletengah = () => {
  const location = useLocation();
  const type = location.pathname.split("/")[1];
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [dates, setDates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDateSortable, setIsDateSortable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRusak, setTotalRusak] = useState(0); // State for total "rusak" count
  const [rusakPerDate, setRusakPerDate] = useState(0); // State for "rusak" count per date
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    setLoading(true); // Show loader when fetching data
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
          return dateB - dateA;
        });

        const groupedByDate = groupByDate(list);
        setDates(
          Object.keys(groupedByDate).sort((a, b) => {
            const dateA = new Date(a.split("/").reverse().join("-"));
            const dateB = new Date(b.split("/").reverse().join("-"));
            return dateB - dateA;
          })
        );
        setGroupedData(groupedByDate);
        setData(list);
        setFilteredData(list);

        // Calculate total "rusak" count
        const totalRusakCount = list.filter(item => item.KETERANGAN.toLowerCase() === "rusak").length;
        setTotalRusak(totalRusakCount);

        setLoading(false); // Hide loader after fetching is done
      },
      (error) => {
        console.log(error);
        setLoading(false); // Hide loader in case of error
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
    const printContents = document.getElementById("tengah").innerHTML;
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

      // Calculate "rusak" count for the selected date
      const rusakCountForDate = groupedData[date].filter(item => item.KETERANGAN.toLowerCase() === "rusak").length;
      setRusakPerDate(rusakCountForDate);
    } 
    else {
      setFilteredData([]);
      setRusakPerDate(0);
    }

    setIsDateSortable(!!date);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = data;
    
    if (searchDate && groupedData[searchDate]) {
      filtered = groupedData[searchDate];
    }

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
    <div id="tengah" className="datatabletengah">
      {/* Show Loader when loading */}
      {loading && <Loader />}

      {!loading && (
        <>
          <div className="datatablehead">
            <div className="datatabletengahTitle">
              <Link
                to={"/" + type + "/new"}
                style={{ textDecoration: "none" }}
              >
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
            <div style={{marginLeft:"-1400px", marginRight: "50px"}}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by NIK or Name"
                style={{ padding: "5px", marginBottom: "20px"}}
              />
            </div>

            {/* Input untuk pencarian berdasarkan tanggal */}
            <div>
              <input
                type="date"
                value={searchDate}
                onChange={handleDateSearch}
                style={{ padding: "5px", marginBottom: "20px" }}
              />
            </div>
          </div>

          <div id="tableToPrint" style={{marginTop:"30px"}}>
            <h1>Semarang Tengah</h1>
            
            {!searchDate && (
              <div >
                <br />
              </div>
            )}

            {searchDate && (
              <div >
                <h3 >Menampilkan Data untuk Tanggal: {searchDate}</h3>
              </div>
            )}

            {filteredData.length > 0 ? (
              <>
                <div style={{backgroundColor: "white", boxShadow:" 0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius:"20px", width:"100px", marginLeft:"1450px", marginTop:"-80px", marginBottom: "20px", textAlign:"center", padding:"10px"}}>
                  <h4 style={{fontSize:"12px"}}>Jumlah Data<br /></h4>
                  <h4 style={{fontSize:"25px", fontWeight:"800", color:"blue"}}>{filteredData.length}</h4>
                </div>
                {searchDate && (
                  <div style={{backgroundColor: "white", boxShadow:" 0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius:"20px", width:"100px", marginLeft:"1310px", marginTop:"-90px", marginBottom: "20px", textAlign:"center", padding:"10px"}}>
                    <h4 style={{fontSize:"12px"}}>Data Rusak<br /></h4>
                    <h4 style={{fontSize:"25px", fontWeight:"800", color:"red"}}>{rusakPerDate}<br /></h4>
                  </div>
                )}
                {searchQuery && (
                  <div style={{backgroundColor: "white", boxShadow:" 0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius:"20px", width:"100px", marginLeft:"1450px", marginTop:"-90px", marginBottom: "20px", textAlign:"center", padding:"10px"}}>
                    <h4 style={{fontSize:"12px"}}>Jumlah Data<br /></h4>
                    <h4 style={{fontSize:"25px", fontWeight:"800", color:"blue"}}>{filteredData.length}</h4>
                  </div>
                )}
                {!searchDate && !searchQuery && (
                  <div style={{backgroundColor: "white", boxShadow:" 0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius:"20px", width:"100px", marginLeft:"1310px", marginTop:"-90px", marginBottom: "20px", textAlign:"center", padding:"10px"}}>
                    <h4 style={{fontSize:"12px"}}>Data Rusak<br /></h4>
                    <h4 style={{fontSize:"25px", fontWeight:"800", color:"red"}}>{totalRusak}<br /></h4>
                  </div>
                )}
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
        </>
      )}
    </div>
  );
};

export default Datatabletengah;
