import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingBag, Plus, Minus, Star, Truck, Shield, Award, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";

// Static Images (Need to import all used images)
import realHeadphonesImage from "@/assets/product-real-headphones.png";
import cartoonHeadphonesImage from "@/assets/product-cartoon-headphones.png";
import butterfliesImage from "@/assets/product-butterflies.png";
import crownImage from "@/assets/product-crown.png";
import capHoverImage from "@/assets/product-cap.jpg";
import toteHoverImage from "@/assets/product-totebag.jpg";
import tshirtHoverImage from "@/assets/A2.png";
import hoodieHoverImage from "@/assets/A3.png";

import trinket1Image from "@/assets/A5.png";
import trinket2Image from "@/assets/A6.png";
import trinket3Image from "@/assets/A7.png";
import trinket4Image from "@/assets/A8.png";

interface Product {
  _id?: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category?: string;
  inStock: boolean;
  slug?: string;
  faq?: { question: string; answer: string }[];
}

// Static Data Dictionary
const STATIC_PRODUCTS: Record<string, Product> = {
  // Featured
  "cap": {
    title: "Classic Cap",
    price: 119.99,
    images: [realHeadphonesImage, capHoverImage],
    description: "כובע ממותק מיוחד במינו עם איכות מוצר מהגובהה ביותר בשוק.",
    inStock: true
  },
  "totebag": {
    title: "Canvas Tote Bag",
    price: 99.99,
    images: [cartoonHeadphonesImage, toteHoverImage],
    description: "גרסה מוגבלת בלעדית עם פרטים הולוגרפיים",
    inStock: true
  },
  "tshirt": {
    title: "Essential Tee",
    price: 129.99,
    images: [butterfliesImage, tshirtHoverImage],
    description: "חולצת טי נוחה גדולה במיוחד עם וייבים מוטיבציוניים",
    inStock: true
  },
  "hoodie": {
    title: "Signature Hoodie",
    price: 299.99,
    images: [crownImage, hoodieHoverImage],
    description: "קפוצ'ון פרימיום רך במיוחד עם לוגו דסטיני בלעדי",
    inStock: true
  },
  // Trinkets
  "trinket-1": {
    title: "Cat Ears Attachment",
    price: 49.99,
    images: [trinket1Image, capHoverImage],
    description: "תוספת אוזני חתול לאוזניות, מתאים לכל סוגי האוזניות.",
    inStock: true
  },
  "trinket-2": {
    title: "Neon Glow Kit",
    price: 79.99,
    images: [trinket2Image, toteHoverImage],
    description: "ערכת תאורה ניאון לאוזניות לשדרוג הסטייל הגיימינג שלך.",
    inStock: true
  },
  "trinket-3": {
    title: "Custom Plates",
    price: 39.99,
    images: [trinket3Image, tshirtHoverImage],
    description: "פלטות צד מתחלפות בעיצובים מרהיבים לאוזניות.",
    inStock: true
  },
  "trinket-4": {
    title: "Cable Charm",
    price: 19.99,
    images: [trinket4Image, hoodieHoverImage],
    description: "תכשיט לכבל האוזניות/מטען להוספת טאץ' אישי.",
    inStock: true
  },
  // Pins
  "pin-1": {
    title: "Classic Cap",
    price: 99.00,
    images: [realHeadphonesImage, capHoverImage],
    description: "כובע ממותק מיוחד במינו עם איכות מוצר מהגובהה ביותר בשוק.",
    inStock: true
  },
  "pin-2": {
    title: "Canvas Tote Bag",
    price: 99.00,
    images: [cartoonHeadphonesImage, toteHoverImage],
    description: "גרסה מוגבלת בלעדית עם פרטים הולוגרפיים",
    inStock: true
  },
  "pin-3": {
    title: "Essential Tee",
    price: 80.00,
    images: [butterfliesImage, tshirtHoverImage],
    description: "חולצת טי נוחה גדולה במיוחד עם וייבים מוטיבציוניים",
    inStock: true
  },
  "pin-4": {
    title: "Signature Hoodie",
    price: 99.00,
    images: [crownImage, hoodieHoverImage],
    description: "קפוצ'ון פרימיום רך במיוחד עם לוגו דסטיני בלעדי",
    inStock: true
  }
};

