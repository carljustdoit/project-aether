import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { NetworkMapSection } from "@/components/NetworkMapSection";
import { InnovationTeaser } from "@/components/InnovationTeaser";
import { ROICalculatorSection } from "@/components/ROICalculatorSection";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-deep-space text-titanium overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <NetworkMapSection />
      <InnovationTeaser />
      <ROICalculatorSection />
    </main>
  );
}
