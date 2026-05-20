import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import API_BASE_URL from "@/config";

// Reusing Product interface from other files or improved version
export interface Product {
    _id?: string;
    id?: number | string;
    title?: string; // DB
    name?: string; // Static
    price: number;
    originalPrice?: number;
    description: string;
    // DB Fields
    mainImage?: string;
    hoverImage?: string;
    galleryImages?: string[];
    // Legacy/Static
    images?: string[];
    image?: string; // Static
    hoverImageStatic?: string; // Static (renamed to avoid conflict if both exist, though we usually map)
    category?: string;
    inStock?: boolean;
    isNewArrival?: boolean;
    section?: string;
    displaySlot?: number | null;
    slug?: string;
    badge?: string; // Static
    customLabel?: string;
}

interface ProductListModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    products: Product[];
}

const ProductListModal = ({ isOpen, onClose, title, products }: ProductListModalProps) => {
    const { addToCart } = useCart();

    const getImageUrl = (product: Product, isHover: boolean = false) => {
        // 1. Explicit DB Fields (Preferred)
        if (isHover) {
            if (product.hoverImage && product.hoverImage.startsWith('http') === false && product.hoverImage.startsWith('/') === false) return product.hoverImage; // Handle static if mapped to this field

            if (product.hoverImage) return `${API_BASE_URL}${product.hoverImage}`;
            return '';
        } else {
            if (product.mainImage) return `${API_BASE_URL}${product.mainImage}`;
        }

        // 2. Legacy DB Fields (images array)
        if (product.images && product.images.length > 0) {
            if (isHover) {
                return product.images[1] ? `${API_BASE_URL}${product.images[1]}` : '';
            }
            return `${API_BASE_URL}${product.images[0]}`;
        }

        // 3. Static Products (Handling mixed field naming from parent components)
        // Note: In FeaturedProducts we have 'image' and 'hoverImage' properties for static too.
        // 'product' here comes from parent state, so check what fields it has.
        if (isHover) {
            // Check for static hover image (which might be in 'hoverImage' property if passed from static data)
            // If it's a URL/path...
            if (product.hoverImage && !product.hoverImage.startsWith('/uploads')) return product.hoverImage;
            return '';
        }
        return product.image || '';
    };

    const getProductName = (p: Product) => p.title || p.name || '';
    const getProductLink = (p: Product) => p._id ? `/product/${p._id}` : (p.slug ? `/product/${p.slug}` : '#');
    const getProductBadge = (p: Product) => {
        if (p.customLabel) return p.customLabel;
        if (p.badge) return p.badge;
        if (p.isNewArrival) return "חדש";
        if (!p.inStock && p.inStock !== undefined) return "אזל מהמלאי";
        return null;
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[90vh] max-h-[90vh] flex flex-col bg-[#F9F5FF] border-none p-0 overflow-hidden" dir="rtl">
                <DialogHeader className="p-6 pb-2 mb-0 shrink-0 relative z-10 bg-[#F9F5FF]">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-black/5 transition-colors z-50"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-[#22222A]" />
                    </button>
                    <DialogTitle className="text-3xl font-bold text-center text-[#22222A] font-['Noto_Sans_Hebrew']">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-items-center pb-8">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center text-lg text-gray-500 py-12">
                                לא נמצאו מוצרים בקטגוריה זו כרגע.
                            </div>
                        ) : (
                            products.map((product, index) => {
                                const displayImage = getImageUrl(product, false);
                                const hoverImage = getImageUrl(product, true);

                                // Determine badge text - same logic as FeaturedProducts
                                let badgeText = product.customLabel || product.badge;
                                if (!badgeText && product.isNewArrival) badgeText = "חדש!";
                                if (!badgeText && !product.inStock && product.inStock !== undefined) badgeText = "אזל מהמלאי";

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
                            })
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductListModal;

