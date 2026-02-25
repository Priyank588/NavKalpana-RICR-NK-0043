import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  if (location.pathname === '/assistant' || 
      location.pathname === '/' || 
      location.pathname === '/login' || 
      location.pathname === '/register') {
    return null;
  }

  const handleClick = () => {
    navigate('/assistant');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center gap-2"
      >
        <span className="text-2xl">🤖</span>
        {isOpen && (
          <span className="font-semibold pr-2 animate-fade-in">
            Ask AI Coach
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
