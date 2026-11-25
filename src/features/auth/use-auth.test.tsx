import { QueryClient } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";
import {
  GENERIC_SIGN_IN_ERROR,
  createInMemoryAuthRepository,
} from "./auth-repository";
import type { AuthRepository } from "./auth-repository";
import type { Session } from "./auth-schema";
import { useGoogleSignIn, useSignIn } from "./use-auth";

const accounts = [{ email: "reader@commons.test", password: "correct-horse" }];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return (
    <AppProviders
      authRepository={createInMemoryAuthRepository({ accounts })}
      queryClient={queryClient}
    >
      {children}
    </AppProviders>
  );
}

describe("useSignIn", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useSignIn(), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });

  it("stays pending until the repository resolves, then succeeds", async () => {
    // A held promise makes the pending state observable; the in-memory repository settles too fast.
    let resolve: (session: Session) => void = () => {};
    const slow: AuthRepository = {
      signInWithPassword: () =>
        new Promise<Session>((r) => {
          resolve = r;
        }),
      signInWithGoogle: () => Promise.reject(new Error("unused")),
    };
    const { result } = renderHook(() => useSignIn(), {
      wrapper: ({ children }) => (
        <AppProviders authRepository={slow}>{children}</AppProviders>
      ),
    });
    act(() => {
      result.current.mutate({
        email: "reader@commons.test",
        password: "correct-horse",
      });
    });
    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => {
      resolve({ userId: "u1", email: "reader@commons.test" });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.email).toBe("reader@commons.test");
  });

  it("surfaces the generic error on bad credentials", async () => {
    const { result } = renderHook(() => useSignIn(), { wrapper });
    act(() => {
      result.current.mutate({
        email: "reader@commons.test",
        password: "wrong-password",
      });
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe(GENERIC_SIGN_IN_ERROR);
  });

  it("throws a clear error outside <AppProviders>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useSignIn())).toThrow(
      "useSignIn must be used inside <AppProviders>",
    );
    spy.mockRestore();
  });
});

describe("useGoogleSignIn", () => {
  it("succeeds with a session", async () => {
    const { result } = renderHook(() => useGoogleSignIn(), { wrapper });
    act(() => {
      result.current.mutate();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.userId).not.toBe("");
  });
});
