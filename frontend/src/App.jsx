import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('Projects');

  // Layout wrapper for authenticated pages
  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <DashboardLayout>
            <ProjectsPage />
          </DashboardLayout>
        } 
      />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route 
        path="/projects" 
        element={
          <DashboardLayout>
            <ProjectsPage />
          </DashboardLayout>
        } 
      />
    </Routes>
  );
}

export default App;
