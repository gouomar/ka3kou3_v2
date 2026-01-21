'use client';

import { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      onLogin();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full filter blur-3xl floating opacity-60" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full filter blur-3xl floating opacity-60" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 rounded-full filter blur-3xl floating opacity-40" style={{ animationDelay: '4s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen w-full flex flex-col items-center justify-center px-4">
        {/* Logo/Title with animation */}
        <div className="mb-12 smooth-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-6">
            <div className="inline-block">
              <div className="text-6xl font-light text-white mb-2 tracking-tight">
                Common<span className="font-semibold">Core</span>
              </div>
              <p className="text-lg text-gray-300 font-light tracking-wide">Learning Roadmap</p>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="smooth-fade-in mb-12 max-w-md text-center" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-400 text-base leading-relaxed font-light">
            Navigate your educational journey through visual project pathways and track your progress seamlessly.
          </p>
        </div>

        {/* Login Button */}
        <div className="smooth-slide-up" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="relative px-12 py-4 rounded-full font-semibold text-base transition-all duration-500 overflow-hidden group"
          >
            {/* Button background with glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-100 group-hover:opacity-110 transition-opacity" />

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Text */}
            <span className="relative flex items-center justify-center text-white">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entering...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <span className="ml-2">→</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
    </div>
  );
}
