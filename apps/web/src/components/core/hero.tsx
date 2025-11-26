"use client";

export function Hero() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 px-2 text-center sm:max-w-2xl sm:gap-8 sm:px-4">
      <div className="space-y-4">
        <h1 className="font-bold text-2xl text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Connect{" "}
          <span className="font-bold text-black transition-all duration-300 hover:drop-shadow-md dark:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            Vercel
          </span>{" "}
          to{" "}
          <span className="font-bold text-[#5865F2] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.5)]">
            Discord
          </span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
          Seamlessly integrate your Vercel deployment notifications with
          Discord. Stay updated on every deployment status in real-time.
        </p>
      </div>
    </div>
  );
}
