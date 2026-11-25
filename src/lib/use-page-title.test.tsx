import { renderHook } from "@testing-library/react";
import { usePageTitle } from "./use-page-title";

describe("usePageTitle", () => {
  it("sets document.title", () => {
    renderHook(() => usePageTitle("Notes"));
    expect(document.title).toBe("Notes");
  });

  it("updates document.title when the title changes", () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: "Notes" },
    });
    rerender({ title: "Page not found" });
    expect(document.title).toBe("Page not found");
  });
});
