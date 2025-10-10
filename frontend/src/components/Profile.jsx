// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import { updateCurrentUser } from "../services/UserService";
import profilePic from "../assets/profile-pic.jpg";

export default function Profile({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    department: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        department: user.department || "",
        avatar: user.avatar || profilePic,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts editing
    setError(null);
    setSuccessMessage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server and get back a URL
      // For now, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: imageUrl }));
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Create update object with only editable fields
      const updateData = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        phone: profile.phone,
        department: profile.department,
        avatar: profile.avatar !== profilePic ? profile.avatar : user.avatar,
      };

      await updateCurrentUser(updateData);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      
      // Refresh the profile data
      if (onUpdate) {
        setTimeout(() => onUpdate(), 1000);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        phone: user.phone || "",
        department: user.department || "",
        avatar: user.avatar || profilePic,
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        {/* Profile Image */}
        <div className="text-center mb-4">
          <img
            src={profile.avatar || profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-2 border-gray-300"
            onError={(e) => {
              e.target.src = profilePic;
            }}
          />

          {isEditing && (
            <div className="mb-4">
              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm inline-block">
                Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">
          {profile.firstName || profile.lastName 
            ? `${profile.firstName} ${profile.lastName}`.trim() 
            : profile.username}
        </h2>
        
        {user?.role && (
          <p className="text-sm text-gray-500 text-center mb-4">
            Role: <span className="font-medium">{user.role}</span>
          </p>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              disabled={true}
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              title="Username cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={profile.department}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
