import { useMutation } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import type { AuthRepository } from "./auth-repository";
import type { SignIn } from "./auth-schema";

export const AuthRepositoryContext = createContext<AuthRepository | null>(null);

function useAuthRepository(hook: string): AuthRepository {
  const repository = useContext(AuthRepositoryContext);
  if (!repository)
    throw new Error(`${hook} must be used inside <AppProviders>`);
  return repository;
}

export function useSignIn() {
  const repository = useAuthRepository("useSignIn");
  return useMutation({
    mutationFn: (input: SignIn) => repository.signInWithPassword(input),
  });
}

export function useGoogleSignIn() {
  const repository = useAuthRepository("useGoogleSignIn");
  return useMutation({ mutationFn: () => repository.signInWithGoogle() });
}
