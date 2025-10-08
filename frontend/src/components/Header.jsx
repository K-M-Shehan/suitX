import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationIcon from '../assets/header/notifications.png';
import settingsIcon from '../assets/header/settings-cog.png';
import profileIcon from '../assets/header/profile.png';

const Header = ({ isLanding = false }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    // Close dropdown
    setIsProfileDropdownOpen(false);
    // Navigate to landing page
    navigate('/');
  };

  const handleProfile = () => {
    // Close dropdown for now (no functionality implemented)
    setIsProfileDropdownOpen(false);
  };
  if (isLanding) {
    return (
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-4xl font-bold">suitX</h1>
          </Link>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-6">

          {/* Auth buttons */}
          <Link to="/signup">
            <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors text-sm font-medium">
              Get started
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors text-sm">
              Sign in
            </button>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-4xl font-bold">suitX</h1>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* Notification icon with badge */}
        <Link to="/notifications" className="relative p-2 hover:bg-gray-800 rounded transition-colors">
          <img src={notificationIcon} alt="Notifications" className="w-5 h-5" />
          {/* Unread badge - you can replace this with actual unread count from backend */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>

        {/* Settings icon */}
        <Link to="/settings" className="p-2 hover:bg-gray-800 rounded transition-colors">
          <img src={settingsIcon} alt="Settings" className="w-5 h-5" />
        </Link>

        {/* Profile icon with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <img src={profileIcon} alt="Profile" className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                to="/profile"
                onClick={() => setIsProfileDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
