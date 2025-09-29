import { useState } from "react";

export default function SettingsPage() {
  const sections = [
    { key: "account", title: "Account" },
    { key: "notifications", title: "Notifications" },
    { key: "privacy", title: "Privacy" },
    { key: "theme", title: "Theme" },
    { key: "security", title: "Security" },
    { key: "contact", title: "Contact Us" },
  ];

  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Account Details</h3>
            <input type="text" placeholder="Username" className="border p-2 w-full mb-2" />
            <input type="email" placeholder="Email" className="border p-2 w-full mb-2" />
            <input type="password" placeholder="Password" className="border p-2 w-full mb-2" />
          </div>
        );
      case "notifications":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Notification Settings</h3>
            <label className="block mb-1">
              <input type="checkbox" /> Email Alerts
            </label>
            <label className="block mb-1">
              <input type="checkbox" /> SMS Alerts
            </label>
          </div>
        );
      case "privacy":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Privacy Settings</h3>
            <label className="block mb-1">
              <input type="checkbox" /> Profile Visible
            </label>
            <label className="block mb-1">
              <input type="checkbox" /> Search Visible
            </label>
          </div>
        );
      case "theme":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Theme Settings</h3>
            <label className="block mb-1">
              <input type="checkbox" /> Dark Mode
            </label>
          </div>
        );
      case "security":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Security Settings</h3>
            <label className="block mb-1">
              <input type="checkbox" /> Two-Factor Authentication
            </label>
          </div>
        );
      case "contact":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <textarea placeholder="Your message" className="border p-2 w-full" />
          </div>
        );
      default:
        return <p className="text-gray-500">Select a setting to view details</p>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 rounded border ${
              activeSection === section.key ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Active section details */}
      {renderSection()}
    </div>
  );
}