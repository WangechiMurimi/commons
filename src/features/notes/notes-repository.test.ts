import { ZodError } from "zod";
import { createInMemoryNotesRepository } from "./notes-repository";
import type { Note } from "./note-schema";

describe("createInMemoryNotesRepository", () => {
  it("lists nothing on a new repository", async () => {
    expect(await createInMemoryNotesRepository().list()).toEqual([]);
  });

  it("adds a note with an id, title, and ISO createdAt", async () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const repo = createInMemoryNotesRepository({ now: () => now });
    const note = await repo.add({ title: "A" });
    expect(note.id).not.toBe("");
    expect(note.title).toBe("A");
    expect(note.createdAt).toBe(now.toISOString());
  });

  it("lists the newest note first", async () => {
    let tick = 0;
    const repo = createInMemoryNotesRepository({
      now: () => new Date(Date.UTC(2026, 0, 1, 0, 0, tick++)),
    });
    await repo.add({ title: "older" });
    await repo.add({ title: "newer" });
    expect((await repo.list()).map((n) => n.title)).toEqual(["newer", "older"]);
  });

  it("rejects invalid input and saves nothing", async () => {
    const repo = createInMemoryNotesRepository();
    await expect(repo.add({ title: " " })).rejects.toBeInstanceOf(ZodError);
    expect(await repo.list()).toEqual([]);
  });

  it("includes seed notes", async () => {
    const seed: Note[] = [
      { id: "1", title: "Seeded", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    const repo = createInMemoryNotesRepository({ seed });
    expect(await repo.list()).toEqual(seed);
  });
});
