import { SignInSchema } from "./auth-schema";

function messages(input: { email: string; password: string }) {
  const result = SignInSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
}

describe("SignInSchema", () => {
  it("accepts a valid email and password", () => {
    expect(
      SignInSchema.safeParse({ email: "a@b.co", password: "longenough" })
        .success,
    ).toBe(true);
  });

  it("rejects an empty email", () => {
    expect(messages({ email: "", password: "longenough" })).toContain(
      "Email is required",
    );
  });

  it("rejects a malformed email", () => {
    expect(messages({ email: "not-an-email", password: "longenough" })).toEqual(
      ["Enter a valid email address"],
    );
  });

  it("rejects an empty password", () => {
    expect(messages({ email: "a@b.co", password: "" })).toContain(
      "Password is required",
    );
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(messages({ email: "a@b.co", password: "short" })).toEqual([
      "Password must be at least 8 characters",
    ]);
  });

  it("trims the email but not the password", () => {
    expect(
      SignInSchema.parse({ email: "  a@b.co  ", password: " spaced pw " }),
    ).toEqual({ email: "a@b.co", password: " spaced pw " });
  });
});
