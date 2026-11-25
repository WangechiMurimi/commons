import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { NotesRepositoryContext } from "@/features/notes/use-notes";
import { createInMemoryNotesRepository } from "@/features/notes/notes-repository";
import type { NotesRepository } from "@/features/notes/notes-repository";

export function AppProviders({
  children,
  notesRepository,
  queryClient,
}: {
  children: ReactNode;
  notesRepository?: NotesRepository;
  queryClient?: QueryClient;
}) {
  const [defaultClient] = useState(() => new QueryClient());
  const [defaultRepository] = useState(() => createInMemoryNotesRepository());

  return (
    <QueryClientProvider client={queryClient ?? defaultClient}>
      <NotesRepositoryContext.Provider
        value={notesRepository ?? defaultRepository}
      >
        {children}
      </NotesRepositoryContext.Provider>
    </QueryClientProvider>
  );
}
