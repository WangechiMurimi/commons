import { NewNoteSchema } from "./note-schema";

function firstMessage(input: string) {
  const result = NewNoteSchema.safeParse({ title: input });
  return result.success ? null : result.error.issues[0]?.message;
}

describe("NewNoteSchema", () => {
  it("rejects a whitespace-only title", () => {
    expect(firstMessage("   ")).toBe("Title is required");
  });

  it("rejects an empty title", () => {
    expect(firstMessage("")).toBe("Title is required");
  });

  it("accepts a 120-character title", () => {
    expect(NewNoteSchema.safeParse({ title: "a".repeat(120) }).success).toBe(
      true,
    );
  });

  it("rejects a 121-character title", () => {
    expect(firstMessage("a".repeat(121))).toBe(
      "Title must be 120 characters or fewer",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(NewNoteSchema.parse({ title: "  Hello  " }).title).toBe("Hello");
  });
});
