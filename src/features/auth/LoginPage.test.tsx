import { QueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AppProviders } from "@/app/providers";
import { createInMemoryAuthRepository } from "./auth-repository";
import type { AuthRepository } from "./auth-repository";
import { LoginPage } from "./LoginPage";

const accounts = [{ email: "reader@commons.test", password: "correct-horse" }];

export function renderLogin(
  authRepository: AuthRepository = createInMemoryAuthRepository({ accounts }),
) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  render(
    <AppProviders authRepository={authRepository} queryClient={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Home</p>} />
        </Routes>
      </MemoryRouter>
    </AppProviders>,
  );
}

describe("LoginPage content", () => {
  it("shows the brand and a short product introduction", () => {
    renderLogin();
    expect(screen.getByText("Commons")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/finite, curated reading/i)).toBeInTheDocument();
  });

  it("has labelled email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("offers email sign-in and Google sign-in as buttons", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" }),
    ).toBeInTheDocument();
  });

  it("links to password recovery and account creation", () => {
    renderLogin();
    expect(
      screen.getByRole("link", { name: "Forgot password?" }),
    ).toHaveAttribute("href", "/forgot-password");
    expect(
      screen.getByRole("link", { name: "Create an account" }),
    ).toHaveAttribute("href", "/signup");
  });

  it("autofills credentials via autocomplete hints", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });
});
