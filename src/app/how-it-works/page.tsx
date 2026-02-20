import { Navbar } from "@/components/Navbar";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TerrainComparisonSection } from "@/components/TerrainComparisonSection";

export default function HowItWorksPage() {
    return (
        <main className="w-full min-h-screen bg-deep-space text-titanium overflow-x-hidden pt-20">
            <Navbar />
            <HowItWorksSection />
            <TerrainComparisonSection />
        </main>
    );
}
