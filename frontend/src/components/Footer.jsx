import React from 'react';
import logoIcon from '../assets/footer/footer-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - suitX branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src={logoIcon} alt="Logo" className="w-5 h-5" />
            <span className="font-medium text-gray-900">suitX</span>
          </div>
          
          <div className="flex space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Learn more</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
          </div>
        </div>

        {/* Right side - Social icons */}
        <div className="flex items-center space-x-3">
          {/* Instagram */}
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.468 14.2c.598.598 1.426.978 2.328.978 1.835 0 3.328-1.493 3.328-3.328s-1.493-3.328-3.328-3.328c-.902 0-1.73.38-2.328.978L4.121 7.009c.88-.807 2.031-1.297 3.328-1.297 2.732 0 4.946 2.214 4.946 4.946s-2.214 4.946-4.946 4.946zm11.032-2.214c0 .299-.244.543-.543.543h-1.63c-.299 0-.543-.244-.543-.543V9.231c0-.299.244-.543.543-.543h1.63c.299 0 .543.244.543.543v5.543z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
