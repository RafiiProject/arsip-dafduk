import "./login.scss"; 
import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/loader/Loader"; // Import Loader Component

const Login = () => { 
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); // Show loader when login starts

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user; 
        dispatch({ type: "LOGIN", payload: user });
        setLoading(false); // Hide loader after successful login
        navigate('/');
      })
      .catch((error) => {
        setError(true);
        setLoading(false); // Hide loader if login fails
      });
  };

  return (
    <div className="login">
      <div className="login-container">
        <img src="/src/assets/logoku.png" width="300" height="150" alt="Logo" />
        <h1>Arsip Pencetakan KTP</h1>

        {/* Show loader when loading */}
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              placeholder="password" 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <span>Wrong email or password!</span>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
