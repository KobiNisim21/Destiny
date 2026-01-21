import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, Loader2 } from "lucide-react";
import API_BASE_URL from "@/config";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({
    title: "הצטרפו לקבוצה שלי",
    subtitle: "קבלו גישה בלעדית לדרופים חדשים, הנחות מיוחדות, ותוכן מאחורי הקלעים. וגם - 15% הנחה על ההזמנה הראשונה!",
    buttonText: "הצטרפו עכשיו",
    benefits: [
      { text: "משלוח חינם מעל ₪395" },
      { text: "הטבות בלעדיות לחברים" },
      { text: "גישה מוקדמת להטבות" }
    ]
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/content`);
      const data = await res.json();
      setContent({
        title: data.newsletterTitle || "הצטרפו לקבוצה שלי",
        subtitle: data.newsletterSubtitle || "קבלו גישה בלעדית לדרופים חדשים, הנחות מיוחדות, ותוכן מאחורי הקלעים. וגם - 15% הנחה על ההזמנה הראשונה!",
        buttonText: data.newsletterButtonText || "הצטרפו עכשיו",
        benefits: data.newsletterBenefits && data.newsletterBenefits.length > 0
          ? data.newsletterBenefits
          : [
            { text: "משלוח חינם מעל ₪395" },
            { text: "הטבות בלעדיות לחברים" },
            { text: "גישה מוקדמת להטבות" }
          ]
      });
    } catch (error) {
      console.error("Error fetching newsletter content:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "מזל טוב!",
          description: "נרשמת בהצלחה לרשימת התפוצה. מייל עם קוד קופון נשלח אליך.",
          className: "bg-[#9F19FF] text-white border-none"
        });
        setEmail("");
      } else {
        toast({
          title: "שגיאה",
          description: data.message || "אירעה שגיאה בהרשמה.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה. אנא נסה שנית מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-16 pt-4 md:pb-20 md:pt-4" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12 lg:p-16 shadow-large">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-float">
              <Mail className="w-8 h-8" />
            </div>

            {/* Content */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-['Assistant']">
              {content.title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {content.subtitle}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="הזינו את המייל שלכם"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 font-['Assistant']"
                required
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-14 bg-white text-primary hover:bg-white/90 font-bold px-8 hover-scale font-['Assistant']"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="ml-2 h-5 w-5" />}
                {content.buttonText}
              </Button>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80 font-['Assistant']">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  {benefit.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
