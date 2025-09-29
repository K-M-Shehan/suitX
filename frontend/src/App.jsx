import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import ProjectsPage from "./pages/ProjectsPage";
import LaunchpadPage from "./pages/LaunchpadPage";
import RiskDashboard from "./pages/RiskDashboard";
import MitigationPage from "./pages/MitigationPage";
import ApiTest from "./components/ApiTest";

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('Launchpad');
  const navigate = useNavigate();
  const location = useLocation();

  // Update active menu item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/launchpad') || path === '/dashboard') {
      setActiveMenuItem('Launchpad');
    } else if (path.includes('/projects')) {
      setActiveMenuItem('Projects');
    } else if (path.includes('/risks')) {
      setActiveMenuItem('Risks');
    } else if (path.includes('/mitigations')) {
      setActiveMenuItem('Mitigations');
    } else if (path.includes('/history')) {
      setActiveMenuItem('History');
    }
  }, [location]);

  // Handle sidebar navigation
  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    switch (itemName) {
      case 'Launchpad':
        navigate('/launchpad');
        break;
      case 'Projects':
        navigate('/projects');
        break;
      case 'Risks':
        navigate('/risks');
        break;
      case 'Mitigations':
        navigate('/mitigations');
        break;
      case 'History':
        navigate('/history');
        break;
      default:
        navigate('/launchpad');
    }
  };

  // Layout wrapper for authenticated pages
  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route 
        path="/launchpad" 
        element={
          <DashboardLayout>
            <LaunchpadPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <DashboardLayout>
            <LaunchpadPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <DashboardLayout>
            <ProjectsPage />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/risks" 
        element={
          <DashboardLayout>
            <RiskDashboard />
          </DashboardLayout>
        } 
      />
      <Route 
        path="/mitigations" 
        element={
          <DashboardLayout>
            <MitigationPage />
          </DashboardLayout>
        } 
      />
      <Route path="/test" element={<ApiTest />} />
    </Routes>
  );
}

export default App;
