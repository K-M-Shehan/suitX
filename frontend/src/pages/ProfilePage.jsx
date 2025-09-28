// frontend/src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";

function ProfilePage() {
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    // Example: fetch user data from localStorage (replace with backend API if available)
    const username = localStorage.getItem("username") || "John Doe";
    const email = localStorage.getItem("email") || "john@example.com";
    setUser({ username, email });
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-md">
        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
