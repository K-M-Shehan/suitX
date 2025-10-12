// frontend/src/App.jsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import LaunchpadPage from "./pages/LaunchpadPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import RiskDashboard from "./pages/RiskDashboardSimple";
import MitigationPage from "./pages/MitigationPageSimple";
import RiskHistoryPage from "./pages/RiskHistoryPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import RiskDetailPage from "./pages/RiskDetailPage";
import MitigationDetailPage from "./pages/MitigationDetailPage";
import ApiTest from "./components/ApiTest";

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("Launchpad");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/launchpad") || path === "/dashboard") setActiveMenuItem("Launchpad");
    else if (path.includes("/projects")) setActiveMenuItem("Projects");
    else if (path.includes("/profile")) setActiveMenuItem("Profile");
    else if (path.includes("/risks")) setActiveMenuItem("Risks");
    else if (path.includes("/mitigations")) setActiveMenuItem("Mitigations");
    else if (path.includes("/history")) setActiveMenuItem("History");
  }, [location]);

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    switch (itemName) {
      case "Launchpad": navigate("/launchpad"); break;
      case "Projects": navigate("/projects"); break;
      case "Profile": navigate("/profile"); break;
      case "Risks": navigate("/risks"); break;
      case "Mitigations": navigate("/mitigations"); break;
      case "History": navigate("/history"); break;
      default: navigate("/launchpad");
    }
  };

  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeItem={activeMenuItem} onItemClick={handleMenuItemClick} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={
        <DashboardLayout>
          <LaunchpadPage />
        </DashboardLayout>
      } />
      <Route path="/launchpad" element={
        <DashboardLayout>
          <LaunchpadPage />
        </DashboardLayout>
      } />
      <Route path="/projects" element={
        <DashboardLayout>
          <ProjectsPage />
        </DashboardLayout>
      } />
      <Route path="/projects/:projectId" element={
        <DashboardLayout>
          <ProjectDetailsPage />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout>
          <ProfilePage />
        </DashboardLayout>
      } />
      <Route path="/user/:userId" element={
        <DashboardLayout>
          <UserProfilePage />
        </DashboardLayout>
      } />
      <Route path="/settings" element={
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      } />
      <Route path="/notifications" element={
        <DashboardLayout>
          <NotificationsPage />
        </DashboardLayout>
      } />
      <Route path="/risks" element={
        <DashboardLayout>
          <RiskDashboard />
        </DashboardLayout>
      } />
      <Route path="/risks/:riskId" element={
        <DashboardLayout>
          <RiskDetailPage />
        </DashboardLayout>
      } />
      <Route path="/mitigations" element={
        <DashboardLayout>
          <MitigationPage />
        </DashboardLayout>
      } />
      <Route path="/mitigations/:id" element={
        <DashboardLayout>
          <MitigationDetailPage />
        </DashboardLayout>
      } />
      <Route path="/history" element={
        <DashboardLayout>
          <RiskHistoryPage />
        </DashboardLayout>
      } />
      <Route path="/test" element={<ApiTest />} />
    </Routes>
  );
}

export default App;