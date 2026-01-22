'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        
        {/* 1337 Logo */}
        <div className={`mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <svg width="180" height="48" viewBox="0 0 76 20" fill="none">
            <path d="M2.8333 17.6623H5.92418V2.33766H2.31816V5.45455H0V1.49012e-07H8.75748V17.6623H11.8484V20H2.8333V17.6623Z" fill="#1a1a1a"/>
            <path d="M21.3785 17.6623H30.6512V10.9091H22.1513V8.57143H30.6512V2.33766H21.3785V0H33.4845V20H21.3785V17.6623Z" fill="#1a1a1a"/>
            <path d="M42.2419 17.6623H51.5146V10.9091H43.0147V8.57143H51.5146V2.33766H42.2419V0H54.3479V20H42.2419V17.6623Z" fill="#1a1a1a"/>
            <path d="M72.6355 2.33766H64.9084V7.27273H62.5902V0H75.2113V20H72.6355V2.33766Z" fill="#1a1a1a"/>
          </svg>
        </div>

        {/* Tagline */}
        <div className={`mb-12 transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#a67c52] text-xs tracking-[0.3em] uppercase font-medium">
            Coding School
          </p>
        </div>

        {/* Main title */}
        <div className={`text-center mb-6 transition-all duration-700 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight">
            Mastery Roadmap
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`max-w-md text-center mb-12 transition-all duration-700 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-[#8b8b8b] text-base font-light leading-relaxed">
            Navigate your Common Core journey with clarity and focus.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className={`mb-8 px-5 py-3 bg-red-50 border border-red-200 rounded-lg transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-red-600 text-sm">
              {error === 'no_code' && 'Authorization code missing'}
              {error === 'auth_failed' && 'Authentication failed. Please try again.'}
              {error === 'access_denied' && 'Access was denied'}
              {!['no_code', 'auth_failed', 'access_denied'].includes(error) && `Error: ${error}`}
            </p>
          </div>
        )}

        {/* Login Button */}
        <div className={`transition-all duration-700 ease-out delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="group px-10 py-4 bg-[#1a1a1a] text-white rounded-full font-medium text-sm tracking-wide hover:bg-[#333] transition-all duration-300 ease-out hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center">
                Sign in with 42
                <svg className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-8 text-center transition-all duration-700 ease-out delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[#c4c4c4] text-xs tracking-wide">
          Built for 1337 students
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
