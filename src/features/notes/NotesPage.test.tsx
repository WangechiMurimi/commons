import { QueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProviders } from "@/app/providers";
import { NotesPage } from "./NotesPage";
import { createInMemoryNotesRepository } from "./notes-repository";
import type { Note } from "./note-schema";
import type { NotesRepository } from "./notes-repository";

function renderWithRepository(notesRepository: NotesRepository) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <AppProviders notesRepository={notesRepository} queryClient={queryClient}>
      <NotesPage />
    </AppProviders>,
  );
}

function renderPage(seed: Note[] = []) {
  renderWithRepository(createInMemoryNotesRepository({ seed }));
}

describe("NotesPage", () => {
  it("shows an empty state when there are no notes", async () => {
    renderPage();
    expect(await screen.findByText("No notes yet.")).toBeInTheDocument();
  });

  it("adds a note and clears the input", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("No notes yet.");
    await user.type(screen.getByLabelText("Title"), "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("listitem")).toHaveTextContent("Buy milk");
    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  it("rejects an empty title", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("No notes yet.");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Title is required",
    );
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("rejects a whitespace-only title", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText("No notes yet.");
    await user.type(screen.getByLabelText("Title"), "   ");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Title is required",
    );
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders seeded notes newest first", async () => {
    renderPage([
      { id: "1", title: "Older", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "2", title: "Newer", createdAt: "2026-01-02T00:00:00.000Z" },
    ]);
    const items = await screen.findAllByRole("listitem");
    expect(items.map((i) => i.textContent)).toEqual(["Newer", "Older"]);
  });

  it("marks the list with an explicit role so Safari keeps list semantics", async () => {
    renderPage([
      { id: "1", title: "One", createdAt: "2026-01-01T00:00:00.000Z" },
    ]);
    expect(await screen.findByRole("list")).toHaveAttribute("role", "list");
  });

  it("shows a loading state while notes load", () => {
    renderWithRepository({
      list: () => new Promise(() => {}),
      add: () => new Promise(() => {}),
    });
    expect(screen.getByText("Loading notes…")).toBeInTheDocument();
  });

  it("shows an error when notes fail to load", async () => {
    renderWithRepository({
      list: () => Promise.reject(new Error("boom")),
      add: () => Promise.reject(new Error("boom")),
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load your notes. Please refresh the page.",
    );
  });

  it("shows an error and keeps the input when saving fails", async () => {
    const user = userEvent.setup();
    renderWithRepository({
      list: () => Promise.resolve([]),
      add: () => Promise.reject(new Error("boom")),
    });
    await screen.findByText("No notes yet.");
    await user.type(screen.getByLabelText("Title"), "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not save your note. Please try again.",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Buy milk");
  });

  it("disables the button while a save is pending", async () => {
    const user = userEvent.setup();
    renderWithRepository({
      list: () => Promise.resolve([]),
      add: () => new Promise(() => {}),
    });
    await screen.findByText("No notes yet.");
    await user.type(screen.getByLabelText("Title"), "Buy milk");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(screen.getByRole("button", { name: "Add note" })).toBeDisabled();
  });
});
