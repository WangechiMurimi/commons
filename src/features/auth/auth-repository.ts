import { SignInSchema } from "./auth-schema";
import type { Session, SignIn } from "./auth-schema";

export type Account = { email: string; password: string };

// One message for every credential failure, so the UI cannot reveal whether an account exists.
export const GENERIC_SIGN_IN_ERROR = "Invalid email or password";

export interface AuthRepository {
  /** Validates with SignInSchema (throws ZodError); any credential failure throws GENERIC_SIGN_IN_ERROR. */
  signInWithPassword(input: SignIn): Promise<Session>;
  signInWithGoogle(): Promise<Session>;
}

export function createInMemoryAuthRepository(
  opts: { accounts?: Account[] } = {},
): AuthRepository {
  const accounts = opts.accounts ?? [];

  return {
    async signInWithPassword(input) {
      const { email, password } = SignInSchema.parse(input);
      const account = accounts.find(
        (a) => a.email.toLowerCase() === email.toLowerCase(),
      );
      if (!account || account.password !== password) {
        throw new Error(GENERIC_SIGN_IN_ERROR);
      }
      return { userId: crypto.randomUUID(), email: account.email };
    },
    async signInWithGoogle() {
      return { userId: crypto.randomUUID(), email: "reader@gmail.example" };
    },
  };
}
