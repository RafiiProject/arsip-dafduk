import "./login.scss"; 
import { useState,useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => { 
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navitage = useNavigate();

  const {dispatch} = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user; 
        dispatch ({type:"LOGIN", payload:user});
        navitage('/');
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <div className="login">
      <div className="login-container">
      <img src="src/assets/logoku.png" width="300" height="150"/>
        <h1>Arsip Pencetakan KTP</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email" 
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password" 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <span>Wrong email or password!</span>}
      </form>
      </div>
    </div>
  );
};

export default Login;