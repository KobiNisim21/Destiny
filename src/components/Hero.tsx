import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-main.jpg";

const Hero = () => {
  return (
    <section className="relative gradient-hero overflow-hidden pt-24" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Right Content (RTL) */}
          <div className="space-y-6 animate-fade-in lg:pl-8">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">קולקציה חדשה זמינה עכשיו</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              תביע את עצמך
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                לבש את הסטייל שלך
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              מרצ׳ בלעדי בעיצוב Destiny. דרופים במהדורה מוגבלת, איכות פרימיום, ועיצובים ייחודיים שלא תמצאו בשום מקום אחר.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gradient-primary text-white font-semibold text-lg hover-scale shadow-medium">
                לקולקציה
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 font-semibold text-lg hover:bg-muted">
                לוקבוק
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">+500K</div>
                <div className="text-sm text-muted-foreground">לקוחות מרוצים</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">4.9★</div>
                <div className="text-sm text-muted-foreground">דירוג ממוצע</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">100%</div>
                <div className="text-sm text-muted-foreground">איכות פרימיום</div>
              </div>
            </div>
          </div>

          {/* Left Image */}
          <div className="relative animate-slide-up">
            <div className="absolute inset-0 gradient-primary opacity-20 blur-3xl rounded-full"></div>
            <img
              src={heroImage}
              alt="קולקציית Destiny"
              className="relative rounded-3xl shadow-large w-full h-auto object-cover hover-lift"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-large">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">מהדורה מוגבלת</div>
                  <div className="text-2xl font-bold">הוּדי סיגנייצ׳ר</div>
                </div>
                <Button className="gradient-primary text-white font-semibold">
                  לרכישה
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 gradient-warm opacity-20 blur-3xl rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 gradient-primary opacity-15 blur-3xl rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
    </section>
  );
};

export default Hero;
