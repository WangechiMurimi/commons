import { Link } from "react-router";
import { usePageTitle } from "@/lib/use-page-title";

export function NotFoundPage() {
  usePageTitle("Page not found");
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2">
        <Link className="underline" to="/">
          Back to notes
        </Link>
      </p>
    </main>
  );
}