const ProductPage = () => {
  const { productId } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const displayImages = product?.images || [];

  useEffect(() => {
    const fetchProduct = async () => {
      // 1. Check if it's a known static slug FIRST
      if (productId && STATIC_PRODUCTS[productId]) {
        setProduct(STATIC_PRODUCTS[productId]);
        setLoading(false);
        return;
      }

      // 2. Try fetching from API (Dynamic Product)
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        // If API fails, we could show error, but we already handled static above.
        // If it's not static and not in DB, it's a 404.
        toast({ title: "שגיאה", description: "לא ניתן לטעון את המוצר", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };
  const nextImage = () => {
    if (displayImages.length === 0) return;
    setSelectedImageIndex(prev => (prev + 1) % displayImages.length);
  };
  const prevImage = () => {
    if (displayImages.length === 0) return;
    setSelectedImageIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };
  const getFeatureIcon = (icon: string) => {
    // Basic implementation for now, could be dynamic later
    switch (icon) {
      case "truck":
        return <Truck className="w-8 h-8" />;
      case "shield":
        return <Shield className="w-8 h-8" />;
      case "award":
        return <Award className="w-8 h-8" />;
      default:
        return <Shield className="w-8 h-8" />;
    }
  };

  const defaultFeatures = [{
    icon: "truck",
    title: "משלוחים לכל הארץ",
    description: "משלוח מהיר בחינם ברכישה מעל ₪349"
  }, {
    icon: "shield",
    title: "איכות מובטחת",
    description: "חומרים איכותיים לנוחות מקסימלית"
  }, {
    icon: "award",
    title: "עיצוב בלעדי",
    description: "מוצרים מקוריים מבית דסטיני"
  }];

  const defaultFaqs = (product?.faq && product.faq.length > 0) ? product.faq : [{
    question: "מה הגדלים הזמינים?",
    answer: "התייעצו בטבלת המידות שלנו בדף המוצר או פנו לשירות הלקוחות."
  }, {
    question: "כיצד לשמור על המוצר?",
    answer: "מומלץ לכבס לפי ההוראות על התווית, בדרך כלל כביסה עדינה במים קרים."
  }, {
    question: "מהי מדיניות ההחזרות?",
    answer: "ניתן להחזיר מוצר חדש באריזתו המקורית תוך 14 יום."
  }];

  // Helper to determine image source (Static vs DB)
  const getImageSrc = (img: string) => {
    if (img.startsWith('/uploads') || img.startsWith('http')) {
      return img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
    }
    return img; // Static import
  };

  if (loading) return <div className="text-center py-20">טוען...</div>;
  if (!product) return <div className="text-center py-20">המוצר לא נמצא</div>;

  return <div className="min-h-screen bg-background" dir="rtl">
    <Navbar />

    <main className="container mx-auto px-4 py-12 pt-32">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          דף הבית
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* Right Side - Product Info (appears first in RTL) */}
        <div className="order-2 lg:order-1 flex flex-col">
          {/* Title & Rating */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < 5 ? 'fill-[#7DE400] text-[#7DE400]' : 'text-muted-foreground'}`} />)}
            </div>
            <span className="font-medium text-[#7ee600]">חמישה כוכבים</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </p>


          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-foreground">
              ₪{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                ₪{product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% הנחה
              </span>
            )}
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center gap-4 mb-8">
            <Button className="flex-1 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-3" disabled={!product.inStock}>
              <ShoppingBag className="w-5 h-5" />
              {product.inStock ? 'הוספה לעגלה' : 'אזל מהמלאי'}
            </Button>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-[#7DE400] text-[#7DE400] hover:bg-[#7DE400] hover:text-black" onClick={() => handleQuantityChange(1)}>
                <Plus className="w-5 h-5" />
              </Button>
              <div className="w-16 h-12 flex items-center justify-center border-2 border-muted rounded-lg text-xl font-bold">
                {quantity}
              </div>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 border-[#7DE400] text-[#7DE400] hover:bg-[#7DE400] hover:text-black" onClick={() => handleQuantityChange(-1)}>
                <Minus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-8"></div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {defaultFeatures.map((feature, index) => <div key={index} className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                {getFeatureIcon(feature.icon)}
              </div>
              <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>)}
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {defaultFaqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
              <AccordionTrigger className="text-right font-bold text-foreground hover:text-primary py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>)}
          </Accordion>
        </div>

        {/* Left Side - Image Gallery */}
        <div className="order-1 lg:order-2">
          {/* Main Image */}
          <div className="relative bg-secondary/20 rounded-3xl overflow-hidden mb-4 aspect-square">
            {displayImages[selectedImageIndex] &&
              <img src={getImageSrc(displayImages[selectedImageIndex])} alt={product.title} className="w-full h-full object-cover" />
            }
          </div>

          {/* Thumbnails */}
          <div className="relative flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full" onClick={nextImage} disabled={displayImages.length <= 1}>
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="flex gap-3 overflow-hidden flex-1 justify-center">
              {displayImages.map((image, index) => <button key={index} onClick={() => setSelectedImageIndex(index)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-primary shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={getImageSrc(image)} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
              </button>)}
            </div>

            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full" onClick={prevImage} disabled={displayImages.length <= 1}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>;
};
export default ProductPage;