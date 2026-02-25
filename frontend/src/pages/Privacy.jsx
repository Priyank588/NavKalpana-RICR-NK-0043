import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          At FitAI, we value your trust and are committed to protecting your personal information. 
          All data you provide, including health metrics, workout history, and dietary preferences, 
          is securely stored in our database using industry-standard encryption. Passwords are hashed 
          with bcrypt, and authentication is managed through secure JWT tokens. We never store plain-text 
          credentials or share sensitive information with unauthorized parties.
        </p>
        <p className="text-gray-700 mb-4">
          Your fitness data is used solely to generate personalized workout and diet plans, track progress, 
          and provide AI-powered coaching. We do not sell or rent your information to third parties. 
          Limited anonymized data may be used for analytics to improve our services, but it will never 
          identify you personally.
        </p>
        <p className="text-gray-700 mb-4">
          You remain in control of your data. You can update or delete your profile information at any time 
          through the app. If you choose to delete your account, all associated data will be permanently 
          removed from our systems. We also enforce strict CORS policies and environment variable protection 
          to safeguard backend operations.
        </p>
        <p className="text-gray-700 mb-4">
          By using FitAI, you consent to the collection and use of your information as outlined in this policy. 
          We may update this Privacy Policy periodically, and any changes will be communicated clearly within 
          the application.
        </p>
        <Link to="/" className="text-violet-600 font-semibold">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Privacy;
