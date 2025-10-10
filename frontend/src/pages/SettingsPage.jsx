import { useState, useEffect } from "react";
import * as SettingsService from "../services/SettingsService";

export default function SettingsPage() {
  const sections = [
    { key: "notifications", title: "Notifications" },
    { key: "privacy", title: "Privacy" },
    { key: "theme", title: "Theme" },
    { key: "security", title: "Security" },
  ];

  const [activeSection, setActiveSection] = useState("notifications");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await SettingsService.getSettings();
      setSettings(data);
      setError("");
    } catch (e) {
      console.error("Failed to load settings:", e);
      setError("Please login to view your settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionKey, sectionData) => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      switch (sectionKey) {
        case "notifications":
          await SettingsService.updateNotificationSettings(sectionData);
          break;
        case "privacy":
          await SettingsService.updatePrivacySettings(sectionData);
          break;
        case "theme":
          await SettingsService.updateThemeSettings(sectionData);
          break;
        case "security":
          await SettingsService.updateSecuritySettings(sectionData);
          break;
        default:
          break;
      }

      // Refresh settings
      await fetchSettings();
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error("Failed to save settings:", e);
      setError(`Failed to save settings: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handleThemeChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const renderSection = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      );
    }

    if (!settings) {
      return <p className="text-gray-500 p-4">Unable to load settings</p>;
    }

    switch (activeSection) {
      case "notifications":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Email Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => handleNotificationChange("emailAlerts", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">SMS Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.smsAlerts}
                  onChange={(e) => handleNotificationChange("smsAlerts", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Project Updates</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.projectUpdates}
                  onChange={(e) => handleNotificationChange("projectUpdates", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Risk Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.riskAlerts}
                  onChange={(e) => handleNotificationChange("riskAlerts", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Task Assignments</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.taskAssignments}
                  onChange={(e) => handleNotificationChange("taskAssignments", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Weekly Digest</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyDigest}
                  onChange={(e) => handleNotificationChange("weeklyDigest", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <button
              onClick={() => handleSaveSection("notifications", settings.notifications)}
              disabled={isSaving}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      case "privacy":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Profile Visible to Others</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.profileVisible}
                  onChange={(e) => handlePrivacyChange("profileVisible", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Searchable in Directory</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.searchVisible}
                  onChange={(e) => handlePrivacyChange("searchVisible", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Show Email Address</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={(e) => handlePrivacyChange("showEmail", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Show Phone Number</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.showPhone}
                  onChange={(e) => handlePrivacyChange("showPhone", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Allow Project Invites</span>
                <input
                  type="checkbox"
                  checked={settings.privacy.allowProjectInvites}
                  onChange={(e) => handlePrivacyChange("allowProjectInvites", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <button
              onClick={() => handleSaveSection("privacy", settings.privacy)}
              disabled={isSaving}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      case "theme":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Dark Mode</span>
                <input
                  type="checkbox"
                  checked={settings.theme.darkMode}
                  onChange={(e) => handleThemeChange("darkMode", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <div className="p-3">
                <label className="block text-gray-700 mb-2">Color Scheme</label>
                <select
                  value={settings.theme.colorScheme}
                  onChange={(e) => handleThemeChange("colorScheme", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
              <div className="p-3">
                <label className="block text-gray-700 mb-2">Font Size</label>
                <select
                  value={settings.theme.fontSize}
                  onChange={(e) => handleThemeChange("fontSize", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Compact View</span>
                <input
                  type="checkbox"
                  checked={settings.theme.compactView}
                  onChange={(e) => handleThemeChange("compactView", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <button
              onClick={() => handleSaveSection("theme", settings.theme)}
              disabled={isSaving}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      case "security":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorEnabled}
                  onChange={(e) => handleSecurityChange("twoFactorEnabled", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Session Timeout</span>
                <input
                  type="checkbox"
                  checked={settings.security.sessionTimeout}
                  onChange={(e) => handleSecurityChange("sessionTimeout", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              {settings.security.sessionTimeout && (
                <div className="p-3">
                  <label className="block text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => handleSecurityChange("sessionTimeoutMinutes", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <span className="text-gray-700">Require Password Change</span>
                <input
                  type="checkbox"
                  checked={settings.security.requirePasswordChange}
                  onChange={(e) => handleSecurityChange("requirePasswordChange", e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              {settings.security.requirePasswordChange && (
                <div className="p-3">
                  <label className="block text-gray-700 mb-2">Password Change Interval (days)</label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.security.passwordChangeIntervalDays}
                    onChange={(e) => handleSecurityChange("passwordChangeIntervalDays", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => handleSaveSection("security", settings.security)}
              disabled={isSaving}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      default:
        return <p className="text-gray-500 p-4">Select a setting to view details</p>;
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{success}</div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === section.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Active section content */}
      {renderSection()}
    </div>
  );
}