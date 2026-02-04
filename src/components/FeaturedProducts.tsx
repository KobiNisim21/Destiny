import { ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import ProductListModal, { Product } from "./ProductListModal";
import { useCart } from "@/context/CartContext";
import API_BASE_URL from "@/config";
import realHeadphonesImage from "@/assets/product-real-headphones.png";
import cartoonHeadphonesImage from "@/assets/product-cartoon-headphones.png";
import butterfliesImage from "@/assets/product-butterflies.png";
import crownImage from "@/assets/product-crown.png";
import capHoverImage from "@/assets/product-cap.jpg";
import toteHoverImage from "@/assets/product-totebag.jpg";
import tshirtHoverImage from "@/assets/A2.png";
import hoodieHoverImage from "@/assets/A3.png";

// Types
// Types


const DEFAULT_PRODUCTS: Product[] = [{
  id: 1,
  slug: "cap",
  name: "Classic Cap",
  price: 119.99,
  image: realHeadphonesImage,
  hoverImage: capHoverImage,
  description: "כובע ממותק מיוחד במינו עם איכות מוצר מהגובהה ביותר בשוק."
}, {
  id: 2,
  slug: "totebag",
  name: "Canvas Tote Bag",
  price: 99.99,
  image: cartoonHeadphonesImage,
  hoverImage: toteHoverImage,
  badge: "מהדורה מוגבלת",
  description: "גרסה מוגבלת בלעדית עם פרטים הולוגרפיים"
}, {
  id: 3,
  slug: "tshirt",
  name: "Essential Tee",
  price: 129.99,
  image: butterfliesImage,
  hoverImage: tshirtHoverImage,
  badge: "חדש!",
  description: "חולצת טי נוחה גדולה במיוחד עם וייבים מוטיבציוניים"
}, {
  id: 4,
  slug: "hoodie",
  name: "Signature Hoodie",
  price: 299.99,
  image: crownImage,
  hoverImage: hoodieHoverImage,
  badge: "מוצר נמכר",
  description: "קפוצ'ון פרימיום רך במיוחד עם לוגו דסטיני בלעדי"
}];



interface FeaturedProductsProps {
  products?: Product[];
}

const FeaturedProducts = ({ products: dbProducts = [] }: FeaturedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [allFeatured, setAllFeatured] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (dbProducts.length > 0) {
      // Filter for featured products
      const featured = dbProducts.filter((p: Product) => p.section === 'featured');
      setAllFeatured(featured);

      // Logic to map to slots 1-4
      if (featured.length > 0) {
        const newSlots = [...DEFAULT_PRODUCTS];
        featured.forEach((p: Product) => {
          if (p.displaySlot && p.displaySlot >= 1 && p.displaySlot <= 4) {
            newSlots[p.displaySlot - 1] = p;
          }
        });
        setProducts(newSlots);
      }
      setLoading(false);
    }
  }, [dbProducts]);

  // Helper to get image URL safely
  const getImageUrl = (product: Product, isHover: boolean = false) => {
    // 1. Explicit DB Fields (Preferred)
    if (isHover) {
      if (product.hoverImage) return `${API_BASE_URL}${product.hoverImage}`;
      // If want to fall back to main image if no hover? Or empty? 
      // User asked for "No hover animation" if empty. So return empty string.
      // But wait, allow static fallback 
    } else {
      if (product.mainImage) return `${API_BASE_URL}${product.mainImage}`;
    }

    // 2. Legacy DB Fields (images array)
    if (product.images && product.images.length > 0) {
      if (isHover) {
        return product.images[1] ? `${API_BASE_URL}${product.images[1]}` : ''; // Don't fallback to main for hover to avoid weirdness, or invalid index
      }
      return `${API_BASE_URL}${product.images[0]}`;
    }

    // 3. Static Products
    if (isHover) return product.hoverImage || '';
    return product.image || '';
  };

  const getProductName = (p: Product) => p.title || p.name || '';
  const getProductLink = (p: Product) => p._id ? `/product/${p._id}` : `/product/${p.slug}`;

  return <section className="py-16 md:py-24" dir="rtl">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 animate-fade-in" style={{ textAlign: 'center' }}>
        <h2 className="" style={{
          color: '#22222A',
          fontFamily: '"Noto Sans Hebrew", sans-serif',
          fontSize: '48px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal',
          marginBottom: '3px'
        }}>
          מוצרים נבחרים
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
          פריטים אהובים שנבחרו בקפידה מהקולקציה האחרונה שלנו. איכות פרימיום, עיצובים בלעדיים.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full max-w-[350px] h-[450px] rounded-[24px] overflow-hidden bg-white shadow-sm border border-gray-100">
              <Skeleton className="h-[265px] w-full" />
              <div className="p-5 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4 ml-auto" />
                <Skeleton className="h-4 w-full ml-auto" />
                <div className="flex justify-between items-center mt-auto pt-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          ))
        ) : (
          products.map((product, index) => {
            const displayImage = getImageUrl(product, false);
            const hoverImage = getImageUrl(product, true);

            // Determine badge text
            let badgeText = product.customLabel || product.badge;
            if (!badgeText && product.isNewArrival) badgeText = "חדש!";

            return (
              <div key={product._id || product.id} className="group animate-slide-up" style={{
                animationDelay: `${index * 0.1}s`,
                width: '100%',
                maxWidth: '350px',
                height: '450px'
              }}>
                <div
                  className="overflow-hidden h-full flex flex-col transition-all duration-300 relative group-hover:-translate-y-1 group-hover:bg-white shadow-[0_8px_18.7px_-7px_#9F19FF] group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(125,228,0,0.4)]"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px', // GAP REDUCED TO 2PX as requested
                    borderRadius: '24px',
                    height: '450px',
                    width: '100%',
                    background: 'linear-gradient(180deg, #16172E 0%, #16172E 40%, #3E1B63 100%)'
                  }}>

                  {/* Image Container */}
                  <div className="relative overflow-hidden w-full group-hover:bg-[#D5D5F5]/30 transition-colors duration-300"
                    style={{
                      height: '265px', // Increased height to show more image
                      flexShrink: 0,
                      padding: '12px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '10px',
                      borderRadius: '24px 24px 0 0',
                    }}>

                    {/* Default Image */}
                    <img src={displayImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 z-0" />
                    {/* Hover Image */}
                    <img src={hoverImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0" />

                    {/* Cart Icon (Hover) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          ...product,
                          name: getProductName(product),
                          image: getImageUrl(product, false)
                        });
                      }}
                      className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-transparent border-none p-0 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform" style={{ backgroundColor: '#7DE400' }}>
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </button>

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

                  {/* Content Container */}
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
                      marginTop: '4px' // Adjusted margin as per instruction
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
                      {product.description && product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                    </p>

                    {/* Footer: Price & Button - Absolute Positioning */}
                    <div className="flex items-center justify-between w-full absolute bottom-5 left-0 px-5">
                      <div className="flex flex-col items-start gap-0">
                        <span className="text-[#FFF] transition-colors duration-300 group-hover:text-[#22222A]" style={{
                          fontFamily: '"Noto Sans Hebrew"',
                          fontSize: '24px',
                          fontWeight: 700,
                        }}>
                          ₪{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through -mt-1 group-hover:text-gray-500">
                            ₪{product.originalPrice}
                          </span>
                        )}
                      </div>

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
              </div>)
          }))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12" style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="ghost"
          onClick={() => setIsModalOpen(true)}
          className="w-[185px] h-[44px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border-2 border-[#D3D3D3] bg-white text-[#22222A] font-['Noto Sans Hebrew'] text-[16px] font-medium transition-all duration-300 hover:bg-[#7DE400] hover:border-[#A6FF4D] hover:text-white"
        >
          צפו בכל המוצרים
        </Button>
      </div>

      <ProductListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="מוצרים נבחרים"
        products={allFeatured}
      />
    </div>
  </section>;
};
export default FeaturedProducts;