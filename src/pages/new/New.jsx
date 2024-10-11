import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { doc, serverTimestamp, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db, storage } from "../../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from 'react-icons/fa';
import Loader from "../../components/loader/Loader"; // Import Loader Component

const New = ({ inputs, title }) => {
  const [file, setFile] = useState(null); 
  const [fileUrl, setFileUrl] = useState(""); 
  const [data, setData] = useState({});
  const [dropdownValue, setDropdownValue] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const [dateError, setDateError] = useState("");
  const [keteranganError, setKeteranganError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.split('/')[1];

  const handleDropdownChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedLabel = selectedOption.text;
    setDropdownValue(selectedOption.value);
    setData({ ...data, keterangan: selectedLabel });
    setKeteranganError("");

    if (selectedLabel === "RUSAK") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false); 
    }
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    if (id === "tanggal") {
      setDateError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    if (!dropdownValue) {
      setKeteranganError("Keterangan wajib dipilih.");
      setLoading(false);
      return;
    }

    if (!data.tanggal) {
      setDateError("Tanggal wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      let fileUrl = "";

      // Upload file to Firebase Storage if a file is selected
      if (file) {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        fileUrl = await getDownloadURL(storageRef);
      }

      const newData = {
        ...data,
        fileUrl, 
        timeStamp: serverTimestamp(),
      };

      if (type === "users") {
        const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await setDoc(doc(db, type, res.user.uid), newData);
      } else {
        await addDoc(collection(db, type), newData);
      }

      navigate(-1);
    } catch (err) {
      console.log(err);
    }
    setLoading(false); // Set loading to false after data is submitted
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAdd}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "select" ? (
                    <>
                      <select
                        name={input.label}
                        value={dropdownValue}
                        onChange={handleDropdownChange}
                      >
                        <option value="">Pilih {input.label}</option>
                        {input.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {keteranganError && <span className="error">{keteranganError}</span>}
                    </>
                  ) : (
                    <>
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        id={input.id}
                        onChange={handleInput}
                        value={input.id === 'keterangan' ? dropdownValue : data[input.id] || ""}
                        disabled={(input.id === 'nama' || input.id === 'nik') && isDisabled}
                      />
                      {input.id === "tanggal" && dateError && <span className="error">{dateError}</span>}
                    </>
                  )}
                </div>
              ))}

              {/* Upload file input */}
              <div className="formInput">
                <label>Upload File PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isDisabled}
                />
              </div>
              <div className="button">
                <button type="submit" disabled={loading} style={{ backgroundColor: "green" }}>
                  {loading ? <FaSpinner className="spinner" /> : "Send"}
                </button>
                <button type="button" onClick={() => navigate(-1)} disabled={loading} style={{ backgroundColor: "red" }}>
                  {loading ? <FaSpinner className="spinner" /> : "Batal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Show loader when loading */}
      {loading && <Loader />}
    </div>
  );
};

export default New;
