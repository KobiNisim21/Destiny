import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import FeaturedProducts from "@/components/FeaturedProducts";
import Collections from "@/components/Collections";
import PinsAndStickers from "@/components/PinsAndStickers";
import NewArrivals from "@/components/NewArrivals";
import AboutCreator from "@/components/AboutCreator";
import Influencers from "@/components/Influencers";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div id="hero-section">
          <HeroVideo />
        </div>
        <div id="featured-section">
          <FeaturedProducts />
        </div>
        <div id="trinkets-section">
          <Collections />
        </div>
        <PinsAndStickers />
        <div id="new-arrivals-section">
          <NewArrivals />
        </div>
        <AboutCreator />
        <Influencers />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
