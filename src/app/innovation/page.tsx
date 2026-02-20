import { Navbar } from "@/components/Navbar";
import { InnovationSection } from "@/components/InnovationSection";

export default function InnovationPage() {
    return (
        <main className="w-full min-h-screen bg-deep-space text-titanium overflow-x-hidden pt-20">
            <Navbar />
            <InnovationSection />
        </main>
    );
}
