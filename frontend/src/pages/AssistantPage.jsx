import React, { useState, useRef, useEffect } from 'react';
import { assistantService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const AssistantPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      message: 'Hi! I\'m your AI Fitness Coach. I have access to your complete fitness journey data and can provide personalized advice. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Fetch user stats to show AI has context
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [progressRes, habitsRes] = await Promise.all([
          assistantService.getRecentProgress?.(4) || Promise.resolve({ data: [] }),
          assistantService.getHabitScores?.(4) || Promise.resolve({ data: [] })
        ]).catch(() => [{ data: [] }, { data: [] }]);
        
        const progress = progressRes.data || [];
        const habits = habitsRes.data || [];
        
        if (progress.length > 0 || habits.length > 0) {
          const avgWorkout = progress.length > 0 
            ? Math.round(progress.reduce((sum, p) => sum + (p.workout_adherence_percent || 0), 0) / progress.length)
            : 0;
          const avgDiet = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + (p.diet_adherence_percent || 0), 0) / progress.length)
            : 0;
          const currentStreak = habits.length > 0 ? habits[habits.length - 1].streak_count : 0;
          
          setUserStats({
            weeksTracked: progress.length,
            avgWorkout,
            avgDiet,
            currentStreak
          });
        }
      } catch (err) {
        console.log('Could not fetch user stats:', err);
      }
    };
    
    fetchUserStats();
  }, []);

  const handleAsk = async (e) => {
    e?.preventDefault();
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: question,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    
    try {
      const res = await assistantService.askQuestion(question);
      
      // Add bot response to chat
      const botMessage = {
        type: 'bot',
        message: res.data.response,
        steps: res.data.steps,
        tip: res.data.tip,
        data_insights: res.data.data_insights,
        disclaimer: res.data.disclaimer,
        confidence: res.data.confidence,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to get response');
      const errorMessage = {
        type: 'bot',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (q) => {
    setQuestion(q);
  };

  const suggestedQuestions = [
    'How am I doing with my fitness journey?',
    'Why am I not losing weight?',
    'Should I increase my protein intake?',
    'Am I working out too much or too little?',
    'What should I focus on this week?'
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-6 shadow-2xl animate-slide-down">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl animate-bounce-subtle">🤖</span>
              <span>AI Fitness Coach</span>
            </h1>
            <p className="text-cyan-100 text-lg">Get personalized advice based on your real data</p>
            {userStats && (
              <div className="mt-3 text-sm text-cyan-100 flex gap-4 flex-wrap">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">📊 {userStats.weeksTracked} weeks tracked</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">💪 {userStats.avgWorkout}% workout</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">🥗 {userStats.avgDiet}% diet</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">🔥 {userStats.currentStreak} week streak</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-6 py-3 bg-white text-cyan-600 font-bold rounded-xl shadow-lg hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span>Dashboard</span>
              </span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${chat.type === 'user' ? 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white' : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white'} rounded-lg p-4 shadow-lg`}>
                {chat.type === 'bot' && (
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">🤖</span>
                    <span className="font-bold text-sm text-cyan-400">AI Coach</span>
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{chat.message}</p>
                
                {chat.steps && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="font-bold text-sm mb-2 text-cyan-400">📋 Action Steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {chat.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {chat.tip && (
                  <div className="mt-3 bg-cyan-500/20 border border-cyan-500/30 p-2 rounded text-sm">
                    <span className="font-bold text-cyan-400">💡 Tip:</span> {chat.tip}
                  </div>
                )}
                
                {chat.data_insights && (
                  <div className="mt-3 bg-sky-500/20 border border-sky-500/30 p-2 rounded text-sm">
                    <span className="font-bold text-sky-400">📊 Data Insights:</span> {chat.data_insights}
                  </div>
                )}
                
                {chat.disclaimer && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠️ {chat.disclaimer}
                  </p>
                )}
                
                <p className="text-xs opacity-60 mt-2">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        {chatHistory.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2 font-semibold">💬 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-sm px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 rounded-full text-gray-300 hover:text-cyan-400 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleAsk} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your fitness journey..."
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantPage;
