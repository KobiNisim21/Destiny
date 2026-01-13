import iconBadge from "@/assets/icon-badge.svg";
import iconShield from "@/assets/icon-shield.svg";
import iconTruck from "@/assets/icon-truck.svg";
import heroVideo from "@/assets/VideoProject.mp4";

const HeroVideo = () => {
  return (
    <section className="hero-video-section" dir="rtl">
      {/* Hero Banner Container */}
      <div className="hero-video-container" style={{
        overflow: 'hidden',
        borderRadius: '124px',
        boxShadow: '0 0 20px 0 #872B8F',
        height: '800px'
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Info Bar */}
      <div className="info-bar">
        <div className="info-item">
          <img src={iconBadge} alt="Quality" className="info-icon" />
          <div className="info-text">
            <span className="info-title">מוצרים איכותיים</span>
            <span className="info-subtitle">סטנדרט פרימיום</span>
          </div>
        </div>

        <div className="info-divider" />

        <div className="info-item">
          <img src={iconShield} alt="Secure" className="info-icon" />
          <div className="info-text">
            <span className="info-title">קנייה בטוחה</span>
            <span className="info-subtitle">תשלום מאובטח ומוגן</span>
          </div>
        </div>

        <div className="info-divider" />

        <div className="info-item">
          <img src={iconTruck} alt="Delivery" className="info-icon" />
          <div className="info-text">
            <span className="info-title">משלוח חינם בקנייה מעל ₪349</span>
            <span className="info-subtitle">אספקה מהירה ונוחה</span>
          </div>
        </div>
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
            background: #111; /* Fallback/Simple dark background for mobile until specific design provided */
          }
        }
      `}</style>
    </section>
  );
};

export default HeroVideo;
