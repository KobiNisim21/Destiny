import { Button } from "@/components/ui/button";
import { Play, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import creatorImage from "@/assets/about-creator.jpg";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config";

import { Link } from "react-router-dom";
import { X } from "lucide-react";

const AboutCreator = () => {
  const [content, setContent] = useState<any>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        setContent(data);
      } catch (error) {
        console.error("Failed to fetch content", error);
      }
    };
    fetchContent();
  }, []);

  const getImageSrc = () => {
    if (content?.aboutImage) return `${API_BASE_URL}${content.aboutImage}`;
    return creatorImage;
  };

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
                lineHeight: 'normal',
                position: 'relative',
                top: '-1px'
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
                {content?.aboutTitle1 || "לחלום."}
              </h2>
              <h2 className="font-['Noto_Sans_Hebrew'] text-[64px] font-black leading-tight text-[#22222A]">
                {content?.aboutTitle2 || "ליצור."}
              </h2>
              <h2 className="font-['Noto_Sans_Hebrew'] text-[64px] font-black leading-tight text-[#1E1E1E]">
                {content?.aboutTitle3 || "להעניק."}
              </h2>
            </div>

            {/* Paragraph */}
            <p className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#4B5563] max-w-xl">
              {content?.aboutDescription || "ברוכים הבאים לקולקציית המרצ'נדייז הרשמית של דסטני. עיצובים בלעדיים, מכירות מוגבלות ומוצרים שיוצרו באהבה עבור הקהילה המדהימה שלי. ✨"}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => setIsVideoOpen(true)}
                className="h-[56px] px-8 rounded-full bg-white text-[#22222A] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-lg font-medium shadow-sm gap-2"
              >
                <Play className="w-5 h-5 ml-2 fill-current" />
                {content?.aboutButtonVideoText || "לצפייה בסירטון"}
              </Button>

              <Link to="/catalog">
                <Button
                  className="h-[56px] px-8 rounded-full text-white text-lg font-medium shadow-lg hover:opacity-90 gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                  }}
                >
                  {content?.aboutButtonCollectionText || "לחנות הקולקציות"}
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
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
                  {content?.aboutSubscribers || "+153K"}
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">{content?.aboutSubscribersLabel || "רשומים לערוץ"}</div>
              </div>
              <div className="text-right">
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-bold leading-normal"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {content?.aboutFollowers || "+35K"}
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">{content?.aboutFollowersLabel || "עוקבים בטיקטוק"}</div>
              </div>
              <div className="text-right">
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-bold leading-normal"
                  style={{
                    background: 'linear-gradient(90deg, #C097E8 0%, #9F19FF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {content?.aboutVideos || "+370"}
                </div>
                <div className="font-['Noto_Sans_Hebrew'] text-[24px] font-light leading-normal text-[#7E7E7E]">{content?.aboutVideosLabel || "סירטונים ביוטיוב"}</div>
              </div>
            </div>

          </div>

          {/* Image (Left Side visually) */}
          <div className="order-2 lg:order-2 relative">
            <img
              src={getImageSrc()}
              alt="Destiny"
              className="w-full h-[600px] object-cover rounded-[40px] shadow-2xl"
            />
            {/* Note: User image shows rounded corners. */}
          </div>

        </div>
      </div>
      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {content?.aboutVideoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${content.aboutVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1]}?autoplay=1`}
                title="About Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>לא הוגדר סרטון במערכת</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutCreator;
