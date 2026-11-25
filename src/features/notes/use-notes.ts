import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import type { NewNote } from "./note-schema";
import type { NotesRepository } from "./notes-repository";

export const NotesRepositoryContext = createContext<NotesRepository | null>(
  null,
);

function useNotesRepository(): NotesRepository {
  const repository = useContext(NotesRepositoryContext);
  if (!repository)
    throw new Error("useNotes must be used inside <AppProviders>");
  return repository;
}

export function useNotes() {
  const repository = useNotesRepository();
  return useQuery({ queryKey: ["notes"], queryFn: () => repository.list() });
}

export function useAddNote() {
  const repository = useNotesRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewNote) => repository.add(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
