describe("getSupabase", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns a client when both env vars are set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-key");
    const { getSupabase } = await import("./supabase");
    const client = getSupabase();
    expect(client).toBeTruthy();
    expect(typeof client?.from).toBe("function");
  });

  it("memoizes the client", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-key");
    const { getSupabase } = await import("./supabase");
    expect(getSupabase()).toBe(getSupabase());
  });

  it("returns null when the URL is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-key");
    const { getSupabase } = await import("./supabase");
    expect(getSupabase()).toBeNull();
  });

  it("returns null when the key is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "http://localhost:54321");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");
    const { getSupabase } = await import("./supabase");
    expect(getSupabase()).toBeNull();
  });
});
