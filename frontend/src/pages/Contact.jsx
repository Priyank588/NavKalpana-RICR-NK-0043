import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          We’d love to hear from you! Whether you have questions, feedback, or partnership inquiries, 
          you can reach out to us through the following channels:
        </p>

        <ul className="text-gray-700 mb-6 space-y-2">
          <li>
            📧 Email: <a href="mailto:support@fitai.example" className="text-violet-600 font-semibold">support@fitai.example</a>
          </li>
          <li>
            🌐 Website: <a href="https://fitai.example" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold">https://fitai.example</a>
          </li>
          <li>
            📱 Twitter: <a href="https://twitter.com/fitai" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold">@FitAI</a>
          </li>
          <li>
            📘 Facebook: <a href="https://facebook.com/fitai" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold">facebook.com/FitAI</a>
          </li>
          <li>
            📸 Instagram: <a href="https://instagram.com/fitai" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold">@fitai</a>
          </li>
          <li>
            💼 LinkedIn: <a href="https://linkedin.com/company/fitai" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold">linkedin.com/company/fitai</a>
          </li>
        </ul>

        <p className="text-gray-700 mb-6">
          Our support team is available 24/7 to assist you with any issues or questions. 
          You can also follow us on social media to stay updated on new features, fitness tips, and community events.
        </p>

        <Link to="/" className="text-violet-600 font-semibold">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Contact;
