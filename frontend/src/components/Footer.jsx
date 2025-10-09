import React from 'react';
import logoIcon from '../assets/footer/footer-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - suitX branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* <img src={logoIcon} alt="Logo" className="w-5 h-5" /> */}
            <span className="font-medium text-gray-900">suitX</span>
          </div>
        </div>

        {/* Right side - Copyright */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">© 2025 suitX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
