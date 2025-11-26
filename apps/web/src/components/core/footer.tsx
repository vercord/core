import Link from "next/link";
import type { FC } from "react";

export const Footer: FC = function Footer() {
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: <works like this>
    <footer
      aria-label="Page footer"
      className="w-full max-w-full px-4 pt-6 pb-4 sm:fixed sm:bottom-4"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-balance text-center text-muted-foreground text-xs drop-shadow-[0_0_8px_rgba(156,163,175,0.5)] sm:text-sm">
          This site is not affiliated with or endorsed by{" "}
          <Link
            className="transition-colors duration-200 hover:text-foreground hover:underline"
            href="https://vercel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Vercel
          </Link>{" "}
          or{" "}
          <Link
            className="transition-colors duration-200 hover:text-foreground hover:underline"
            href="https://discord.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Discord
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};
