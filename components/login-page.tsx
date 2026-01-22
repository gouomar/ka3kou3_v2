'use client';

import { useEffect, useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = '/login';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Simple gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />

      {/* Main content */}
      <div className="relative z-10 h-screen w-full flex flex-col items-center justify-center px-4">

        {/* 1337 Logo */}
        <div className={`mb-10 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="200" height="53" viewBox="0 0 76 20" fill="none">
            <path d="M2.8333 17.6623H5.92418V2.33766H2.31816V5.45455H0V1.49012e-07H8.75748V17.6623H11.8484V20H2.8333V17.6623Z" fill="white"/>
            <path d="M21.3785 17.6623H30.6512V10.9091H22.1513V8.57143H30.6512V2.33766H21.3785V0H33.4845V20H21.3785V17.6623Z" fill="white"/>
            <path d="M42.2419 17.6623H51.5146V10.9091H43.0147V8.57143H51.5146V2.33766H42.2419V0H54.3479V20H42.2419V17.6623Z" fill="white"/>
            <path d="M72.6355 2.33766H64.9084V7.27273H62.5902V0H75.2113V20H72.6355V2.33766Z" fill="white"/>
          </svg>
        </div>

        {/* Main title */}
        <div className={`text-center mb-4 transition-opacity duration-500 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
            Your <span className="font-medium text-teal-400">cursus</span>, visualized
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`max-w-sm text-center mb-10 transition-opacity duration-500 delay-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-slate-500 text-sm">
            See where you are. No spreadsheets needed.
          </p>
        </div>

        {/* Login Button */}
        <div className={`transition-opacity duration-500 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="px-8 py-3 bg-white text-slate-900 font-medium rounded-md hover:bg-teal-400 transition-colors duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Sign in with 42 →'}
          </button>
        </div>

        {/* Footer info */}
        <div className={`absolute bottom-6 left-0 right-0 text-center transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-slate-600 text-xs">
            Built by students, for students
          </p>
        </div>
      </div>


    </div>
  );
}
