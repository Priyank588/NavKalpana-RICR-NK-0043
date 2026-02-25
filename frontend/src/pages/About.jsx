import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">About FitAI</h1>
        <p className="text-gray-700 mb-4">
          FitAI is an adaptive fitness intelligence platform designed to revolutionize personal fitness. 
          Our mission is to make professional-level coaching accessible to everyone by combining AI-powered 
          personalization, real-time adaptation, and intelligent guidance.
        </p>
        <p className="text-gray-700 mb-4">
          Unlike generic workout apps, FitAI creates customized workout and diet plans tailored to your 
          health profile, fitness goals, and lifestyle. The system dynamically adjusts based on your progress, 
          energy levels, and adherence, ensuring that your fitness journey evolves with you.
        </p>
        <p className="text-gray-700 mb-4">
          With features like habit intelligence scoring, drop-off risk detection, and a 24/7 AI fitness coach, 
          FitAI helps you stay motivated, consistent, and informed. Our platform also provides detailed analytics, 
          progress tracking, and educational insights so you understand not just what to do, but why it matters.
        </p>
        <p className="text-gray-700 mb-4">
          Built on a secure, scalable full-stack architecture, FitAI combines modern UI/UX design with 
          advanced algorithms to deliver a seamless experience across devices. Whether you’re a beginner 
          or an advanced athlete, FitAI adapts to your needs and empowers you to achieve sustainable results.
        </p>
        <Link to="/" className="text-violet-600 font-semibold">← Back to Home</Link>
      </div>
    </div>
  );
};

export default About;
