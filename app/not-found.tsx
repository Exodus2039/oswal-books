import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found.</h1>
      <p className="text-base text-muted">That screen is not part of the app.</p>
      <Link
        href="/"
        className="inline-flex min-h-10 w-fit items-center rounded-lg bg-action px-4 font-semibold text-action-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
      >
        Go home
      </Link>
    </main>
  );
}
