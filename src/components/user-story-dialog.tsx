'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User, UserStory } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type UserStoryDialogProps = {
  story?: UserStory;
  team: User[];
  children?: React.ReactNode;
};

export function UserStoryDialog({ story, team, children }: UserStoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would trigger a server action or API call.
    // We'll simulate it here.
    toast({
      title: `Story ${story ? 'Updated' : 'Created'}`,
      description: `The user story has been saved successfully.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Story
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{story ? 'Edit User Story' : 'Create User Story'}</DialogTitle>
            <DialogDescription>
              {story ? 'Make changes to your user story.' : 'Add a new user story to your project.'} Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" defaultValue={story?.title} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea id="description" defaultValue={story?.description} className="col-span-3" rows={3}/>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="acceptance-criteria" className="text-right pt-2">
                Acceptance Criteria
              </Label>
              <Textarea id="acceptance-criteria" defaultValue={story?.acceptanceCriteria.join('\n')} className="col-span-3" placeholder="One criterion per line" rows={4}/>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="story-points" className="text-right">Story Points</Label>
                    <Input id="story-points" type="number" defaultValue={story?.storyPoints} placeholder="e.g. 3" />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">Priority</Label>
                    <Select defaultValue={story?.priority} required>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                     <Label htmlFor="assignee" className="text-right">Assignee</Label>
                    <Select defaultValue={story?.assigneeId}>
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {team.map(user => (
                          <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select defaultValue={story?.status ?? 'todo'} required>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
