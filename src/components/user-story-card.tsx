import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { UserStory, User } from "@/lib/data";
import { ArrowDown, ArrowUp, Minus, GripVertical } from "lucide-react";
import { UserStoryDialog } from "./user-story-dialog";

type UserStoryCardProps = {
  story: UserStory;
  team: User[];
};

const priorityIcons: Record<UserStory['priority'], React.ReactNode> = {
  low: <ArrowDown className="h-4 w-4 text-muted-foreground" />,
  medium: <Minus className="h-4 w-4 text-muted-foreground" />,
  high: <ArrowUp className="h-4 w-4 text-muted-foreground" />,
};

export function UserStoryCard({ story, team }: UserStoryCardProps) {
  const assignee = team.find(user => user.id === story.assigneeId);

  return (
    <UserStoryDialog story={story} team={team}>
      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer bg-card group">
        <CardHeader className="p-4 flex flex-row items-start justify-between">
          <CardTitle className="text-base font-semibold leading-tight pr-4">{story.title}</CardTitle>
          <GripVertical className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 cursor-grab group-hover:text-muted-foreground transition-colors" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {priorityIcons[story.priority]}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{story.priority.charAt(0).toUpperCase() + story.priority.slice(1)} Priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge variant="outline" className="px-2 py-0.5 font-mono text-xs">{story.storyPoints} pts</Badge>
          </div>
          {assignee && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage data-ai-hint="avatar portrait" src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </UserStoryDialog>
  );
}
