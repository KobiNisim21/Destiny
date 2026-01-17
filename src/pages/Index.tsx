import { useState, useEffect } from "react";
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
import API_BASE_URL from "@/config";
import { Product } from "@/components/ProductListModal";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Track visit
    const trackVisit = async () => {
      const visited = sessionStorage.getItem('visited');
      if (visited) return;
      try {
        await fetch(`${API_BASE_URL}/api/analytics/visit`, { method: 'POST' });
        sessionStorage.setItem('visited', 'true');
      } catch (error) {
        console.error('Failed to track visit', error);
      }
    };
    trackVisit();

    // Fetch Products (Centralized)
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div id="hero-section">
          <HeroVideo />
        </div>
        <div id="featured-section">
          <FeaturedProducts products={products} />
        </div>
        <div id="trinkets-section">
          <Collections products={products} />
        </div>
        <PinsAndStickers products={products} />
        <div id="new-arrivals-section">
          <NewArrivals products={products} />
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
