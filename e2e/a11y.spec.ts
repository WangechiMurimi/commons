import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

for (const path of ["/", "/nope", "/login"]) {
  test(`has no axe violations at ${path}`, async ({ page }) => {
    await page.goto(path);
    await expectNoViolations(page);
  });
}

test("has no axe violations in the error state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("alert")).toHaveText("Title is required");
  await expectNoViolations(page);
});

test("has no axe violations on /login with validation errors", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toHaveCount(2);
  await expectNoViolations(page);
});

test("has no axe violations on /login after a failed sign-in", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("reader@commons.example");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toHaveText("Invalid email or password");
  await expectNoViolations(page);
});

test("has no axe violations with a filled list", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Title").fill("Buy milk");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("list").getByText("Buy milk")).toBeVisible();
  await expectNoViolations(page);
});
