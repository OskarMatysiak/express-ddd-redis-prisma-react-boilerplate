import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = z.object({
  title: z.string().min(1),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
