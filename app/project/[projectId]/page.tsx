import ArchitectureVisualizer from '@/components/architecture-visualizer';
import { projectArchitectures } from '@/lib/project-architectures';
import { notFound } from 'next/navigation';

interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const architecture = projectArchitectures[params.projectId];
  if (!architecture) return { title: 'Project Not Found' };

  return {
    title: `${architecture.project_title} - Architecture`,
    description: architecture.project_overview,
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const architecture = projectArchitectures[params.projectId];

  if (!architecture) {
    notFound();
  }

  return <ArchitectureVisualizer projectId={params.projectId} architectureData={architecture} />;
}
