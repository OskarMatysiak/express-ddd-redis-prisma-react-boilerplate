export type Task = {
  id: string;
  title: string;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BACKEND_URL}/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to load tasks: ${res.status}`);
  }
  
  return res.json();
}
