'use client';

import Image from 'next/image';

interface User {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  image: string;
  level: number;
  campus: string;
  campusCity: string;
  poolYear: string;
  poolMonth: string;
  wallet: number;
  correctionPoints: number;
}

interface ProjectStats {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}

interface StudentProfileProps {
  isVisible: boolean;
  user: User | null;
  projectStats: ProjectStats | null;
}

export default function StudentProfile({ isVisible, user, projectStats }: StudentProfileProps) {
  if (!user) {
    return (
      <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="glassmorphic rounded-2xl p-8">
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-48 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate level progress (level is like 4.21 where .21 is 21% progress to level 5)
  // Calculate level progress (level is like 4.21 where .21 is 21% progress to level 5)
  const level = user.level ?? 0;
  const levelInt = Math.floor(level);
  const levelProgress = Math.round((level - levelInt) * 100);

  // Get initials for fallback
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="glassmorphic rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.displayName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl text-white font-bold">{initials}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{user.displayName}</h2>
                <p className="text-sm text-slate-600 font-light">@{user.login} • {user.campus}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Pool: {user.poolMonth} {user.poolYear} • {user.campusCity}
                </p>
              </div>
            </div>

            {/* Level Display */}
            <div className="text-right">
              <p className="text-sm text-slate-600 font-light mb-1">Level</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-slate-900">{level.toFixed(2)}</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4 pt-6 border-t border-slate-200/50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600">
                {projectStats?.completed ?? '-'}
              </p>
              <p className="text-xs text-slate-600 font-light">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">
                {projectStats?.inProgress ?? '-'}
              </p>
              <p className="text-xs text-slate-600 font-light">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-red-500">
                {projectStats?.failed ?? '-'}
              </p>
              <p className="text-xs text-slate-600 font-light">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-amber-500">{user.wallet}</p>
              <p className="text-xs text-slate-600 font-light">Wallet</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-purple-600">{user.correctionPoints}</p>
              <p className="text-xs text-slate-600 font-light">Eval Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
