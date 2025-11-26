"use client";

import { Home } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/core/footer";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <AnimatedGridPattern
        className={cn(
          "mask-[radial-gradient(650px_circle_at_center,white,transparent)]",
          "-z-10 absolute inset-0"
        )}
        duration={3}
        maxOpacity={0.1}
        repeatDelay={1}
      />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex max-w-md animate-fade-in flex-col items-center gap-6 text-center">
          <h1 className="font-bold text-2xl text-foreground sm:text-3xl">
            404 - Page Not Found
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Button asChild className="group" variant="primary-outline">
            <Link href="/">
              <Home className="transition-transform group-hover:rotate-12" />
              <span className="ml-2">Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
