import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  // Not trimmed: leading/trailing spaces can be part of a real password.
  password: z
    .string()
    .min(1, "Password is required")
    .pipe(z.string().min(8, "Password must be at least 8 characters")),
});

export type SignIn = z.infer<typeof SignInSchema>;

export const SessionSchema = z.object({
  userId: z.string().min(1),
  email: z.email(),
});

export type Session = z.infer<typeof SessionSchema>;
