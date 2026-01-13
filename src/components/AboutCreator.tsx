import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
// Using A3 as placeholder for the hoodie girl if about-creator is not updated, 
// or stick to creatorImage if the user intends to replace the file. 
// I'll use creatorImage for semantic correctness.
import creatorImage from "@/assets/about-creator.jpg";

const AboutCreator = () => {
  return (
    <section className="py-16 md:py-24 bg-white" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Right Column - Image (In RTL layout, this is the First column visibly if direction is handled well, but often Grid 1 is Right in RTL? No, Grid 1 is First in DOM. In RTL, First is Right. So Image should be Left visually? 
          User Image: Image on Left. Text on Right.
          In RTL: Text on Right (Start), Image on Left (End). 
          So Text should be First in DOM? Or Second?
          Standard RTL: Column 1 is Right. Column 2 is Left.
          So Text is Col 1. Image is Col 2.
          */}

          {/* Text Content (Right Side visually in RTL) */}
          <div className="space-y-8 order-1 lg:order-1 text-right">

            {/* Badge */}
            <div style={{
              display: 'flex',
              width: '248px',
              height: '39px',
              padding: '0 17px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
              borderRadius: '60px',
              background: '#FFF',
              boxShadow: '0 5px 14px 0 rgba(0, 0, 0, 0.25)'
            }}>
              <Sparkles className="w-5 h-5 text-[#9F19FF]" />
              <span className="animate-fade-in-out" style={{
                color: '#1E1E1E',
                textAlign: 'right',
                fontFamily: '"Noto Sans Hebrew", sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 300,
                lineHeight: 'normal'
              }}>
                חנות מרצ'נדייז רשמית
              </span>
            </div>

            {/* Headings */}
            <div className="space-y-2">
              <h2 className="font-['Noto_Sans_Hebrew'] text-[64px] font-black leading-tight"
                style={{
                  background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                לחלום.
              </h2>
              <h2 className="font-['Noto_Sans_Hebrew'] text-[64px] font-black leading-tight text-[#22222A]">
                ליצור.
              </h2>
              <h2 className="font-['Noto_Sans_Hebrew'] text-[64px] font-black leading-tight text-[#1E1E1E]">
                להעניק.
              </h2>
            </div>

            {/* Paragraph */}
            <p className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#4B5563] max-w-xl">
              ברוכים הבאים לקולקציית המרצ'נדייז הרשמית של דסטני. עיצובים בלעדיים, מכירות מוגבלות ומוצרים שיוצרו באהבה עבור הקהילה המדהימה שלי. ✨
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                className="h-[56px] px-8 rounded-full bg-white text-[#22222A] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-lg font-medium shadow-sm gap-2"
              >
                <Play className="w-5 h-5 ml-2 fill-current" />
                לצפייה בסירטון
              </Button>

              <Button
                className="h-[56px] px-8 rounded-full text-white text-lg font-medium shadow-lg hover:opacity-90 gap-2"
                style={{
                  background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                }}
              >
                לחנות הקולקציות
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8">
              <div className="text-right">
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-bold leading-normal"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  +153K
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">רשומים לערוץ</div>
              </div>
              <div className="text-right">
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-bold leading-normal"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  +35K
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">עוקבים בטיקטוק</div>
              </div>
              <div className="text-right">
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-bold leading-normal"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  +370
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">סירטונים ביוטיוב</div>
              </div>
            </div>

          </div>

          {/* Image (Left Side visually) */}
          <div className="order-2 lg:order-2 relative">
            <img
              src={creatorImage}
              alt="Destiny"
              className="w-full h-[600px] object-cover rounded-[40px] shadow-2xl"
            />
            {/* Note: User image shows rounded corners. */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutCreator;
