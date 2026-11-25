import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/lib/use-page-title";
import { NewNoteSchema } from "./note-schema";
import { useAddNote, useNotes } from "./use-notes";

export function NotesPage() {
  usePageTitle("Notes");
  const notes = useNotes();
  const addNote = useAddNote();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = NewNoteSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid title");
      return;
    }
    setError(null);
    addNote.mutate(parsed.data, { onSuccess: () => setTitle("") });
  }

  const formError =
    error ??
    (addNote.isError ? "Could not save your note. Please try again." : null);

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <Label htmlFor="note-title">Title</Label>
        <div className="flex gap-2">
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={formError !== null}
            aria-describedby={formError ? "note-title-error" : undefined}
          />
          <Button type="submit" disabled={addNote.isPending}>
            Add note
          </Button>
        </div>
        {formError && (
          <p
            id="note-title-error"
            role="alert"
            className="text-destructive text-sm"
          >
            {formError}
          </p>
        )}
      </form>
      {notes.isPending && <p>Loading notes…</p>}
      {notes.isError && (
        <p role="alert" className="text-destructive text-sm">
          Could not load your notes. Please refresh the page.
        </p>
      )}
      {notes.data?.length === 0 && <p>No notes yet.</p>}
      {notes.data && notes.data.length > 0 && (
        <ul role="list" className="space-y-2">
          {notes.data.map((note) => (
            <li key={note.id}>{note.title}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
