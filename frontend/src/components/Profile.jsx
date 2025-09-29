// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import profilePic from "../assets/profile-pic.jpg";

export default function Profile({ user }) {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    phone: "",
    address: "",
    gender: "",
    birthday: "",
    image: profilePic,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "This is my bio",
        phone: user.phone || "123-456-7890",
        address: user.address || "123 Main St, City",
        gender: user.gender || "Male",
        birthday: user.birthday || "1990-01-01",
        image: profilePic,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", profile);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        {/* Profile Image */}
        <img
          src={profile.image}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-2 border-gray-300"
        />

        {isEditing && (
          <div className="mb-4">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <div className="space-y-4 text-left">
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
