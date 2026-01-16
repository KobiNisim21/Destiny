import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import API_BASE_URL from "@/config";

interface Product {
    _id?: string;
    id?: number | string;
    title?: string;
    name?: string;
    price: number;
    description: string;
    mainImage?: string;
    hoverImage?: string;
    images?: string[];
    image?: string;
    badge?: string;
    isNewArrival?: boolean;
    slug?: string;
}

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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
            <main className="flex-grow pt-24 pb-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-[#22222A] font-['Noto_Sans_Hebrew'] mb-4">כל הקולקציות</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">כל המוצרים האהובים במקום אחד. איכות ללא פשרות ועיצובים ייחודיים.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">טוען מוצרים...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 justify-items-center">
                            {products.map((product, index) => {
                                const displayImage = getImageUrl(product, false);
                                const hoverImage = getImageUrl(product, true);
                                const badgeText = product.badge || (product.isNewArrival ? "חדש!" : null);

                                return (
                                    <div key={product._id || product.id} className="group animate-slide-up" style={{
                                        animationDelay: `${index * 0.05}s`,
                                        width: '310px',
                                        height: '450px'
                                    }}>
                                        <div
                                            className="overflow-hidden h-full flex flex-col transition-all duration-300 relative group-hover:-translate-y-1 bg-[#202027] group-hover:bg-white shadow-[0_8px_18.7px_-7px_#9F19FF] group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(125,228,0,0.4)]"
                                            style={{
                                                borderRadius: '24px',
                                            }}>

                                            {/* Image Container */}
                                            <div className="relative overflow-hidden w-full group-hover:bg-[#D5D5F5]/30 transition-colors duration-300"
                                                style={{
                                                    height: '265px',
                                                    padding: '12px 18px',
                                                    borderRadius: '24px 24px 0 0',
                                                }}>
                                                <img src={displayImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 z-0" />
                                                {hoverImage && <img src={hoverImage} alt={getProductName(product)} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0" />}

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
                                                    }}>
                                                    {badgeText}
                                                </Badge>}
                                            </div>

                                            {/* Content */}
                                            <div className="w-full px-5 pb-[70px] flex flex-col flex-1 relative duration-300">
                                                <h3 className="mb-1 text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#7DE400] text-right font-bold text-xl mt-1">
                                                    {getProductName(product)}
                                                </h3>
                                                <p className="text-[#F2F2F2] transition-colors duration-300 group-hover:text-[#22222A] text-right text-sm font-light">
                                                    {product.description && product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                                                </p>

                                                <div className="flex items-center justify-between w-full absolute bottom-5 left-0 px-5">
                                                    <span className="text-[#FFF] transition-colors duration-300 group-hover:text-[#22222A] font-bold text-2xl">
                                                        ₪{product.price}
                                                    </span>
                                                    <Link to={getProductLink(product)}>
                                                        <Button size="sm" className="rounded-[14px] border border-[#9F19FF] bg-[#3C3C43] text-[#F2F2F2] hover:bg-[#7DE400] hover:border-[#A6FF4D] hover:text-white transition-all">
                                                            צפו במוצר
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
