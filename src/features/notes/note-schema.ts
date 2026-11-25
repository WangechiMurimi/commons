import { z } from "zod";

export const NewNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
});

export type NewNote = z.infer<typeof NewNoteSchema>;

export type Note = { id: string; title: string; createdAt: string };
