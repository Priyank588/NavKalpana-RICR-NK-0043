import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <span className="text-2xl font-bold">FitAI</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600 text-center md:text-left">
            <span>© {new Date().getFullYear()} FitAI. All rights reserved.</span>
          </div>

          <nav className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link to="/privacy" className="text-gray-600 hover:text-violet-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-violet-600 transition-colors">Terms</Link>
            <Link to="/contact" className="text-gray-600 hover:text-violet-600 transition-colors">Contact</Link>
            <Link to="/about" className="text-gray-600 hover:text-violet-600 transition-colors">About</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
