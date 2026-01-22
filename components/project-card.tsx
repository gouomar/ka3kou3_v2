'use client';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'failed' | 'upcoming';
  difficulty: number;
  progress?: number;
  skills: string[];
  finalMark?: number | null;
}

interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
  onClick?: () => void;
}

export default function ProjectCard({ project, isHovered, onClick }: ProjectCardProps) {
  const statusConfig = {
    completed: { color: 'bg-teal-50 text-teal-700 border border-teal-200/50', icon: '✓', label: 'Completed' },
    'in-progress': { color: 'bg-sky-50 text-sky-700 border border-sky-200/50', icon: '◐', label: 'In Progress' },
    failed: { color: 'bg-red-50 text-red-600 border border-red-200/50', icon: '✗', label: 'Failed' },
    upcoming: { color: 'bg-white/50 text-slate-400 border border-slate-200/50', icon: '○', label: 'Upcoming' },
  };

  const difficultyStars = Array.from({ length: 5 }).map((_, i) => i < project.difficulty);
  const config = statusConfig[project.status];

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 cursor-pointer group h-full flex flex-col ${
        isHovered ? '-translate-y-1' : ''
      }`}
    >
      {/* Header with status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500 font-light mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${config.color}`}>
            <span>{config.icon}</span>
            <span className="text-xs">{config.label}</span>
          </div>
          {(project.status === 'completed' || project.status === 'failed') && project.finalMark !== undefined && project.finalMark !== null && (
            <span className={`text-sm font-semibold ${project.status === 'completed' ? 'text-teal-600' : 'text-red-500'}`}>
              {project.finalMark}%
            </span>
          )}
        </div>
      </div>

      {/* Progress bar for in-progress projects */}
      {project.status === 'in-progress' && project.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-light">Progress</p>
            <p className="text-sm font-medium text-slate-700">{project.progress}%</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{
                width: `${project.progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Difficulty */}
      <div className="mb-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-light">Difficulty</span>
          <div className="flex gap-1">
            {difficultyStars.map((filled, i) => {
              // Color based on difficulty: 1-2 green, 3 orange, 4-5 red
              const getDifficultyColor = () => {
                if (!filled) return 'bg-slate-200';
                if (project.difficulty <= 2) return 'bg-green-500';
                if (project.difficulty === 3) return 'bg-orange-400';
                return 'bg-red-500';
              };
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${getDifficultyColor()}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex-grow">
        <p className="text-xs text-slate-500 font-light mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {project.skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className="inline-block px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100"
            >
              {skill}
            </span>
          ))}
          {project.skills.length > 4 && (
            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-50 text-slate-400 text-xs">
              +{project.skills.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
