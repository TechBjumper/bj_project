
// API service functions for fetching boards and tasks
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export const fetchBoards = async (): Promise<Board[]> => {
  console.log('Fetching boards from /boards endpoint...');
  // For demo purposes, returning mock data
  // Replace with actual API call: const response = await fetch('/boards');
  const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/boards`);
  return response.json();
};

export const fetchTasks = async (): Promise<Task[]> => {
  console.log('Fetching tasks from /tasks endpoint...');
  // For demo purposes, returning mock data
  // Replace with actual API call: const response = await fetch('/tasks');
  const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/tasks`);
  return response.json();
};
