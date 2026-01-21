'use client';

import { useState } from 'react';
import LoginPage from '@/components/login-page';
import DashboardPage from '@/components/dashboard-page';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden">
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <DashboardPage onLogout={() => setIsLoggedIn(false)} />
      )}
    </main>
  );
}
