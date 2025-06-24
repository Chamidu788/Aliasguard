export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'Scrum Master' | 'Team Member';
};

export type UserStory = {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'done';
  assigneeId?: string;
};

export type Sprint = {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  stories: UserStory[];
};

export type Project = {
  id:string;
  name: string;
  description: string;
  sprints: Sprint[];
  team: User[];
};

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatar: 'https://placehold.co/40x40.png', role: 'Scrum Master' },
  { id: 'user-2', name: 'Bob Williams', avatar: 'https://placehold.co/40x40.png', role: 'Team Member' },
  { id: 'user-3', name: 'Charlie Brown', avatar: 'https://placehold.co/40x40.png', role: 'Team Member' },
  { id: 'user-4', name: 'Diana Miller', avatar: 'https://placehold.co/40x40.png', role: 'Team Member' },
];

export const mockProject: Project = {
  id: 'proj-1',
  name: 'AgileZenFlow Development',
  description: 'Build the core features of the new project management tool.',
  team: mockUsers,
  sprints: [
    {
      id: 'sprint-1',
      name: 'Sprint 1 - Foundation',
      goal: 'Setup project structure, authentication, and the main Kanban board UI. The goal is to establish a solid base for future feature development.',
      startDate: '2024-08-01',
      endDate: '2024-08-14',
      stories: [
        {
          id: 'story-1',
          title: 'Implement User Authentication',
          description: 'Users should be able to sign up and log in using email/password and Google. This is a critical path for the application.',
          acceptanceCriteria: ['Email/password login works', 'Google sign-in works', 'User session is persisted'],
          storyPoints: 5,
          priority: 'high',
          status: 'done',
          assigneeId: 'user-2',
        },
        {
          id: 'story-2',
          title: 'Setup Firestore Database Schema',
          description: 'Define and implement the Firestore collections and data structures for all core entities.',
          acceptanceCriteria: ['Projects collection is defined', 'User stories collection is defined', 'Sprints collection is defined'],
          storyPoints: 3,
          priority: 'high',
          status: 'done',
          assigneeId: 'user-3',
        },
        {
          id: 'story-3',
          title: 'Create Kanban Board UI',
          description: 'Develop the main Kanban board view with columns for story statuses. Cards should be visually appealing and informative.',
          acceptanceCriteria: ['"To Do", "In Progress", "Done" columns are present', 'Stories are displayed as cards', 'Basic styling is applied'],
          storyPoints: 8,
          priority: 'high',
          status: 'inprogress',
          assigneeId: 'user-4',
        },
        {
          id: 'story-4',
          title: 'User Story Creation Form',
          description: 'Allow users to create new user stories through a modal form with all necessary fields.',
          acceptanceCriteria: ['Form includes all necessary fields', 'Form validation is in place', 'New stories are added to the "To Do" column'],
          storyPoints: 5,
          priority: 'medium',
          status: 'inprogress',
          assigneeId: 'user-2',
        },
        {
          id: 'story-5',
          title: 'Design Sprint Burndown Chart',
          description: 'Create a component to display the sprint burndown chart, showing ideal vs. actual progress.',
          acceptanceCriteria: ['Chart displays ideal vs. actual burndown', 'Data is correctly plotted for the sprint timeline'],
          storyPoints: 3,
          priority: 'medium',
          status: 'todo',
        },
        {
          id: 'story-6',
          title: 'Implement Basic Role Management',
          description: 'Add functionality to assign roles (Scrum Master, Team Member) to users to control permissions.',
          acceptanceCriteria: ['Roles can be assigned in user settings', 'UI elements are conditionally rendered based on role'],
          storyPoints: 2,
          priority: 'low',
          status: 'todo',
          assigneeId: 'user-3',
        },
      ],
    },
    {
      id: 'sprint-2',
      name: 'Sprint 2 - Core Features',
      goal: 'Flesh out the core user story and sprint management features.',
      startDate: '2024-08-15',
      endDate: '2024-08-28',
      stories: [],
    }
  ],
};
