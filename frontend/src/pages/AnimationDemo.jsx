import React from 'react';
import { AnimatedCard, StatCard, PulsingBadge, FloatingButton, ProgressBar, LoadingSpinner } from '../components/AnimatedCard';

export const AnimationDemo = () => {
  return (
    <div className="page-container bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-6xl font-bold gradient-text mb-4 animate-float">
            🎨 Animation Showcase
          </h1>
          <p className="text-xl text-gray-600">Interactive animations and effects</p>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Animated Stat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon="🎯" title="Habit Score" value="85" subtitle="out of 100" color="blue" delay={0} />
            <StatCard icon="💪" title="Workouts" value="24" subtitle="this month" color="green" delay={0.1} />
            <StatCard icon="🔥" title="Streak" value="12" subtitle="days" color="orange" delay={0.2} />
            <StatCard icon="⭐" title="Level" value="Pro" subtitle="advanced" color="purple" delay={0.3} />
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Card Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCard delay={0} className="hover-lift">
              <div className="text-5xl mb-4 animate-bounce-subtle">🚀</div>
              <h3 className="text-xl font-bold mb-2">Bounce Effect</h3>
              <p className="text-gray-600">Subtle bouncing animation</p>
            </AnimatedCard>
            
            <AnimatedCard delay={0.1} className="hover-glow">
              <div className="text-5xl mb-4 animate-float">✨</div>
              <h3 className="text-xl font-bold mb-2">Float Effect</h3>
              <p className="text-gray-600">Smooth floating motion</p>
            </AnimatedCard>
            
            <AnimatedCard delay={0.2} className="hover-rotate">
              <div className="text-5xl mb-4 animate-wiggle">🎪</div>
              <h3 className="text-xl font-bold mb-2">Wiggle Effect</h3>
              <p className="text-gray-600">Playful wiggle animation</p>
            </AnimatedCard>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pulsing Badges</h2>
          <div className="flex flex-wrap gap-4">
            <PulsingBadge color="blue">🔵 Active</PulsingBadge>
            <PulsingBadge color="green">✅ Completed</PulsingBadge>
            <PulsingBadge color="red">🔴 Alert</PulsingBadge>
            <PulsingBadge color="yellow">⚠️ Warning</PulsingBadge>
            <PulsingBadge color="purple">⭐ Premium</PulsingBadge>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Interactive Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <FloatingButton className="btn-primary">
              🚀 Launch
            </FloatingButton>
            <FloatingButton className="btn-success">
              ✅ Confirm
            </FloatingButton>
            <FloatingButton className="btn-danger">
              ❌ Delete
            </FloatingButton>
            <FloatingButton className="btn-secondary">
              💜 Favorite
            </FloatingButton>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Animated Progress Bars</h2>
          <div className="space-y-6 card p-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Workout Progress</span>
                <span className="text-gray-600">75%</span>
              </div>
              <ProgressBar value={75} color="blue" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Diet Adherence</span>
                <span className="text-gray-600">90%</span>
              </div>
              <ProgressBar value={90} color="green" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Recovery</span>
                <span className="text-gray-600">60%</span>
              </div>
              <ProgressBar value={60} color="purple" />
            </div>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Loading Spinners</h2>
          <div className="card p-8 flex justify-around items-center">
            <div className="text-center">
              <LoadingSpinner size="sm" color="blue" />
              <p className="mt-2 text-sm text-gray-600">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" color="green" />
              <p className="mt-2 text-sm text-gray-600">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" color="purple" />
              <p className="mt-2 text-sm text-gray-600">Large</p>
            </div>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Gradient Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Shifting Gradient</h3>
              <p>Smooth color transitions</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-gradient p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Dynamic Colors</h3>
              <p>Animated background</p>
            </div>
          </div>
        </div>

        {}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Staggered Animations</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`card p-6 text-center animate-scale-in stagger-${num}`}
              >
                <div className="text-4xl mb-2 animate-heartbeat">❤️</div>
                <p className="font-bold">Item {num}</p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Hover Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-8 text-center hover-lift interactive">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold">Lift on Hover</h3>
            </div>
            
            <div className="card p-8 text-center hover-glow interactive">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold">Glow on Hover</h3>
            </div>
            
            <div className="card p-8 text-center hover-rotate interactive">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold">Rotate on Hover</h3>
            </div>
          </div>
        </div>

        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Skeleton Loading</h2>
          <div className="card p-8 space-y-4">
            <div className="skeleton h-8 rounded-lg"></div>
            <div className="skeleton h-8 rounded-lg w-3/4"></div>
            <div className="skeleton h-8 rounded-lg w-1/2"></div>
          </div>
        </div>

        
        <div className="text-center">
          <div className="inline-block card p-12 success-animation">
            <div className="text-8xl mb-4 animate-bounce-subtle">🎉</div>
            <h2 className="text-3xl font-bold gradient-text">All Animations Loaded!</h2>
            <p className="text-gray-600 mt-2">Explore and enjoy the interactive effects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;
