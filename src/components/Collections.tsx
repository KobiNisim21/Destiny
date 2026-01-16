import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import ProductListModal, { Product } from "./ProductListModal";
import API_BASE_URL from "@/config";

// New Trinkets Images
import trinket1Image from "@/assets/A5.png";
import trinket2Image from "@/assets/A6.png";
import trinket3Image from "@/assets/A7.png";
import trinket4Image from "@/assets/A8.png";

// Placeholder Hover Images
import capHoverImage from "@/assets/product-cap.jpg";
import toteHoverImage from "@/assets/product-totebag.jpg";
import tshirtHoverImage from "@/assets/A2.png";
import hoodieHoverImage from "@/assets/A3.png";

const DEFAULT_TRINKETS: Product[] = [
  {
    id: 101,
    slug: "trinket-1",
    name: "Cat Ears Attachment",
    price: 49.99,
    image: trinket1Image,
    hoverImage: capHoverImage,
    description: "תוספת אוזני חתול לאוזניות, מתאים לכל סוגי האוזניות."
  },
  {
    id: 102,
    slug: "trinket-2",
    name: "Neon Glow Kit",
    price: 79.99,
    image: trinket2Image,
    hoverImage: toteHoverImage,
    badge: "מומלץ",
    description: "ערכת תאורה ניאון לאוזניות לשדרוג הסטייל הגיימינג שלך."
  },
  {
    id: 103,
    slug: "trinket-3",
    name: "Custom Plates",
    price: 39.99,
    image: trinket3Image,
    hoverImage: tshirtHoverImage,
    badge: "חדש",
    description: "פלטות צד מתחלפות בעיצובים מרהיבים לאוזניות."
  },
  {
    id: 104,
    slug: "trinket-4",
    name: "Cable Charm",
    price: 19.99,
    image: trinket4Image,
    hoverImage: hoodieHoverImage,
    description: "תכשיט לכבל האוזניות/מטען להוספת טאץ' אישי."
  }
];

