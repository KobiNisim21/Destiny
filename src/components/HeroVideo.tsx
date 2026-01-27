import iconBadge from "@/assets/icon-badge.svg";
import iconShield from "@/assets/icon-shield.svg";
import iconTruck from "@/assets/icon-truck.svg";
import defaultHeroVideo from "@/assets/VideoProject.mp4";
import API_BASE_URL from "@/config";
import { CreditCard, Star, Heart } from "lucide-react";
import { useMemo } from "react";

interface InfoItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface HeroVideoProps {
  heroVideo?: string | null;
  heroYoutubeUrl?: string | null;
  heroInfoItems?: InfoItem[] | null;
}

const HeroVideo = ({ heroVideo, heroYoutubeUrl, heroInfoItems }: HeroVideoProps) => {

  const videoSrc = heroVideo ? `${API_BASE_URL}${heroVideo}` : defaultHeroVideo;

  const youtubeId = useMemo(() => {
    if (!heroYoutubeUrl) return null;
    const match = heroYoutubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match && match[1] ? match[1] : null;
  }, [heroYoutubeUrl]);

  const defaultInfoItems: InfoItem[] = [
    { icon: 'badge', title: 'מוצרים איכותיים', subtitle: 'סטנדרט פרימיום' },
    { icon: 'shield', title: 'קנייה בטוחה', subtitle: 'תשלום מאובטח ומוגן' },
    { icon: 'truck', title: 'משלוח חינם בקנייה מעל ₪349', subtitle: 'אספקה מהירה ונוחה' }
  ];

  const displayInfoItems = heroInfoItems && heroInfoItems.length > 0 ? heroInfoItems : defaultInfoItems;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'badge': return <img src={iconBadge} alt="Quality" className="info-icon" />;
      case 'shield': return <img src={iconShield} alt="Secure" className="info-icon" />;
      case 'truck': return <img src={iconTruck} alt="Delivery" className="info-icon" />;
      case 'credit-card': return <CreditCard className="info-icon text-white p-3" />;
      case 'star': return <Star className="info-icon text-white p-3" />;
      case 'heart': return <Heart className="info-icon text-white p-3" />;
      default: return <img src={iconBadge} alt="Icon" className="info-icon" />;
    }
  };

  return (
    <section className="hero-video-section" dir="rtl">
      {/* Hero Banner Container */}
      <div className="hero-video-container">
        {youtubeId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title="Hero Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          ></iframe>
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            key={videoSrc} // Force reload on source change
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Info Bar */}
      <div className="info-bar">
        {displayInfoItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="info-item">
              {getIcon(item.icon)}
              <div className="info-text">
                <span className="info-title">{item.title}</span>
                <span className="info-subtitle">{item.subtitle}</span>
              </div>
            </div>
            {index < displayInfoItems.length - 1 && <div className="info-divider" />}
          </div>
        ))}
      </div>

      <style>{`
        .hero-video-section {
          padding-top: 80px;
          padding-left: 16px;
          padding-right: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          overflow: hidden;
        }

        /* Hero Container */
        .hero-video-container {
          position: relative;
          width: 100%;
          max-width: 1400px;
          aspect-ratio: 16/9;
          max-height: 80vh; /* Prevent it from being too tall on huge screens */
          margin: 0 auto;
          display: block;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 0 20px 0 #872B8F;
        }

        @media (min-width: 1024px) {
            .hero-video-container {
                border-radius: 64px;
                aspect-ratio: 21/9; /* Cinematic on desktop */
                max-height: 700px;
            }
        }

        /* Info Bar */
        .info-bar {
          width: 100%;
          max-width: 1400px;
          min-height: 80px;
          background: linear-gradient(
            90deg,
            #271C2F 0%,
            #0A0A0A 31.73%,
            #0A0A0A 56.4%,
            #0A0A0A 66.83%,
            #19260A 100%
          );
          box-shadow: 0 0 11.6px 0 rgba(0, 0, 0, 0.22) inset;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-wrap: wrap; 
          align-items: center;
          justify-content: space-around; /* Distribute items evenly */
          gap: 20px;
          margin-top: 30px;
        }

        .info-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 200px;
        }

        .info-icon {
          width: 40px; /* Slightly smaller for better fit */
          height: 40px;
          flex-shrink: 0;
          filter: brightness(0) invert(1);
        }

        .info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .info-title {
          color: #ffffff;
          font-size: clamp(16px, 1.5vw, 20px); /* Fluid font size */
          font-weight: 600;
          font-family: "Noto Sans Hebrew", "Assistant", sans-serif;
          direction: rtl;
        }

        .info-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(12px, 1vw, 14px);
          font-weight: 400;
          font-family: "Noto Sans Hebrew", "Assistant", sans-serif;
          direction: rtl;
        }

        .info-divider {
          display: none; /* Flex gap handles spacing */
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .hero-video-section {
            padding-top: 100px; /* Space for fixed navbar */
            padding-bottom: 20px;
          }

          .hero-video-container {
            border-radius: 16px;
            aspect-ratio: 4/3; /* Taller on mobile for impact */
            max-height: 60vh;
          }

          .info-bar {
            flex-direction: column;
            align-items: stretch; /* Full width items */
            gap: 16px;
            padding: 20px;
            margin-top: 20px;
            background: #111; /* Simpler background logic */
          }

          .info-item {
            justify-content: flex-start;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;
