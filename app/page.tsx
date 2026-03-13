import CaseStudySection from "@/components/CaseStudySection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import GetStartedSection from "@/components/GetStartedSection";
import HeroSection from "@/components/HeroSection";
import Main from "@/components/Main";
import MarqueeSection from "@/components/MarqueeSection";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import QuoteSection from "@/components/QuoteSection";
import ScrollSectionIndicator from "@/components/ScrollSectionIndicator";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <ScrollSectionIndicator />
      <Main>
        <HeroSection />
        <MarqueeSection />
        <DashboardPreviewSection />
        <CaseStudySection />
        <ProcessSection />
        <QuoteSection />
        <FeaturesSection />
        <GetStartedSection />
      </Main>
      <Footer />
    </>
  );
}
