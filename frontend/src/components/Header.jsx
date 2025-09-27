import React from 'react';
import { Link } from 'react-router-dom';

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
        <h1 className="text-xl font-bold">suitX</h1>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* Notification icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a3.536 3.536 0 00-5 0L15 17zM15 17H9m6-10V4a3 3 0 00-6 0v3m6 0V4" />
          </svg>
        </button>

        {/* Settings icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Profile icon */}
        <button className="p-2 hover:bg-gray-800 rounded transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;