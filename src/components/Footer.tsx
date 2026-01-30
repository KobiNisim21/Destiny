import { Link } from "react-router-dom";
import { Instagram, Youtube } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config";

// TikTok icon component
const TikTok = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    height="1em"
    width="1em"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
  </svg>
);

const Footer = () => {
  const [footerContent, setFooterContent] = useState({
    copyright: "© 2025 כל הזכויות שמורות - שם העסק",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com"
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        if (res.ok) {
          setFooterContent({
            copyright: data.footerCopyright || "© 2025 כל הזכויות שמורות - שם העסק",
            youtube: data.footerSocialYoutube || "https://youtube.com",
            instagram: data.footerSocialInstagram || "https://instagram.com",
            tiktok: data.footerSocialTiktok || "https://tiktok.com"
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <footer className="w-full site-footer" dir="rtl">
      <div className="footer-content">

        {/* Right Column: Logo & Copyright */}
        <div className="flex flex-col items-center gap-2 footer-section">
          <img
            src={logoImage}
            alt="Logo"
            className="footer-logo object-contain transition-all duration-300"
            style={{
              width: '200px',
              height: 'auto'
            }}
          />
          <div style={{
            color: '#FFF',
            textAlign: 'center',
            fontFamily: '"Noto Sans Hebrew", sans-serif',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 300,
            lineHeight: 'normal'
          }}>
            {footerContent.copyright}
          </div>
        </div>

        {/* Center Column: Links */}
        <nav className="flex gap-6 items-center footer-nav">
          <Link to="/shipping" className="footer-link">מדיניות משלוחים</Link>
          <Link to="/returns" className="footer-link">מדיניות החזרות וביטולים</Link>
          <Link to="/privacy" className="footer-link">מדיניות הפרטיות</Link>
          <Link to="/legal" className="footer-link">תוכן משפטי</Link>
          <Link to="/terms" className="footer-link">תנאי שימוש</Link>
        </nav>

        {/* Left Column: Socials & Credits */}
        <div className="flex flex-col items-end gap-2 footer-section-end">
          <div className="flex gap-6">
            {footerContent.youtube && <a href={footerContent.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-[#C097E8] transition-colors"><Youtube className="w-5 h-5" /></a>}
            {footerContent.instagram && <a href={footerContent.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-[#C097E8] transition-colors"><Instagram className="w-5 h-5" /></a>}
            {footerContent.tiktok && <a href={footerContent.tiktok} target="_blank" rel="noreferrer" className="text-white hover:text-[#C097E8] transition-colors"><TikTok className="w-5 h-5" /></a>}
          </div>

          <div className="flex gap-1" style={{
            color: '#D1D5DB',
            textAlign: 'right',
            fontFamily: '"Noto Sans Hebrew", sans-serif',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            <span>עיצוב ופיתוח:</span>
            <a href="#" style={{
              color: '#D1D5DB',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textUnderlineOffset: 'auto'
            }}>
              TalDesign
            </a>
          </div>
        </div>

      </div>

      <style>{`
        .site-footer {
            background: linear-gradient(180deg, #16172E 0%, #3E1B63 100%);
            padding: 20px 4%;
            height: 118px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .footer-content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        @media (max-width: 1024px) {
            .site-footer {
                padding: 40px 20px;
                height: auto;
            }
            .footer-content {
                flex-direction: column;
                gap: 40px;
            }
            .footer-section, .footer-section-end {
                align-items: center !important;
            }
            .footer-nav {
                flex-wrap: wrap;
                justify-content: center;
            }
        }

        .footer-link {
            color: #D1D5DB;
            text-align: right;
            font-family: "Noto Sans Hebrew";
            font-size: 15px;
            font-style: normal;
            font-weight: 300;
            line-height: normal;
            transition: color 0.2s;
        }
        .footer-link:hover {
            color: white;
        }
        .footer-logo:hover {
            filter: drop-shadow(0px 0px 5px rgba(138, 255, 0, 0.7)) drop-shadow(0px 0px 10px rgba(138, 255, 0, 0.5));
        }
      `}</style>
    </footer>
  );
};

export default Footer;
