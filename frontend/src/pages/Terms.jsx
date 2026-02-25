import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        
        <p className="text-gray-700 mb-4">
          Welcome to FitAI. By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. 
          Please read them carefully before using the application.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Use of Service</h2>
        <p className="text-gray-700 mb-4">
          FitAI provides personalized fitness and diet plans powered by AI. You agree to use the service only for lawful purposes 
          and in accordance with these terms. You must be at least 16 years old to create an account.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
        <p className="text-gray-700 mb-4">
          You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account 
          is your responsibility. FitAI reserves the right to suspend or terminate accounts that violate these terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">3. Data & Privacy</h2>
        <p className="text-gray-700 mb-4">
          Your health and fitness data is used solely to generate personalized plans and track progress. We do not sell or share 
          personal information with third parties. Please refer to our Privacy Policy for more details.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Health Disclaimer</h2>
        <p className="text-gray-700 mb-4">
          FitAI is not a substitute for professional medical advice. Always consult with a healthcare provider before starting 
          any fitness or diet program. Use of the platform is at your own risk.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content, algorithms, and designs within FitAI are the property of the FitAI team. You may not copy, distribute, 
          or modify any part of the platform without prior written consent.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          FitAI is provided “as is” without warranties of any kind. We are not liable for any damages resulting from the use 
          or inability to use the platform, including but not limited to health outcomes, data loss, or service interruptions.
        </p>

        <h2 className="text-xl font-semibold mb-2">7. Updates to Terms</h2>
        <p className="text-gray-700 mb-4">
          We may update these Terms of Service from time to time. Any changes will be communicated within the application. 
          Continued use of FitAI after updates constitutes acceptance of the revised terms.
        </p>

        <p className="text-gray-700 mb-6">
          By using FitAI, you acknowledge that you have read, understood, and agreed to these Terms of Service.
        </p>

        <Link to="/" className="text-violet-600 font-semibold">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Terms;
