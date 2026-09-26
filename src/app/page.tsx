import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import AIWorkflow from "@/components/landing/ai-workflow"
import FeatureGrid from "@/components/landing/feature-grid"
import DocPreview from "@/components/landing/doc-preview"
import ComparisonTable from "@/components/landing/comparison-table"
import CtaBanner from "@/components/landing/cta-banner"
import Footer from "@/components/landing/footer"

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <FeatureGrid />
                <AIWorkflow />
                <DocPreview />
                <ComparisonTable />
                <CtaBanner />
            </main>
            <Footer />
        </div>
    )
}
