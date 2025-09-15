import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
