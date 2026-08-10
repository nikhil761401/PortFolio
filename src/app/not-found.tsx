import Link from "next/link";
import Section from "@/components/Section";

export default function NotFound() {
  return (
    <Section>
      <h1 className="text-2xl font-bold text-paper">404 — Page not found</h1>
      <p className="mt-2 text-sm text-paper/70">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-accent hover:underline">
        ← Back home
      </Link>
    </Section>
  );
}
