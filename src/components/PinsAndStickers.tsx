import { ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import ProductListModal, { Product } from "./ProductListModal";
import { useCart } from "@/context/CartContext";
import API_BASE_URL from "@/config";

// Images for Pins and Stickers
// Reusing existing assets to match the screenshot provided
import whiteHeadphonesImage from "@/assets/product-real-headphones.png";
import pinkHeadphonesImage from "@/assets/product-cartoon-headphones.png";
import catEarsImage from "@/assets/A5.png"; // Reusing A5 (Cat Ears)
import stickerImage from "@/assets/product-crown.png"; // Placeholder for Sticker (Purple item/Crown)

// Placeholder Hover Images
import capHoverImage from "@/assets/product-cap.jpg";
import toteHoverImage from "@/assets/product-totebag.jpg";
import tshirtHoverImage from "@/assets/A2.png";
import hoodieHoverImage from "@/assets/A3.png";

const DEFAULT_PINS: Product[] = [
    {
        id: 201,
        slug: "pin-1",
        name: "Classic Cap", // Placeholder text matching screenshot
        price: 99.00,
        image: whiteHeadphonesImage,
        hoverImage: capHoverImage,
        description: "כובע ממותק מיוחד במינו עם איכות מוצר מהגובהה ביותר בשוק."
    },
    {
        id: 202,
        slug: "pin-2",
        name: "Canvas Tote Bag", // Placeholder text matching screenshot
        price: 99.00,
        image: pinkHeadphonesImage,
        hoverImage: toteHoverImage,
        badge: "מהדורה מוגבלת",
        description: "גרסה מוגבלת בלעדית עם פרטים הולוגרפיים"
    },
    {
        id: 203,
        slug: "pin-3",
        name: "Essential Tee", // Placeholder text matching screenshot
        price: 80.00,
        image: catEarsImage,
        hoverImage: tshirtHoverImage,
        badge: "חדש!",
        description: "חולצת טי נוחה גדולה במיוחד עם וייבים מוטיבציוניים"
    },
    {
        id: 204,
        slug: "pin-4",
        name: "Signature Hoodie", // Placeholder text matching screenshot
        price: 99.00,
        image: stickerImage,
        hoverImage: hoodieHoverImage,
        badge: "מוצר נמכר",
        description: "קפוצ'ון פרימיום רך במיוחד עם לוגו דסטיני בלעדי"
    }
];

const PinsAndStickers = ({ products: dbProducts = [] }: { products?: Product[] }) => {
    const [displaySlots, setDisplaySlots] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [allPins, setAllPins] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (dbProducts.length > 0) {
            const pins = dbProducts.filter((p: Product) => p.section === 'pins');
            setAllPins(pins);

            if (pins.length > 0) {
                // Map to slots
                setDisplaySlots(pins.slice(0, 4));
            }
            setLoading(false);
        }
    }, [dbProducts]);

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
        if (p.customLabel) return p.customLabel;
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
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 0px 15.2px 0px #8AFF00',
                    zIndex: 10
                }}
            >
                <div className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Header */}
                        <div className="mb-12 animate-fade-in text-center">
                            <h2 style={{
                                color: '#22222A',
                                fontFamily: '"Noto Sans Hebrew", sans-serif',
                                fontSize: '48px',
                                fontWeight: 700,
                                marginBottom: '3px'
                            }}>
                                סיכות ומדבקות
                            </h2>
                            <p className="max-w-2xl mx-auto" style={{
                                color: '#797986',
                                fontFamily: '"Noto Sans Hebrew", sans-serif',
                                fontSize: '16px',
                                fontWeight: 400,
                                textAlign: 'center'
                            }}>
                                הציגו את האישיות שלכם וצרו אמירה נועזת עם עיצוב אוזני החתלתול האייקוני ביותר בגיימינג
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
                            {loading ? (
                                // Skeleton Loader
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-[310px] h-[450px] rounded-[24px] overflow-hidden bg-white shadow-sm border border-gray-100">
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
                                displaySlots.map((product, index) => {
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

                                                {/* Image Container - White BG */}
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
                                                        backgroundColor: '#FFFFFF',
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
                                                                image: getImageUrl(product, 0)
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

                                                    {/* Dark BG base to allow hover light */}
                                                    <div className="absolute inset-0 bg-[#202027] group-hover:bg-white transition-colors duration-300 -z-10" />

                                                    {/* Title */}
                                                    <h3 className="mb-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#7DE400]" style={{
                                                        textAlign: 'right',
                                                        fontFamily: '"Noto Sans Hebrew", sans-serif',
                                                        fontSize: '20px',
                                                        fontWeight: 700,
                                                        marginTop: '4px'
                                                    }}>
                                                        {getProductName(product)}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="flex-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#22222A]" style={{
                                                        textAlign: 'right',
                                                        fontFamily: '"Noto Sans Hebrew", sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: 200
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
                                })
                            )}
                        </div>

                        {/* View All Button */}
                        <div className="text-center mt-12" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                variant="ghost"
                                className="w-[185px] h-[44px] px-[18px] py-[4px] flex flex-col justify-center items-center gap-[10px] rounded-[14px] border-2 border-[#D3D3D3] bg-white text-[#22222A] font-['Noto Sans Hebrew'] text-[16px] font-medium transition-all duration-300 hover:bg-[#7DE400] hover:border-[#A6FF4D] hover:text-white"
                            >
                                צפו בכל הסיכות ומדבקות
                            </Button>
                        </div>

                    </div>
                </div>
            </section>

            <ProductListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="סיכות ומדבקות"
                products={allPins}
            />
        </>
    );
};

export default PinsAndStickers;
