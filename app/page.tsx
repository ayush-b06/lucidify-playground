import CaseStudySection from "@/components/CaseStudySection";
import DashboardPreviewSection from "@/components/DashboardPreviewSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import GetStartedSection from "@/components/GetStartedSection";
import HeroSection from "@/components/HeroSection";
import Main from "@/components/Main";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import QuoteSection from "@/components/QuoteSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Main>
        <HeroSection />
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
