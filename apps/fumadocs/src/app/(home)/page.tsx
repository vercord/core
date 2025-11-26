import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-fd-border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      <div className="relative flex max-w-3xl flex-col items-center gap-6 text-center">
        {/* Logo/Title */}
        <h1 className="font-bold font-mono text-7xl tracking-tighter sm:text-8xl">
          <span className="bg-gradient-to-b from-fd-foreground to-fd-muted-foreground bg-clip-text text-transparent">
            vercord
          </span>
        </h1>

        {/* One-liner */}
        <p className="max-w-lg text-fd-muted-foreground text-xl">
          A webhook relay. Vercel sends deployment events, Vercord forwards them
          to Discord. That's it.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-4">
          <Link
            className="group inline-flex items-center gap-2 rounded-full bg-fd-foreground px-6 py-3 font-medium text-fd-background transition-all hover:gap-3"
            href="/docs"
          >
            Read the docs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-fd-border px-6 py-3 font-medium transition-colors hover:bg-fd-muted"
            href="https://github.com/vercord/core"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github className="size-4" />
            Source
          </Link>
        </div>

        {/* What you get */}
        <div className="mt-16 grid w-full gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-3">
          <Card
            desc="Events hit Discord within seconds of Vercel firing them"
            title="Fast"
          />
          <Card
            desc="Branch, commit, status, links — all in the embed"
            title="Detailed"
          />
          <Card desc="Deploy, add 4 env vars, done" title="Simple" />
        </div>

        {/* Honest note */}
        <p className="mt-8 max-w-md text-fd-muted-foreground/60 text-sm">
          This isn't a platform or a service. It's ~200 lines of code that sits
          between Vercel and Discord. Self-host it, fork it, forget about it.
        </p>
      </div>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-fd-background p-6">
      <h3 className="font-semibold text-fd-foreground">{title}</h3>
      <p className="mt-1 text-fd-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
