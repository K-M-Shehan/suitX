import { useState } from "react";
import * as SettingsService from "../services/SettingsService";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      await SettingsService.changePassword({
        currentPassword,
        newPassword
      });

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error("Failed to change password:", e);
      setError(e.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account security</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{success}</div>
      )}

      {/* Password Change Form */}
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter current password"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
              disabled={isSaving}
            />
            <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
              disabled={isSaving}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}