import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "@/config";
import protestShirtImage from "@/assets/A9.png";
import protestShirtHoverImage from "@/assets/product-tshirt.jpg";

// Types
interface Product {
  _id?: string;
  id?: number | string;
  title?: string;
  name?: string;
  price: number;
  originalPrice?: number;
  description: string;
  images?: string[];
  image?: string;
  hoverImage?: string;
  category?: string;
  inStock?: boolean;
  isNewArrival?: boolean;
}

const DEFAULT_NEW_ARRIVAL: Product = {
  title: "Signature Hoodie",
  name: "Signature Hoodie",
  price: 99.00,
  description: "חולצת פרימיום בעיצוב ייחודי ובלעדי.",
  image: protestShirtImage,
  hoverImage: protestShirtHoverImage
};

const NewArrivals = () => {
  const [product, setProduct] = useState<Product | null>(DEFAULT_NEW_ARRIVAL);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        const data = await res.json();
        const newArrival = data.find((p: Product) => p.isNewArrival);

        if (newArrival) {
          setProduct(newArrival);
        } else if (data.length > 0) {
          setProduct(data[0]);
        }
        // If neither, we stick with DEFAULT_NEW_ARRIVAL
      } catch (error) {
        console.error("Failed to fetch new arrival, using default", error);
      }
    };

    fetchNewArrival();
  }, []);

  if (!product) return null; // Should not happen with default

  const displayImage = (product.images && product.images.length > 0)
    ? `${API_BASE_URL}${product.images[0]}`
    : (product.image || '');

  const hoverImage = (product.images && product.images.length > 1)
    ? `${API_BASE_URL}${product.images[1]}`
    : (product.hoverImage || displayImage || '');

  const productName = product.title || product.name || '';
  const productLink = product._id ? `/product/${product._id}` : '#';

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
        <div className="grid lg:grid-cols-2 items-center" style={{ gap: '200px' }}> {/* Requested Gap: Increased to 200px */}

          {/* Right - Product Card (First Position) */}
          <div className="relative animate-slide-up flex lg:justify-end justify-center">
            <div className="group" style={{
              width: '360px',
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
                  width: '360px'
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

                  <Badge className="relative z-10 font-bold px-3 py-1"
                    style={{
                      backgroundColor: '#9F19FF',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
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
                מוצרים שנחתו עכשיו
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
              פריטים חדשים.
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
              היו הראשונים להשיג את המוצר החדש ביותר. כמות מוגבלת זמינה - ברגע שהם נגמרים, הם נגמרים לתמיד!
            </p>

            {/* Feature List */}
            <div className="space-y-6 pt-4">

              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: '#E487E8' }}>
                  1
                </div>
                <div>
                  <h4 style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    מהדורות במהדורה מוגבלת
                  </h4>
                  <p style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 300
                  }}>
                    עיצובים בלעדיים שלא תמצאו בשום מקום אחר
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: '#F4CAB8' }}>
                  2
                </div>
                <div>
                  <h4 style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    חומרים איכותיים
                  </h4>
                  <p style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 300
                  }}>
                    בדים איכותיים לנוחות מרבית
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: '#F3A4E6' }}>
                  3
                </div>
                <div>
                  <h4 style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    משלוח מהיר
                  </h4>
                  <p style={{
                    color: '#4B5563',
                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                    fontSize: '16px',
                    fontWeight: 300
                  }}>
                    קבלו את הסחורה שלכם תוך 3-5 ימים
                  </p>
                </div>
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
                  הזמינו עכשיו
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
