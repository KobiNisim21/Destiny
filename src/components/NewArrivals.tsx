import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "@/config";
import { Product } from "./ProductListModal";
import { Skeleton } from "@/components/ui/skeleton";

// Types

const NewArrivals = ({ products: dbProducts = [] }: { products?: Product[] }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error("Failed to fetch content", error);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    if (dbProducts.length > 0 && content) {
      // Manual product selection: use the product ID from content settings
      if (content.newArrivalsProductId) {
        const selectedProduct = dbProducts.find((p: Product) => p._id === content.newArrivalsProductId);
        if (selectedProduct) {
          setProduct(selectedProduct);
          setLoading(false);
          return;
        }
      }
      // Fallback: find isNewArrival or first product
      const newArrival = dbProducts.find((p: Product) => p.isNewArrival);
      if (newArrival) {
        setProduct(newArrival);
      } else if (dbProducts.length > 0) {
        setProduct(dbProducts[0]);
      }
      setLoading(false);
    }
  }, [dbProducts, content]);

  if (loading) {
    return (
      <section
        className="relative w-full flex justify-center items-center"
        dir="rtl"
        id="new-arrivals-section"
        style={{
          backgroundColor: '#F5F2F8',
          padding: '31px 0',
          boxShadow: '0px 0px 15.2px 0px #8AFF00',
          zIndex: 10
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-32">
            {/* Skeleton Right (Image) */}
            <div className="relative flex lg:justify-end justify-center">
              <div style={{ width: '100%', maxWidth: '360px', height: '540px' }} className="rounded-[24px] overflow-hidden bg-white shadow-sm border border-gray-100 p-0">
                <Skeleton className="h-[350px] w-full" />
                <div className="p-5 flex flex-col gap-4">
                  <Skeleton className="h-8 w-3/4 ml-auto" />
                  <Skeleton className="h-4 w-full ml-auto" />
                  <div className="mt-8 flex justify-between items-center">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Left (Text) */}
            <div className="space-y-8 text-right">
              <Skeleton className="h-10 w-48 ml-auto rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-14 w-3/4 ml-auto" />
                <Skeleton className="h-14 w-1/2 ml-auto" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-full ml-auto" />
                <Skeleton className="h-6 w-5/6 ml-auto" />
              </div>
              <Skeleton className="h-16 w-full ml-auto rounded-xl" />
              <Skeleton className="h-12 w-48 ml-auto rounded-full mt-8" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) return null;

  const getImageSrc = (img?: string) => {
    if (!img) return '';
    if (img.startsWith('/uploads')) return `${API_BASE_URL}${img}`;
    return img;
  };

  const displayImage = getImageSrc(product.mainImage || (product.images && product.images[0]) || product.image);
  const hoverImage = getImageSrc(product.hoverImage || (product.images && product.images[1]) || displayImage);

  const productName = product.title || product.name || '';
  const productLink = product._id ? `/product/${product._id}` : '#';

  // Calculate remaining stock
  const totalStock = content?.newArrivalsStock ?? 100;
  const salesCount = (product as any).salesCount || 0;
  const remainingStock = Math.max(0, totalStock - salesCount);
  const stockLabel = content?.newArrivalsStockLabel || "חולצות";

  return (
    <section
      className="relative w-full flex justify-center items-center"
      dir="rtl"
      id="new-arrivals-section"
      style={{
        backgroundColor: '#F5F2F8',
        padding: '31px 0',
        boxShadow: '0px 0px 15.2px 0px #8AFF00', // The requested shadow
        zIndex: 10 // Ensure shadow is visible above other sections if needed
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-32">

          {/* Right - Product Card (First Position) */}
          <div className="relative animate-slide-up flex lg:justify-end justify-center">
            <Link to={productLink} className="group block" style={{
              width: '100%',
              maxWidth: '360px',
              textDecoration: 'none'
            }}>
              <div
                className="overflow-hidden flex flex-col relative bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  borderRadius: '24px',
                  height: '540px',
                  width: '100%'
                }}>

                {/* Image Container */}
                <div className="relative overflow-hidden w-full"
                  style={{
                    height: '350px',
                    flexShrink: 0,
                    padding: '12px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    borderRadius: '24px 24px 0 0',
                    backgroundColor: '#F5F0FA',
                  }}>
                  <img src={displayImage} alt={productName} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" />
                  <img src={hoverImage} alt={productName} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                  <Badge className="relative z-10 font-bold px-3 py-1 bg-[#9F19FF] text-white rounded-[20px] text-[12px] shadow-sm"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                    מוצר נבחר
                  </Badge>
                </div>

                {/* Content Container */}
                <div className="w-full px-5 py-4 flex flex-col flex-1 relative justify-start">

                  {/* Title */}
                  <h3 className="mb-1" style={{
                    color: '#22222A',
                    textAlign: 'right',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '24px',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    alignSelf: 'stretch',
                    marginTop: '4px'
                  }}>
                    {productName}
                  </h3>

                  {/* Description */}
                  <p style={{
                    color: '#22222A',
                    textAlign: 'right',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 300,
                    lineHeight: 'normal',
                    alignSelf: 'stretch',
                    marginTop: '8px'
                  }}>
                    {product.description && product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                  </p>

                  {/* Footer: Price & Button */}
                  <div className="flex items-center justify-between w-full absolute bottom-4 left-0 px-5">
                    <div className="flex flex-col items-start gap-0">
                      <span style={{
                        color: '#22222A',
                        fontFamily: '"Noto Sans Hebrew"',
                        fontSize: '28px',
                        fontWeight: 700,
                      }}>
                        ₪{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through -mt-1">
                          ₪{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-[120px] h-[40px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border border-[#22222A] bg-[#22222A] text-white font-['Noto_Sans_Hebrew'] text-[14px] font-normal transition-all duration-300 hover:bg-[#333] hover:border-[#333]"
                    >
                      צפו במוצר
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Left - Content (Swapped to Second Position) */}
          <div className="space-y-8 animate-fade-in text-right">

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              height: '39px',
              padding: '0 17px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '60px',
              background: '#FFF',
              boxShadow: '0px 5px 14px 0px rgba(0, 0, 0, 0.25)'
            }}>
              <Sparkles className="w-5 h-5 text-[#9F19FF]" />
              <span className="animate-fade-in-out" style={{
                color: '#EA9FEF',
                textAlign: 'right',
                fontFamily: '"Noto Sans Hebrew", sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 300,
                lineHeight: 'normal',
                position: 'relative',
                top: '-1px'
              }}>
                {content?.newArrivalsTagText || "מוצרים שנחתו עכשיו"}
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: '"Noto Sans Hebrew", sans-serif',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '109.725%',
              color: '#22222A'
            }}>
              {content?.newArrivalsTitle || "פריטים חדשים."}
              <br />
              <span style={{
                background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {productName}
              </span>
            </h2>

            {/* Subtitle / Description */}
            <p style={{
              color: '#4B5563',
              fontFamily: '"Noto Sans Hebrew", sans-serif',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 300,
              lineHeight: 'normal',
              textAlign: 'right'
            }}>
              {content?.newArrivalsSubtitle || "היו הראשונים להשיג את המוצר החדש ביותר. כמות מוגבלת זמינה - ברגע שהם נגמרים, הם נגמרים לתמיד!"}
            </p>

            {/* Stock Counter - Replaces Feature List */}
            <div className="pt-2">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '14px',
                direction: 'rtl',
              }}>
                {/* Right text: "נותרו רק" */}
                <span style={{
                  color: '#4B5563',
                  fontFamily: '"Noto Sans Hebrew", sans-serif',
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                  whiteSpace: 'nowrap',
                }}>
                  נותרו רק
                </span>

                {/* Number in circle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '72px',
                  height: '52px',
                  padding: '8px 18px',
                  borderRadius: '60px',
                  border: '2px solid #D1D5DB',
                  background: '#FFFFFF',
                }}>
                  <span style={{
                    color: '#22222A',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    lineHeight: '1',
                  }}>
                    {remainingStock}
                  </span>
                </div>

                {/* Left text: "חולצות אחרונות בלבד!" */}
                <span style={{
                  color: '#4B5563',
                  fontFamily: '"Noto Sans Hebrew", sans-serif',
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                  whiteSpace: 'nowrap',
                }}>
                  {stockLabel} אחרונות בלבד!
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link to={productLink}>
              <button style={{
                marginTop: '30px',
                display: 'flex',
                width: '184px',
                height: '44px',
                padding: '6px 22px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                borderRadius: '60px',
                background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                boxShadow: '0px 5px 14px 0px rgba(0, 0, 0, 0.25)',
                border: 'none',
                cursor: 'pointer'
              }}>
                <span style={{
                  color: '#FFF',
                  textAlign: 'right',
                  fontFamily: '"Noto Sans Hebrew", sans-serif',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  whiteSpace: 'nowrap'
                }}>
                  {content?.newArrivalsButtonText || "מהרו להזמין"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
                  <path d="M7.25299 14.2563C7.49678 13.9977 7.4974 13.5777 7.25299 13.3191L2.13183 7.88804H19.3749C19.72 7.88804 20 7.59136 20 7.22513C20 6.8589 19.7199 6.56223 19.3749 6.56223H2.13183L7.25237 1.13116C7.49678 0.872563 7.49678 0.452539 7.25237 0.193945C7.00796 -0.0646484 6.6123 -0.0646484 6.36852 0.193945L0.180969 6.7565C-0.0603229 7.01247 -0.0603229 7.43839 0.180969 7.69437L6.36852 14.2569C6.61293 14.5156 7.00858 14.5156 7.25299 14.2563C7.00858 14.5156 7.49678 13.9977 7.25299 14.2563Z" fill="white" />
                </svg>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
