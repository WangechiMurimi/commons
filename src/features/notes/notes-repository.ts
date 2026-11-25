import { NewNoteSchema } from "./note-schema";
import type { NewNote, Note } from "./note-schema";

export interface NotesRepository {
  /** Newest first. */
  list(): Promise<Note[]>;
  /** Validates with NewNoteSchema; throws ZodError on invalid input. */
  add(input: NewNote): Promise<Note>;
}

export function createInMemoryNotesRepository(
  opts: { seed?: Note[]; now?: () => Date } = {},
): NotesRepository {
  const now = opts.now ?? (() => new Date());
  const notes: Note[] = [...(opts.seed ?? [])];

  return {
    async list() {
      // Stable sort: notes with equal timestamps keep their insertion order (newest inserted first).
      return [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async add(input) {
      const { title } = NewNoteSchema.parse(input);
      const note: Note = {
        id: crypto.randomUUID(),
        title,
        createdAt: now().toISOString(),
      };
      notes.unshift(note);
      return note;
    },
  };
}
