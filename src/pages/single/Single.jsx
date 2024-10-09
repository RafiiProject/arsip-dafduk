import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import PDFIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useNavigate } from "react-router-dom";

const Single = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      const collections = ["tengah", "dinas", "banyumanik", "barat", "gajahmungkur", "utara"];
      let documentFound = null;
    
      for (const collectionName of collections) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          documentFound = docSnap.data();
          break;
        }
      }
    
      if (documentFound) {
        setData(documentFound);
      } else {
        console.error("Dokumen tidak ditemukan di koleksi manapun!");
      }
    };

    fetchDocument();
  }, [id]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="contentContainer">
          <div className="left">
            <div className="detailItem1">
              <span className="itemValue">{data.keterangan || "Keterangan tidak tersedia"}</span>
            </div>

            <div className="detailItem">
              <span className="itemKey">NIK: </span>
              <br />
              <span className="itemValue">{data.nik || "NIK tidak tersedia"}</span>
            </div>

            <div className="detailItem2">
              <span className="itemKey2">Tanggal: </span>
              <br />
              <span className="itemValue">{data.tanggal || "Tanggal tidak tersedia"}</span>
            </div>
          </div>
        </div>

        {/* Card PDF Section */}
        <div className="right pdfCard">
          <div className="pdfIconWrapper">
            <PDFIcon className="icon" />
          </div>
          <div className="pdfLinkWrapper">
            <span className="pdfTitle">PDF File:</span>
            <br /><br />
            <span className="pdfLink">
              {data.fileUrl ? (
                <a href={data.fileUrl} target="_blank" rel="noopener noreferrer">
                  Lihat PDF
                </a>
              ) : (
                "Tidak ada file PDF yang diunggah"
              )}
            </span>
          </div>
        </div>
          
          <div className="itemTitle5">
            <h1>{data.nama || "Nama tidak tersedia"}</h1>
          </div>
          <div className="bottom">
            <button className="backButton" onClick={() => navigate(-1)}>
              Kembali
            </button>
          </div>
      </div>
    </div>
  );
};

export default Single;
