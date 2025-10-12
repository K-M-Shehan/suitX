import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import profilePic from "../assets/profile-pic.jpg";

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load user profile');
      }

      const userData = await response.json();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">User not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-blue-600 hover:underline"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-black flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Profile Picture */}
              <div className="-mt-16 mb-4 md:mb-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h1>
                <p className="text-gray-600">@{user.username}</p>
                {user.role && (
                  <p className="text-sm text-gray-500 mt-1">{user.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">{user.email || 'Not provided'}</p>
              </div>
              
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{user.phone}</p>
                </div>
              )}
              
              {user.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-gray-900">{user.department}</p>
                </div>
              )}
              
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Bio</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information</h2>
            <div className="space-y-3">
              {user.memberProjects && user.memberProjects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Projects</label>
                  <p className="mt-1 text-gray-900">
                    Member of {user.memberProjects.length} project{user.memberProjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
              
              {user.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats or Activity could go here in the future */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity</h2>
          <p className="text-gray-500 text-center py-8">Activity information coming soon</p>
        </div>
      </div>
    </div>
  );
}
