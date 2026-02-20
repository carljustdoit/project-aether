import { Navbar } from "@/components/Navbar";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { DeploymentSection } from "@/components/DeploymentSection";
import { TerrainComparisonSection } from "@/components/TerrainComparisonSection";

export default function HowItWorksPage() {
    return (
        <main className="w-full min-h-screen bg-deep-space text-titanium overflow-x-hidden pt-20">
            <Navbar />
            <HowItWorksSection />
            <DeploymentSection />
            <TerrainComparisonSection />
        </main>
    );
}