const Collections = () => {
  const [displaySlots, setDisplaySlots] = useState<Product[]>(DEFAULT_TRINKETS);
  const [allTrinkets, setAllTrinkets] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();

        const trinkets = data.filter((p: Product) => p.section === 'trinkets');
        setAllTrinkets(trinkets);

        // Map to slots
        const newSlots = [...DEFAULT_TRINKETS];
        trinkets.forEach((p: Product) => {
          if (p.displaySlot && p.displaySlot >= 1 && p.displaySlot <= 4) {
            newSlots[p.displaySlot - 1] = p;
          }
        });

        setDisplaySlots(newSlots);

      } catch (error) {
        console.error("Failed to fetch trinkets", error);
      }
    };

    fetchProducts();
  }, []);

  // Helper to get image URL safely
  const getImageUrl = (product: Product, index: number) => {
    // DB Product
    if (product.images && product.images.length > 0) {
      if (index === 0) return `${API_BASE_URL}${product.images[0]}`;
      return product.images[1] ? `${API_BASE_URL}${product.images[1]}` : `${API_BASE_URL}${product.images[0]}`;
    }
    // Static Product
    if (index === 0) return product.image || '';
    return product.hoverImage || product.image || '';
  };

  const getProductName = (p: Product) => p.title || p.name || '';
  const getProductLink = (p: Product) => p._id ? `/product/${p._id}` : (p.slug ? `/product/${p.slug}` : '#');
  const getProductBadge = (p: Product) => {
    if (p.badge) return p.badge;
    if (p.isNewArrival) return "חדש";
    return null;
  };

  return (
    <>
      <section
        className="relative"
        dir="rtl"
        style={{
          backgroundColor: '#F9F5FF',
          boxShadow: '0px 0px 15.2px 0px #8AFF00',
          zIndex: 10
        }}
      >
        <div className="py-16 md:py-24"> {/* Light Purple Background */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-12 animate-fade-in text-center">
              <h2 style={{
                color: '#22222A',
                fontFamily: '"Noto Sans Hebrew", sans-serif',
                fontSize: '48px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal',
                marginBottom: '3px'
              }}>
                טרינקטס
              </h2>
              <p className="max-w-2xl mx-auto" style={{
                color: '#797986',
                fontFamily: '"Noto Sans Hebrew", sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                textAlign: 'center'
              }}>
                הציגו את האישיות שלכם וצרו אמירה נועזת עם עיצוב אוזני החתלתול האייקוני ביותר בגיימינג
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
              {displaySlots.map((product, index) => {
                const displayImage = getImageUrl(product, 0);
                const hoverImage = getImageUrl(product, 1);
                const badgeText = getProductBadge(product);

                return (
                  <div key={product._id || product.id} className="group animate-slide-up" style={{
                    animationDelay: `${index * 0.1}s`,
                    width: '310px',
                    height: '450px'
                  }}>
                    <div
                      className="overflow-hidden h-full flex flex-col transition-all duration-300 relative group-hover:-translate-y-1 bg-[#202027] group-hover:bg-white shadow-[0_8px_18.7px_-7px_#9F19FF] group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(125,228,0,0.4)]"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        borderRadius: '24px',
                        height: '450px',
                        width: '310px'
                      }}>

                      {/* Image Container - White BG for Trinkets */}
                      <div className="relative overflow-hidden w-full group-hover:bg-[#D5D5F5]/30 transition-colors duration-300"
                        style={{
                          height: '265px',
                          flexShrink: 0,
                          padding: '12px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '10px',
                          borderRadius: '24px 24px 0 0',
                          backgroundColor: '#FFFFFF', // White BG for image part
                        }}>

                        {/* Default Image */}
                        <img src={displayImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 z-0" />
                        {/* Hover Image */}
                        <img src={hoverImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0" />

                        {/* Cart Icon (Hover) */}
                        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#7DE400' }}>
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {badgeText && <Badge className="relative z-10 font-bold px-3 py-1"
                          style={{
                            backgroundColor: '#9F19FF',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                          {badgeText}
                        </Badge>}
                      </div>

                      {/* Content Container - No Hardcoded BG to allow Parent BG to show on Hover */}
                      <div className="w-full px-5 pb-[70px] flex flex-col flex-1 relative duration-300">

                        {/* Title */}
                        <h3 className="mb-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#7DE400]" style={{
                          textAlign: 'right',
                          fontFamily: '"Noto Sans Hebrew", sans-serif',
                          fontSize: '20px',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          lineHeight: 'normal',
                          alignSelf: 'stretch',
                          marginTop: '4px'
                        }}>
                          {getProductName(product)}
                        </h3>

                        {/* Description */}
                        <p className="flex-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#22222A]" style={{
                          textAlign: 'right',
                          fontFamily: '"Noto Sans Hebrew", sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 200,
                          lineHeight: 'normal',
                          alignSelf: 'stretch'
                        }}>
                          {product.description}
                        </p>

                        {/* Footer: Price & Button */}
                        <div className="flex items-center justify-between w-full absolute bottom-5 left-0 px-5">
                          <span className="text-[#FFF] transition-colors duration-300 group-hover:text-[#22222A]" style={{
                            fontFamily: '"Noto Sans Hebrew"',
                            fontSize: '24px',
                            fontWeight: 700,
                          }}>
                            ₪{product.price}
                          </span>

                          <Link to={getProductLink(product)}>
                            <Button
                              size="sm"
                              className="w-[107px] h-[36px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border border-[#9F19FF] bg-[#3C3C43] text-[#F2F2F2] font-['Noto_Sans_Hebrew'] text-[14px] font-normal transition-all duration-300 hover:opacity-90 group-hover:bg-[#7DE400] group-hover:border-[#A6FF4D] group-hover:text-white"
                            >
                              צפו במוצר
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* View All Button - Same as previous section */}
            <div className="text-center mt-12" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="ghost"
                className="w-[185px] h-[44px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border-2 border-[#D3D3D3] bg-white text-[#22222A] font-['Noto Sans Hebrew'] text-[16px] font-medium transition-all duration-300 hover:bg-[#7DE400] hover:border-[#A6FF4D] hover:text-white"
              >
                צפו בכל הטרינקטס
              </Button>
            </div>

          </div>
        </div>
      </section>

      <ProductListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="טרינקטס"
        products={allTrinkets}
      />
    </>
  );
};

export default Collections;
