'use client';

import type { Sprint, User, UserStory } from '@/lib/data';
import { UserStoryCard } from './user-story-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';

type KanbanBoardProps = {
  sprint: Sprint;
  team: User[];
};

type Status = 'todo' | 'inprogress' | 'done';
const statuses: Status[] = ['todo', 'inprogress', 'done'];
const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

export function KanbanBoard({ sprint, team }: KanbanBoardProps) {
  const storiesByStatus = useMemo(() => {
    const grouped: Record<Status, UserStory[]> = {
      todo: [],
      inprogress: [],
      done: [],
    };
    sprint.stories.forEach(story => {
      if (grouped[story.status]) {
        grouped[story.status].push(story);
      }
    });
    return grouped;
  }, [sprint.stories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {statuses.map(status => (
        <div key={status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-foreground">{statusLabels[status]}</h2>
            <span className="text-sm font-medium bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5">
              {storiesByStatus[status].length}
            </span>
          </div>
          <div className="flex flex-col gap-4 min-h-[300px] bg-secondary/50 rounded-lg p-4">
            {storiesByStatus[status].length > 0 ? (
                storiesByStatus[status].map(story => (
                <UserStoryCard key={story.id} story={story} team={team} />
                ))
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No stories yet</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
