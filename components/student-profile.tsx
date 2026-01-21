'use client';

interface StudentProfileProps {
  isVisible: boolean;
}

export default function StudentProfile({ isVisible }: StudentProfileProps) {
  return (
    <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="glassmorphic rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white font-bold">AJ</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Ahmed Jidane</h2>
                <p className="text-sm text-slate-600 font-light">Student at 1337 (42 Network)</p>
                <p className="text-xs text-slate-500 mt-1">Campus: Paris</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-600 font-light mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-slate-900">42%</span>
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-2/5 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-slate-900">12</p>
              <p className="text-xs text-slate-600 font-light">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">5</p>
              <p className="text-xs text-slate-600 font-light">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-slate-400">8</p>
              <p className="text-xs text-slate-600 font-light">Upcoming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
