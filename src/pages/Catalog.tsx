import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import API_BASE_URL from "@/config";

interface Product {
    _id?: string;
    id?: number | string;
    title?: string;
    name?: string;
    price: number;
    originalPrice?: number;
    description: string;
    mainImage?: string;
    hoverImage?: string;
    images?: string[];
    image?: string;
    badge?: string;
    isNewArrival?: boolean;
    customLabel?: string;
    slug?: string;
    inStock?: boolean;
}

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getImageUrl = (product: Product, isHover: boolean = false) => {
        if (isHover) {
            if (product.hoverImage) return `${API_BASE_URL}${product.hoverImage}`;
            if (product.images && product.images[1]) return `${API_BASE_URL}${product.images[1]}`;
            return "";
        } else {
            if (product.mainImage) return `${API_BASE_URL}${product.mainImage}`;
            if (product.images && product.images[0]) return `${API_BASE_URL}${product.images[0]}`;
            return product.image || "";
        }
    };

    const getProductName = (p: Product) => p.title || p.name || '';
    const getProductLink = (p: Product) => p._id ? `/product/${p._id}` : (p.slug ? `/product/${p.slug}` : '#');

    return (
        <div className="min-h-screen flex flex-col" dir="rtl">
            <Navbar />
            <main className="flex-grow pt-40 pb-16" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 animate-fade-in" style={{ textAlign: 'center' }}>
                        <h1 style={{
                            color: '#22222A',
                            fontFamily: '"Noto Sans Hebrew", sans-serif',
                            fontSize: '48px',
                            fontWeight: 700,
                            lineHeight: 'normal',
                            marginBottom: '3px'
                        }}>
                            כל הקולקציות
                        </h1>
                        <p className="max-w-2xl mx-auto" style={{
                            color: '#797986',
                            fontFamily: '"Noto Sans Hebrew", sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: 'normal',
                            textAlign: 'center'
                        }}>
                            כל המוצרים האהובים במקום אחד. איכות ללא פשרות ועיצובים ייחודיים.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-items-center">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-items-center">
                            {products.map((product, index) => {
                                const displayImage = getImageUrl(product, false);
                                const hoverImage = getImageUrl(product, true);

                                // Determine badge text - same logic as FeaturedProducts
                                let badgeText = product.customLabel || product.badge;
                                if (!badgeText && product.isNewArrival) badgeText = "חדש!";

                                return (
                                    <Link key={product._id || product.id} to={getProductLink(product)} className="group animate-slide-up block" style={{
                                        animationDelay: `${index * 0.05}s`,
                                        width: '100%',
                                        maxWidth: '350px',
                                        height: '450px',
                                        textDecoration: 'none'
                                    }}>
                                        <div
                                            className="overflow-hidden h-full flex flex-col transition-all duration-300 relative shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '2px',
                                                borderRadius: '24px',
                                                width: '100%',
                                                background: '#FFFFFF'
                                            }}>

                                            {/* Image Container */}
                                            <div className="relative overflow-hidden w-full"
                                                style={{
                                                    height: '265px',
                                                    flexShrink: 0,
                                                    padding: '12px 18px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    gap: '10px',
                                                    borderRadius: '24px 24px 0 0',
                                                    backgroundColor: '#F5F0FA',
                                                }}>

                                                {/* Default Image */}
                                                <img src={displayImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 z-0" />
                                                {/* Hover Image */}
                                                {hoverImage && <img src={hoverImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0" />}

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

                                                {badgeText && <Badge className="relative z-10 font-bold px-3 py-1 bg-[#9F19FF] text-white rounded-[20px] text-[12px] shadow-sm"
                                                    style={{
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}>
                                                    {badgeText}
                                                </Badge>}
                                            </div>

                                            {/* Content Container */}
                                            <div className="w-full px-5 pb-[70px] flex flex-col flex-1 relative">
                                                {/* Title */}
                                                <h3 className="mb-1" style={{
                                                    color: '#22222A',
                                                    textAlign: 'right',
                                                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    lineHeight: 'normal',
                                                    alignSelf: 'stretch',
                                                    marginTop: '4px'
                                                }}>
                                                    {getProductName(product)}
                                                </h3>

                                                {/* Description */}
                                                <p className="flex-1" style={{
                                                    color: '#22222A',
                                                    textAlign: 'right',
                                                    fontFamily: '"Noto Sans Hebrew", sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: 300,
                                                    lineHeight: 'normal',
                                                    alignSelf: 'stretch'
                                                }}>
                                                    {product.description && product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                                                </p>

                                                {/* Footer: Price & Button */}
                                                <div className="flex items-center justify-between w-full absolute bottom-5 left-0 px-5">
                                                    <div className="flex flex-col items-start gap-0">
                                                        <span style={{
                                                            color: '#22222A',
                                                            fontFamily: '"Noto Sans Hebrew"',
                                                            fontSize: '24px',
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
                                                        className="w-[107px] h-[36px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border border-[#22222A] bg-[#22222A] text-white font-['Noto_Sans_Hebrew'] text-[14px] font-normal transition-all duration-300 hover:bg-[#333] hover:border-[#333]"
                                                    >
                                                        צפו במוצר
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Catalog;
