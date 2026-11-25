import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInSchema } from "./auth-schema";

const FIELD_CLASS = "h-11 text-base";
const LINK_CLASS =
  "text-link underline underline-offset-4 decoration-link/40 hover:decoration-link rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

type FieldErrors = { email?: string; password?: string };

export function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = SignInSchema.safeParse({ email, password });
    if (parsed.success) {
      setErrors({});
      return;
    }
    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "password") && !next[field]) {
        next[field] = issue.message;
      }
    }
    setErrors(next);
    // Move focus to the first invalid field so keyboard and screen-reader users land on the problem.
    (next.email ? emailRef : passwordRef).current?.focus();
  }

  return (
    <main className="mx-auto grid min-h-dvh max-w-5xl gap-16 px-6 py-12 md:grid-cols-2 md:items-center md:gap-24 md:py-20">
      <section aria-label="About Commons" className="max-w-prose space-y-8">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          Commons
        </p>
        <p className="text-3xl leading-snug font-light tracking-tight text-balance md:text-4xl">
          A calmer way to read.
        </p>
        <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
          Commons is a home for finite, curated reading: the sources you choose,
          delivered when you decide, with an end in sight.
        </p>
      </section>

      <section className="w-full max-w-sm space-y-8">
        <h1 className="text-2xl font-normal tracking-tight">Sign in</h1>

        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email !== undefined}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={FIELD_CLASS}
            />
            <FieldError id="login-email-error" message={errors.email} />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="login-password">Password</Label>
              <Link to="/forgot-password" className={`${LINK_CLASS} text-sm`}>
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={errors.password !== undefined}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className={FIELD_CLASS}
            />
            <FieldError id="login-password-error" message={errors.password} />
          </div>

          <Button type="submit" className="h-11 w-full text-base">
            Sign in
          </Button>
        </form>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span className="bg-border h-px flex-1" aria-hidden="true" />
          <span>or</span>
          <span className="bg-border h-px flex-1" aria-hidden="true" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full text-base"
        >
          Continue with Google
        </Button>

        <p className="text-muted-foreground text-sm">
          New here?{" "}
          <Link to="/signup" className={LINK_CLASS}>
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-destructive text-sm">
      {message}
    </p>
  );
}
