import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AboutSection from "./AboutSection";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      setMessage(res.data);
      if (res.data === "Login successful!") {
        navigate("/home"); // after login move to another page
      }
    } catch (err) {
      setMessage("Error logging in!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>SuitX</h1>
      <h2>AI Risk Manager</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>

      <p>Don’t have an account?</p>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>

      <AboutSection />
    </div>
  );
}

export default LoginPage;
