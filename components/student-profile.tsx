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
      <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="glass-card rounded-2xl p-6">
            <div className="animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-200 rounded" />
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
    <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center shadow-md">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.displayName}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl text-white font-semibold">{initials}</span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{user.displayName}</h2>
                <p className="text-sm text-slate-500 font-light">@{user.login} • {user.campus}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pool: {user.poolMonth} {user.poolYear}
                </p>
              </div>
            </div>

            {/* Level Display */}
            <div className="text-right">
              <p className="text-xs text-slate-500 font-light mb-1">Level</p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-slate-800">{level.toFixed(2)}</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-xl font-semibold text-teal-600">
                {projectStats?.completed ?? '-'}
              </p>
              <p className="text-xs text-slate-500 font-light">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-sky-600">
                {projectStats?.inProgress ?? '-'}
              </p>
              <p className="text-xs text-slate-500 font-light">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-400">
                {projectStats?.failed ?? '-'}
              </p>
              <p className="text-xs text-slate-500 font-light">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-700">{user.wallet}</p>
              <p className="text-xs text-slate-500 font-light">Wallet</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-700">{user.correctionPoints}</p>
              <p className="text-xs text-slate-500 font-light">Eval Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
