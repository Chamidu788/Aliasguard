import type { Project } from '@/lib/data';
import { UserStoryDialog } from './user-story-dialog';

type ProjectHeaderProps = {
  project: Project;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <svg
          className="h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">AgileZenFlow</h1>
      </div>
      <div className="flex items-center gap-4">
        <UserStoryDialog team={project.team} />
      </div>
    </div>
  );
}
