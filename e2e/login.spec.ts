import { expect, test } from "@playwright/test";

// Demo account from AppProviders (in-memory until Supabase Auth lands, ADR 0005).
const EMAIL = "reader@commons.example";
const PASSWORD = "commons-demo";

test("signs in with email and password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});

test("shows one generic error for a wrong password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toHaveText("Invalid email or password");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("signs in with Google", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});

test("links to recovery and account creation", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Forgot password?" }),
  ).toHaveAttribute("href", "/forgot-password");
  await expect(
    page.getByRole("link", { name: "Create an account" }),
  ).toHaveAttribute("href", "/signup");
});

test("is usable by keyboard alone", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").focus();
  await page.keyboard.type(EMAIL);
  await page.keyboard.press("Tab"); // password
  await page.keyboard.type(PASSWORD);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});
