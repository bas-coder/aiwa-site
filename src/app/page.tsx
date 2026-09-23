import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import WorkflowEngine from '@/components/WorkflowEngine';
import WhyCards from '@/components/WhyCards';
import TemplatesShowcase from '@/components/TemplatesShowcase';
import PricingSection from '@/components/PricingSection';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-canvas)] text-[var(--color-text-body)]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <WorkflowEngine />
        <WhyCards />
        <TemplatesShowcase />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
