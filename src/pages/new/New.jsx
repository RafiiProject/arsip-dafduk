import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { doc, serverTimestamp, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db, storage } from "../../firebase"; // Import storage
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage methods
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from 'react-icons/fa';

const New = ({ inputs, title }) => {
  const [file, setFile] = useState(null); // State untuk menyimpan file
  const [fileUrl, setFileUrl] = useState(""); // State untuk menyimpan URL file setelah diupload
  const [data, setData] = useState({});
  const [dropdownValue, setDropdownValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [keteranganError, setKeteranganError] = useState("");

  // Tambahkan state untuk mengontrol apakah input nama, NIK, dan file harus dinonaktifkan
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

    // Jika pilihan RUSAK dipilih, maka nonaktifkan input nama, NIK, dan file
    if (selectedLabel === "RUSAK") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false); // Aktifkan kembali jika opsi lain dipilih
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
    setLoading(true);

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

      // Jika ada file, lakukan upload ke Firebase Storage
      if (file) {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;

        fileUrl = await getDownloadURL(storageRef); // Ambil URL file
      }

      const newData = {
        ...data,
        fileUrl, // Simpan URL file ke Firestore
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
    setLoading(false);
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
                        disabled={(input.id === 'nama' || input.id === 'nik') && isDisabled} // Nonaktifkan input jika isDisabled true
                      />
                      {input.id === "tanggal" && dateError && <span className="error">{dateError}</span>}
                    </>
                  )}
                </div>
              ))}

              {/* Tambahkan input untuk unggah file */}
              <div className="formInput">
                <label>Upload File PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isDisabled} // Nonaktifkan file upload jika RUSAK dipilih
                />
              </div>
              <div className="button">
                <button type="submit" disabled={loading} style={{backgroundColor:"green"}}>
                  {loading ? <FaSpinner className="spinner" /> : "Send"}
                </button>
                <button type="button" onClick={() => navigate(-1)} disabled={loading} style={{backgroundColor:"red"}}>
                  {loading ? <FaSpinner className="spinner" /> : "Batal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
