import React from 'react';
import { Link } from 'react-router-dom';
import notificationIcon from '../assets/header/notification-bell.png';
import settingsIcon from '../assets/header/settings-cog.png';
import profileIcon from '../assets/header/profile.png';

const Header = ({ isLanding = false }) => {
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
        {/* Notification icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <img src={notificationIcon} alt="Notifications" className="w-5 h-5" />
        </button>

        {/* Settings icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <img src={settingsIcon} alt="Settings" className="w-5 h-5" />
        </button>

        {/* Profile icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <img src={profileIcon} alt="Profile" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;