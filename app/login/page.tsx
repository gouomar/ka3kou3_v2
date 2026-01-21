'use client';

import { getAuthUrl } from '@/lib/auth';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error === 'no_code' && 'Authorization code missing'}
            {error === 'auth_failed' && 'Authentication failed. Please try again.'}
            {error === 'access_denied' && 'Access was denied'}
            {!['no_code', 'auth_failed', 'access_denied'].includes(error) && 
              `Error: ${error}`}
          </div>
        )}
        
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with 42
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
