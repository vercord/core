import { Footer } from "@/components/core/footer";
import { Hero } from "@/components/core/hero";
import { LightRays } from "@/components/ui/light-rays";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-4">
      <LightRays />
      <Hero />
      <Footer />
    </main>
  );
}
