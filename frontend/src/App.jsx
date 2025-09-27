import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDay: "",
    website: ""
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8080/api/profile/";

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      const res = await axios.get(API_URL);
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(API_URL + editingId, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: "", email: "", phone: "", birthDay: "", website: "" });
      setEditingId(null);
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit a profile
  const handleEdit = (profile) => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      birthDay: profile.birthDay,
      website: profile.website
    });
    setEditingId(profile.id);
  };

  // Delete a profile
  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL + id);
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile Manager</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="birthDay"
          placeholder="Birth Day"
          value={formData.birthDay}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Profile" : "Add Profile"}
        </button>
      </form>

      <ul className="space-y-4">
        {profiles.map((profile) => (
          <li
            key={profile.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{profile.name}</p>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.birthDay}</p>
              <p>{profile.website}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(profile)}
                className="bg-yellow-400 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
