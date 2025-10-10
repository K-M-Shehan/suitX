import { useEffect, useState } from "react";
import axios from "axios";

export default function SettingsPage({ userEmail }) {
  const [settings, setSettings] = useState({
    username: "",
    email: userEmail || "",
    emailAlerts: false,
    smsAlerts: false,
    message: "",
  });

  const [activeSection, setActiveSection] = useState(null);

  // Load user settings from backend
  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`http://localhost:8080/api/settings/${userEmail}`)
      .then((res) => setSettings(res.data))
      .catch(() => console.log("No existing settings found."));
  }, [userEmail]);

  // Save changes to backend
  const handleSave = () => {
    axios
      .post("http://localhost:8080/api/settings", settings)
      .then(() => alert("Settings saved successfully!"))
      .catch(() => alert("Error saving settings."));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({ ...settings, [name]: type === "checkbox" ? checked : value });
  };

  const sections = [
    { key: "account", title: "Account" },
    { key: "notifications", title: "Notifications" },
    { key: "contact", title: "Contact Us" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Account Details</h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={settings.username}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={settings.email}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
            />
          </div>
        );
      case "notifications":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Notification Settings</h3>
            <label className="block mb-1">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={handleChange}
              />{" "}
              Email Alerts
            </label>
            <label className="block mb-1">
              <input
                type="checkbox"
                name="smsAlerts"
                checked={settings.smsAlerts}
                onChange={handleChange}
              />{" "}
              SMS Alerts
            </label>
          </div>
        );
      case "contact":
        return (
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <textarea
              name="message"
              placeholder="Your message"
              value={settings.message}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>
        );
      default:
        return <p className="text-gray-500">Select a setting to view details</p>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 rounded border ${
              activeSection === section.key
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {renderSection()}

      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
