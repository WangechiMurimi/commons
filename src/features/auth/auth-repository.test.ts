import { ZodError } from "zod";
import {
  GENERIC_SIGN_IN_ERROR,
  createInMemoryAuthRepository,
} from "./auth-repository";

const accounts = [{ email: "reader@commons.test", password: "correct-horse" }];

describe("createInMemoryAuthRepository", () => {
  it("signs in with a known email and password", async () => {
    const repo = createInMemoryAuthRepository({ accounts });
    const session = await repo.signInWithPassword({
      email: "reader@commons.test",
      password: "correct-horse",
    });
    expect(session.email).toBe("reader@commons.test");
    expect(session.userId).not.toBe("");
  });

  it("rejects a wrong password with the generic error", async () => {
    const repo = createInMemoryAuthRepository({ accounts });
    await expect(
      repo.signInWithPassword({
        email: "reader@commons.test",
        password: "wrong-password",
      }),
    ).rejects.toThrow(GENERIC_SIGN_IN_ERROR);
  });

  it("gives the same error for an unknown email as for a wrong password", async () => {
    const repo = createInMemoryAuthRepository({ accounts });
    const unknown = await repo
      .signInWithPassword({
        email: "nobody@commons.test",
        password: "whatever1",
      })
      .catch((e: unknown) => e);
    const wrong = await repo
      .signInWithPassword({
        email: "reader@commons.test",
        password: "wrong-password",
      })
      .catch((e: unknown) => e);
    expect(unknown).toBeInstanceOf(Error);
    expect((unknown as Error).message).toBe((wrong as Error).message);
    expect((unknown as Error).message).toBe(GENERIC_SIGN_IN_ERROR);
  });

  it("matches the email case-insensitively", async () => {
    const repo = createInMemoryAuthRepository({ accounts });
    const session = await repo.signInWithPassword({
      email: "Reader@Commons.test",
      password: "correct-horse",
    });
    expect(session.email).toBe("reader@commons.test");
  });

  it("rejects invalid input with a ZodError", async () => {
    const repo = createInMemoryAuthRepository({ accounts });
    await expect(
      repo.signInWithPassword({ email: "nope", password: "x" }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("signs in with Google", async () => {
    const session = await createInMemoryAuthRepository().signInWithGoogle();
    expect(session.userId).not.toBe("");
    expect(session.email).toContain("@");
  });
});
