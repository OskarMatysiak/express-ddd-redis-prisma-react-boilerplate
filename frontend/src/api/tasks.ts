export type Task = {
  id: string;
  title: string;
};

export async function getTasks(): Promise<Task[]> {
  const res = await fetch('/tasks');
  if (!res.ok) {
    throw new Error(`Failed to load tasks: ${res.status}`);
  }
  return res.json();
}
