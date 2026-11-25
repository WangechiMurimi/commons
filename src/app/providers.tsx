import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { createInMemoryAuthRepository } from "@/features/auth/auth-repository";
import type { AuthRepository } from "@/features/auth/auth-repository";
import { AuthRepositoryContext } from "@/features/auth/use-auth";
import { NotesRepositoryContext } from "@/features/notes/use-notes";
import { createInMemoryNotesRepository } from "@/features/notes/notes-repository";
import type { NotesRepository } from "@/features/notes/notes-repository";

// Placeholder account until Supabase Auth replaces the in-memory repository (ADR 0005).
const DEMO_ACCOUNTS = [
  { email: "reader@commons.example", password: "commons-demo" },
];

export function AppProviders({
  children,
  authRepository,
  notesRepository,
  queryClient,
}: {
  children: ReactNode;
  authRepository?: AuthRepository;
  notesRepository?: NotesRepository;
  queryClient?: QueryClient;
}) {
  const [defaultClient] = useState(() => new QueryClient());
  const [defaultNotes] = useState(() => createInMemoryNotesRepository());
  const [defaultAuth] = useState(() =>
    createInMemoryAuthRepository({ accounts: DEMO_ACCOUNTS }),
  );

  return (
    <QueryClientProvider client={queryClient ?? defaultClient}>
      <AuthRepositoryContext.Provider value={authRepository ?? defaultAuth}>
        <NotesRepositoryContext.Provider
          value={notesRepository ?? defaultNotes}
        >
          {children}
        </NotesRepositoryContext.Provider>
      </AuthRepositoryContext.Provider>
    </QueryClientProvider>
  );
}
