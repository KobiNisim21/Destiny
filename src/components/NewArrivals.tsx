import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "@/config";
import protestShirtImage from "@/assets/A9.png";
import protestShirtHoverImage from "@/assets/product-tshirt.jpg";
import { Product } from "./ProductListModal";
import { Skeleton } from "@/components/ui/skeleton";

// Types

const DEFAULT_NEW_ARRIVAL: Product = {
  title: "Signature Hoodie",
  name: "Signature Hoodie",
  price: 99.00,
  description: "חולצת פרימיום בעיצוב ייחודי ובלעדי.",
  image: protestShirtImage,
  hoverImage: protestShirtHoverImage
};

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
    if (dbProducts.length > 0) {
      const newArrival = dbProducts.find((p: Product) => p.isNewArrival);
      if (newArrival) {
        setProduct(newArrival);
      } else if (dbProducts.length > 0) {
        setProduct(dbProducts[0]);
      }
      setLoading(false);
    }
    // If dbProducts is empty but we've waited "long enough"? 
    // Actually, usually dbProducts starts empty then populates. 
    // If it never populates (network error), loading stays true. 
    // This is acceptable for now.
  }, [dbProducts]);

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
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right space-y-2">
                    <Skeleton className="h-6 w-32 ml-auto" />
                    <Skeleton className="h-4 w-48 ml-auto" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right space-y-2">
                    <Skeleton className="h-6 w-32 ml-auto" />
                    <Skeleton className="h-4 w-48 ml-auto" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
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

  const features = content?.newArrivalsFeatures && content.newArrivalsFeatures.length > 0 ? content.newArrivalsFeatures : [
    { title: "מהדורות במהדורה מוגבלת", description: "עיצובים בלעדיים שלא תמצאו בשום מקום אחר" },
    { title: "חומרים איכותיים", description: "בדים איכותיים לנוחות מרבית" },
    { title: "משלוח מהיר", description: "קבלו את הסחורה שלכם תוך 3-5 ימים" }
  ];

  const featureColors = ['#E487E8', '#F4CAB8', '#F3A4E6'];

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
            <div className="group" style={{
              width: '100%',
              maxWidth: '360px',
              height: '540px'
            }}>
              <div
                className="overflow-hidden h-full flex flex-col relative bg-white shadow-[0_8px_18.7px_-12px_rgba(239,73,252,0.49)] group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(125,228,0,0.4)] transition-all duration-300 group-hover:-translate-y-1"
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
                <div className="relative overflow-hidden w-full group-hover:bg-[#D5D5F5]/30"
                  style={{
                    height: '350px',
                    flexShrink: 0,
                    padding: '12px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    borderRadius: '24px 24px 0 0',
                    backgroundColor: '#FFFFFF',
                  }}>
                  <img src={displayImage} alt={productName} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" />
                  <img src={hoverImage} alt={productName} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                  <Badge className="relative z-10 font-bold px-3 py-1 bg-[#9F19FF] text-white rounded-[20px] text-[12px] shadow-sm transition-colors duration-300 group-hover:bg-[#7DE400]"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                    חדש
                  </Badge>
                </div>

                {/* Content Container */}
                <div className="w-full px-5 pb-[40px] flex flex-col flex-1 relative justify-start pt-2">

                  {/* Title */}
                  <h3 className="mb-1 text-[#22222A] group-hover:text-[#7DE400] transition-colors duration-300" style={{
                    textAlign: 'right',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '24px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    alignSelf: 'stretch',
                    marginTop: '4px'
                  }}>
                    {productName}
                  </h3>

                  {/* Description */}
                  <p className="text-[#22222A] group-hover:text-[#4B5563] transition-colors duration-300" style={{
                    textAlign: 'right',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 200,
                    lineHeight: 'normal',
                    alignSelf: 'stretch',
                    marginTop: '8px'
                  }}>
                    {product.description && product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                  </p>

                  {/* Footer: Price & Button */}
                  <div className="flex items-center justify-between w-full absolute bottom-4 left-0 px-5">
                    <div className="flex flex-col items-start gap-0">
                      <span className="text-[#22222A] transition-colors duration-300" style={{
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

                    <Link to={productLink}>
                      <Button
                        size="sm"
                        className="w-[120px] h-[40px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border border-[#22222A] bg-white text-[#22222A] group-hover:bg-[#7DE400] group-hover:text-white group-hover:border-white font-['Noto_Sans_Hebrew'] text-[14px] font-normal transition-all duration-300"
                      >
                        צפו במוצר
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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

            {/* Feature List */}
            <div className="space-y-6 pt-4">

              {features.map((feature: any, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: featureColors[index % featureColors.length] }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 style={{
                      color: '#4B5563',
                      fontFamily: '"Noto Sans Hebrew", sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}>
                      {feature.title}
                    </h4>
                    <p style={{
                      color: '#4B5563',
                      fontFamily: '"Noto Sans Hebrew", sans-serif',
                      fontSize: '16px',
                      fontWeight: 300
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

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
                  {content?.newArrivalsButtonText || "הזמינו עכשיו"}
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
