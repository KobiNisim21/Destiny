import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingBag, Plus, Minus, Star, Truck, Shield, Award, ChevronLeft, ChevronRight } from "lucide-react";
// Actually I need to keep imports as they were, just changing paths
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productHoodie from "@/assets/product-crown.png";
import productTshirt from "@/assets/product-butterflies.png";
import productCap from "@/assets/product-real-headphones.png";
import productTotebag from "@/assets/product-cartoon-headphones.png";
const products = {
  "hoodie": {
    id: "hoodie",
    name: "הודי דסטיני פרימיום",
    description: "הודי איכותי מכותנה אורגנית 100% עם הדפס ייחודי של Destiny. בד רך ונעים, מתאים לכל עונות השנה. עיצוב מודרני עם תשומת לב לפרטים הקטנים.",
    price: 299,
    rating: 5,
    reviews: 12,
    images: [productHoodie, productTshirt, productCap, productTotebag],
    features: [{
      icon: "truck",
      title: "משלוחים לכל הארץ",
      description: "משלוח מהיר בחינם ברכישה מעל ₪349"
    }, {
      icon: "shield",
      title: "איכות מובטחת",
      description: "כותנה אורגנית 100% - נוחות מקסימלית"
    }, {
      icon: "award",
      title: "עיצוב בלעדי",
      description: "הדפסים ייחודיים בלעדיים לדסטיני"
    }],
    faqs: [{
      question: "מה הגדלים הזמינים?",
      answer: "המוצר זמין בגדלים S, M, L, XL, XXL. מומלץ להתייעץ עם טבלת המידות באתר."
    }, {
      question: "כיצד לשמור על המוצר?",
      answer: "מומלץ לכבס במים קרים, לא להשתמש במייבש, ולגהץ בחום נמוך."
    }, {
      question: "מהי מדיניות ההחזרות?",
      answer: "ניתן להחזיר את המוצר עד 14 יום מיום הקבלה, כל עוד הוא במצב חדש עם התוויות."
    }]
  },
  "tshirt": {
    id: "tshirt",
    name: "חולצת טי דסטיני קלאסית",
    description: "חולצת טי נוחה ואיכותית עם לוגו Destiny המיתולוגי. בד כותנה רך במיוחד, גזרה נוחה שמתאימה לכולם.",
    price: 149,
    rating: 5,
    reviews: 8,
    images: [productTshirt, productHoodie, productCap, productTotebag],
    features: [{
      icon: "truck",
      title: "משלוחים לכל הארץ",
      description: "משלוח מהיר בחינם ברכישה מעל ₪349"
    }, {
      icon: "shield",
      title: "איכות מובטחת",
      description: "כותנה רכה במיוחד - נוחות יומיומית"
    }, {
      icon: "award",
      title: "עיצוב בלעדי",
      description: "הדפסים ייחודיים בלעדיים לדסטיני"
    }],
    faqs: [{
      question: "מה הגדלים הזמינים?",
      answer: "המוצר זמין בגדלים S, M, L, XL, XXL. מומלץ להתייעץ עם טבלת המידות באתר."
    }, {
      question: "כיצד לשמור על המוצר?",
      answer: "מומלץ לכבס במים קרים, לא להשתמש במייבש, ולגהץ בחום נמוך."
    }, {
      question: "מהי מדיניות ההחזרות?",
      answer: "ניתן להחזיר את המוצר עד 14 יום מיום הקבלה, כל עוד הוא במצב חדש עם התוויות."
    }]
  }
};
const ProductPage = () => {
  const {
    productId
  } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const product = products[productId as keyof typeof products] || products.hoodie;
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };
  const nextImage = () => {
    setSelectedImage(prev => (prev + 1) % product.images.length);
  };
  const prevImage = () => {
    setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
  };
  const getFeatureIcon = (icon: string) => {
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
  return <div className="min-h-screen bg-background" dir="rtl">
    <Navbar />

    <main className="container mx-auto px-4 py-12 pt-32">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          דף הבית
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* Right Side - Product Info (appears first in RTL) */}
        <div className="order-2 lg:order-1 flex flex-col">
          {/* Title & Rating */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < product.rating ? 'fill-[#7DE400] text-[#7DE400]' : 'text-muted-foreground'}`} />)}
            </div>
            <span className="font-medium text-[#7ee600]">{product.reviews} ביקורות</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Price */}
          <div className="text-3xl font-bold text-foreground mb-8">
            ₪{product.price.toFixed(2)}
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center gap-4 mb-8">
            <Button className="flex-1 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-3">
              <ShoppingBag className="w-5 h-5" />
              הוספה לעגלה
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
            {product.features.map((feature, index) => <div key={index} className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                {getFeatureIcon(feature.icon)}
              </div>
              <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>)}
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {product.faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
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
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Thumbnails */}
          <div className="relative flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full" onClick={prevImage}>
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="flex gap-3 overflow-hidden flex-1 justify-center">
              {product.images.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-primary shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>)}
            </div>

            <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full" onClick={nextImage}>
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