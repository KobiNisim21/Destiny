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
      <div className="hero-video-container" style={{
        overflow: 'hidden',
        borderRadius: '124px',
        boxShadow: '0 0 20px 0 #872B8F',
        height: '800px',
        position: 'relative'
      }}>
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
          padding-top: 70px;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* Hero Container */
        .hero-video-container {
          position: relative;
          width: 1600px;
          max-width: 100%;
          height: 800px;
          flex-shrink: 0;
          align-self: stretch;
          margin: 0 auto;
          display: block;
          border-radius: 124px;
        }

        /* Info Bar */
        .info-bar {
          width: 100%;
          height: 80px;
          background: linear-gradient(
            90deg,
            #271C2F 0%,
            #0A0A0A 31.73%,
            #0A0A0A 56.4%,
            #0A0A0A 66.83%,
            #19260A 100%
          );
          box-shadow: 0 0 11.6px 0 rgba(0, 0, 0, 0.22) inset;
          border-radius: 0;
          padding: 0 390px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 40px;
        }

        .info-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 4px 0;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          filter: brightness(0) invert(1);
        }

        .info-text {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .info-title {
          color: #ffffff;
          font-size: 20px;
          font-weight: 400;
          font-family: "Noto Sans Hebrew", "Assistant", Helvetica, sans-serif;
          direction: rtl;
        }

        .info-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 400;
          font-family: "Noto Sans Hebrew", "Assistant", Helvetica, sans-serif;
          direction: rtl;
        }

        .info-divider {
          display: none;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-video-section {
            padding-top: 100px;
            padding-left: 16px;
            padding-right: 16px;
          }

          .hero-video-container {
            aspect-ratio: 16 / 9;
            height: auto;
            border-radius: 24px;
          }

          .info-bar {
            flex-direction: column;
            gap: 16px;
            padding: 20px 24px;
            border-radius: 16px;
            height: auto;
            background: #111;
          }
        }

        /* Tablet/Laptop responsive */
        @media (min-width: 769px) and (max-width: 1500px) {
            .info-bar {
                padding: 0 50px;
            }
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;
