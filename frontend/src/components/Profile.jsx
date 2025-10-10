import React, { useState, useEffect } from "react";
import axios from "axios";
import profilePic from "../assets/profile-pic.jpg";

export default function Profile({ profileId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    axios.get(`http://localhost:8080/api/profile/${profileId}`)
      .then(res => setProfile(res.data))
      .catch(err => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [profileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    axios.put(`http://localhost:8080/api/profile/${profileId}`, profile)
      .then(res => console.log("Saved", res.data))
      .catch(err => console.log(err));
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <img
          src={profile.imageUrl || profilePic}
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
          {["username","email","phone","address","gender","birthday"].map(field => (
            <div key={field}>
              <label className="capitalize">{field}</label>
              <input
                type={field==="email"?"email":field==="birthday"?"date":"text"}
                name={field}
                value={profile[field]||""}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
          ))}
          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio||""}
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
