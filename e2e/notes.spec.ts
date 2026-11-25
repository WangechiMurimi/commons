import { expect, test } from "@playwright/test";

test("adds a note", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Title").fill("Buy milk");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByRole("list").getByText("Buy milk")).toBeVisible();
});

test("shows the not-found page and links back to notes", async ({ page }) => {
  await page.goto("/nope");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to notes" }).click();
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});
