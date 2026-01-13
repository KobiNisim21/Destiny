import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              הצטרפו לקבוצה שלי
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              קבלו גישה בלעדית לדרופים חדשים, הנחות מיוחדות, ותוכן מאחורי הקלעים.
              וגם - 15% הנחה על ההזמנה הראשונה!
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="הזינו את המייל שלכם"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 bg-white text-primary hover:bg-white/90 font-semibold px-8 hover-scale"
              >
                <Sparkles className="ml-2 h-5 w-5" />
                הצטרפו עכשיו
              </Button>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                משלוח חינם מעל ₪395
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                הטבות בלעדיות לחברים
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                גישה מוקדמת להטבות
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
