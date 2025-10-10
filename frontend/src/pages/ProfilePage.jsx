import React from "react";
import Profile from "../components/Profile";

export default function ProfilePage() {
  const profileId = "YOUR_REAL_PROFILE_ID"; // Use a valid ID from MongoDB Atlas
  return <Profile profileId={profileId} />;
}
