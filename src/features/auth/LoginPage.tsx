import { useRef, useState } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/lib/use-page-title";
import { GENERIC_SIGN_IN_ERROR } from "./auth-repository";
import { SignInSchema } from "./auth-schema";
import { useGoogleSignIn, useSignIn } from "./use-auth";

const FIELD_CLASS = "h-11 text-base";
const LINK_CLASS =
  "text-link underline underline-offset-4 decoration-link/40 hover:decoration-link rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

type FieldErrors = { email?: string; password?: string };

export function LoginPage() {
  usePageTitle("Sign in");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const navigate = useNavigate();
  const signIn = useSignIn();
  const googleSignIn = useGoogleSignIn();
  const busy = signIn.isPending || googleSignIn.isPending;

  function goHome() {
    void navigate("/");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = SignInSchema.safeParse({ email, password });
    if (parsed.success) {
      setErrors({});
      googleSignIn.reset();
      signIn.mutate(parsed.data, { onSuccess: goHome });
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

        <form
          noValidate
          onSubmit={handleSubmit}
          aria-busy={signIn.isPending}
          className="space-y-6"
        >
          <Field
            id="login-email"
            label="Email"
            inputRef={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          <Field
            id="login-password"
            label="Password"
            footer={
              <Link to="/forgot-password" className={`${LINK_CLASS} text-sm`}>
                Forgot password?
              </Link>
            }
            inputRef={passwordRef}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          {signIn.isError && (
            // Fixed text on purpose: never echo the underlying error, so nothing about the account leaks.
            <p role="alert" className="text-destructive text-sm">
              {GENERIC_SIGN_IN_ERROR}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full text-base"
          >
            {signIn.isPending ? "Signing in…" : "Sign in"}
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
          disabled={busy}
          onClick={() => {
            signIn.reset();
            googleSignIn.mutate(undefined, { onSuccess: goHome });
          }}
          className="h-11 w-full text-base"
        >
          Continue with Google
        </Button>

        {googleSignIn.isError && (
          <p role="alert" className="text-destructive text-sm">
            Could not sign in with Google. Please try again.
          </p>
        )}

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

type FieldProps = {
  id: string;
  label: string;
  footer?: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  name: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function Field({
  id,
  label,
  footer,
  inputRef,
  onChange,
  error,
  ...input
}: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        ref={inputRef}
        {...input}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error ? errorId : undefined}
        className={FIELD_CLASS}
      />
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      {/* After the input in DOM order, so Tab goes email → password → link. */}
      {footer && <div className="text-right">{footer}</div>}
    </div>
  );
}
