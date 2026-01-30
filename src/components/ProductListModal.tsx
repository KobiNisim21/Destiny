import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
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
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#F9F5FF] border-none" dir="rtl">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-bold text-center text-[#22222A] font-['Noto_Sans_Hebrew']">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center pb-8">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center text-lg text-gray-500 py-12">
                            לא נמצאו מוצרים בקטגוריה זו כרגע.
                        </div>
                    ) : (
                        products.map((product, index) => {
                            const displayImage = getImageUrl(product, false);
                            const hoverImage = getImageUrl(product, true);
                            const badgeText = getProductBadge(product);

                            return (
                                <div key={product._id || product.id} className="group animate-slide-up" style={{
                                    animationDelay: `${index * 0.05}s`,
                                    width: '100%',
                                    maxWidth: '310px',
                                    height: '450px'
                                }}>
                                    <div
                                        className="overflow-hidden h-full flex flex-col transition-all duration-300 relative group-hover:-translate-y-1 bg-[#202027] group-hover:bg-white shadow-md hover:shadow-xl"
                                        style={{
                                            borderRadius: '24px',
                                            height: '450px'
                                        }}>

                                        {/* Image Container */}
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
                                                backgroundColor: '#FFFFFF', // Default white for modal consistent look
                                            }}>

                                            <img src={displayImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 z-0" />
                                            <img src={hoverImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0" />

                                            {/* Cart Icon (Hover) */}
                                            <Link to={getProductLink(product)} className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform" style={{ backgroundColor: '#7DE400' }}>
                                                    <ShoppingBag className="w-5 h-5 text-white" />
                                                </div>
                                            </Link>

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
                                        <div className="w-full px-5 pb-[20px] pt-4 flex flex-col flex-1 relative duration-300">

                                            {/* Title */}
                                            <h3 className="mb-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#7DE400]" style={{
                                                textAlign: 'right',
                                                fontFamily: '"Noto Sans Hebrew", sans-serif',
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                lineHeight: '1.2'
                                            }}>
                                                {getProductName(product)}
                                            </h3>

                                            {/* Description */}
                                            <p className="flex-1 text-[#F2F2F2]/80 transition-colors duration-300 group-hover:text-[#22222A]/80 text-sm mt-2 line-clamp-2" style={{
                                                textAlign: 'right',
                                                fontFamily: '"Noto Sans Hebrew", sans-serif',
                                            }}>
                                                {product.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-white/10 group-hover:border-black/5">
                                                <div className="flex flex-col items-start gap-0">
                                                    <span className="text-white transition-colors duration-300 group-hover:text-[#22222A] font-bold text-xl">
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
                                                        className="h-9 px-4 rounded-xl border border-[#9F19FF] bg-[#3C3C43] text-white hover:bg-[#7DE400] hover:border-[#A6FF4D] hover:text-white transition-all duration-300 text-xs"
                                                    >
                                                        צפו במוצר
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductListModal;
