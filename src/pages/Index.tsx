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

import { useQuery } from "@tanstack/react-query";

// Fetch Products Function
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_BASE_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

// Fetch Content Function
const fetchContent = async () => {
  const res = await fetch(`${API_BASE_URL}/api/content`);
  if (!res.ok) throw new Error("Failed to fetch content");
  return res.json();
};

const Index = () => {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60 * 1000, // 1 minute stale time
  });

  const { data: content = {} } = useQuery({
    queryKey: ["content"],
    queryFn: fetchContent,
    staleTime: 60 * 1000,
  });

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
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div id="hero-section">
          <HeroVideo
            heroVideo={content.heroVideo}
            heroYoutubeUrl={content.heroYoutubeUrl}
            heroInfoItems={content.heroInfoItems}
          />
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
