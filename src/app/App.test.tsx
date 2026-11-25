import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "./App";
import { AppProviders } from "./providers";

function renderAt(path: string) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AppProviders>,
  );
}

describe("App routes", () => {
  it("renders the Notes heading at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: "Notes" }),
    ).toBeInTheDocument();
  });

  it("sets the document title to Notes at /", () => {
    renderAt("/");
    expect(document.title).toBe("Notes");
  });

  it("sets the document title to Page not found for unknown routes", () => {
    renderAt("/does-not-exist");
    expect(document.title).toBe("Page not found");
  });

  it("renders a not-found page for unknown routes", () => {
    renderAt("/does-not-exist");
    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to notes" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
