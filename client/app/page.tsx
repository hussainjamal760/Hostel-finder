import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import Hero from "./components/Home/Hero";
import FeaturedHostels from "./components/Home/FeaturedHostels";
import HomeMapSection from "./components/Home/HomeMapSection";
import HostelGrid from "./components/Home/HostelGrid";
import ReviewsSection from "./components/Home/ReviewsSection";
import FAQ from "./components/Home/FAQ";
import AnnouncementsBanner from "./components/Home/AnnouncementsBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg transition-colors">
      <Header />

      <main>
        <AnnouncementsBanner />
        <Hero />
        <FeaturedHostels />
        <HomeMapSection />
        <HostelGrid />
        <ReviewsSection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}