'use client';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  difficulty: number;
  progress?: number;
  skills: string[];
}

interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
}

export default function ProjectCard({ project, isHovered }: ProjectCardProps) {
  const statusConfig = {
    completed: { color: 'bg-emerald-100 text-emerald-700', icon: '✓', label: 'Completed' },
    'in-progress': { color: 'bg-blue-100 text-blue-700', icon: '⟳', label: 'In Progress' },
    upcoming: { color: 'bg-slate-200 text-slate-700', icon: '→', label: 'Upcoming' },
  };

  const difficultyStars = Array.from({ length: 5 }).map((_, i) => i < project.difficulty);
  const config = statusConfig[project.status];

  return (
    <div
      className={`glassmorphic rounded-2xl p-6 transition-all duration-500 cursor-pointer group h-full flex flex-col ${
        isHovered ? 'shadow-2xl -translate-y-2 bg-white/95' : 'shadow-lg'
      }`}
    >
      {/* Header with status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-600 font-light mt-1">
            {project.description}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 flex-shrink-0 ml-2 ${config.color}`}>
          <span>{config.icon}</span>
          <span className="text-xs">{config.label}</span>
        </div>
      </div>

      {/* Progress bar for in-progress projects */}
      {project.status === 'in-progress' && project.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600 font-light">Progress</p>
            <p className="text-sm font-semibold text-slate-900">{project.progress}%</p>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
              style={{
                width: isHovered ? `${project.progress}%` : `${project.progress * 0.7}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Difficulty */}
      <div className="mb-4 pb-4 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-light">Difficulty</span>
          <div className="flex gap-1">
            {difficultyStars.map((filled, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  filled
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : 'bg-slate-200'
                } ${isHovered && filled ? 'scale-125' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex-grow">
        <p className="text-xs text-slate-600 font-light mb-2">Skills</p>
        <div className="flex flex-wrap gap-2">
          {project.skills.map(skill => (
            <span
              key={skill}
              className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
      >
        View Details →
      </button>
    </div>
  );
}
