'use client';

import { getAuthUrl } from '@/lib/auth';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Sign in with 42
        </button>
      </div>
    </div>
  );
}
