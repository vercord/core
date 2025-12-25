import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/core/footer";
import { LightRays } from "@/components/ui/light-rays";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-4">
      <LightRays />
      <div className="relative flex flex-col items-center gap-6 text-center">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="size-5" />
          <span className="font-medium text-sm">Online</span>
        </div>

        {/* Title */}
        <h1 className="font-bold font-mono text-5xl tracking-tighter">
          versend
        </h1>

        {/* Description */}
        <p className="max-w-xs text-muted-foreground">
          Vercel deployment notifications wherever you want. Deploy your own in
          minutes.
        </p>

        {/* CTA */}
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background text-sm transition-colors hover:bg-foreground/90"
          href="https://docs.versend.io"
          rel="noopener noreferrer"
          target="_blank"
        >
          Get Started
          <ExternalLink className="size-3.5" />
        </Link>

        {/* Source link */}
        <Link
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="https://github.com/versend/core"
          rel="noopener noreferrer"
          target="_blank"
        >
          View source on GitHub
        </Link>
      </div>

      <Footer />
    </main>
  );
}
