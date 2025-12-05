// app/not-found.tsx
import type { Viewport } from "next";
import Link from "next/link";

// Optional: keep themeColor here (NOT in metadata)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

// ✅ The default export MUST be a React component returning JSX
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="mb-6 text-gray-600">
        We couldn’t find the page you were looking for.
      </p>
      <Link href="/" className="underline">
        Go back home
      </Link>
    </main>
  );
}
