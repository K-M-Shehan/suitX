// src/pages/ProfilePage.jsx
import React from "react";
import Profile from "../components/Profile";

export default function ProfilePage() {
  const user = {
    username: "John Doe",
    email: "john@example.com",
    bio: "This is my bio",
    phone: "123-456-7890",
    address: "123 Main St, City",
    gender: "Male",
    birthday: "1990-01-01",
  };

  return <Profile user={user} />;
}