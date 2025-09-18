import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;
