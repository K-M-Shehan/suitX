import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/signup", {
        email,
        password,
      });
      setMessage(res.data);
      if (res.data === "Signup successful!") {
        navigate("/");
      }
    } catch (err) {
      setMessage("Error signing up!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sign Up</h1>

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

      <button onClick={handleSignup}>Register</button>
      <p>{message}</p>
    </div>
  );
}

export default SignupPage;
