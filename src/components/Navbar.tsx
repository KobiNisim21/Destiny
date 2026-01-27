import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import destinyLogo from "@/assets/destiny-logo-new.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import API_BASE_URL from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { id: 'home', label: 'דף הבית', type: 'scroll', target: 'hero-section' },
    { id: 'featured', label: 'נבחרים', type: 'scroll', target: 'featured-section' },
    { id: 'trinkets', label: 'טרינקטס', type: 'scroll', target: 'trinkets-section' },
    { id: 'new', label: 'חדשים', type: 'scroll', target: 'new-arrivals-section' },
    { id: 'about', label: 'אודות', type: 'route', target: '/about' },
  ]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content`);
        const data = await res.json();
        if (data.menuItems && Array.isArray(data.menuItems)) {
          setMenuItems(data.menuItems);
        }
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      }
    };
    fetchContent();
  }, []);

  const isActive = (path: string) => (location.pathname === path ? "active" : "");

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleScroll = (id: string) => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getGreeting = () => {
    if (!user) return "";
    return user.gender === 'female' ? 'ברוכה הבאה' : user.gender === 'male' ? 'ברוך הבא' : 'ברוכים הבאים';
  };

  return (
    <>
      {/* Floating Pill Navbar - RTL */}
      <nav className="floating-nav" dir="rtl">
        {/* Right: Logo */}
        <Link to="/" className="nav-brand" aria-label="Destiny Home" onClick={() => handleScroll('hero-section')}>
          <img src={destinyLogo} alt="Destiny" />
        </Link>

        {/* Mobile Toggle Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>

        {/* Center: Navigation Links */}
        <div className="nav-links">
          {menuItems.map((item) => (
            item.type === 'scroll' ? (
              <button key={item.id} onClick={() => handleScroll(item.target)} className={`nav-link-btn ${item.id === 'home' && location.pathname === '/' ? 'active' : ''}`}>
                {item.label}
              </button>
            ) : (
              <Link key={item.id} to={item.target} className={isActive(item.target)}>
                {item.label}
              </Link>
            )
          ))}

          <div className="w-[1px] h-[20px] bg-white/20 mx-2"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white text-[16px] font-medium hidden xl:block">
                {getGreeting()}, {user.firstName}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="w-8 h-8 border border-white/20 cursor-pointer hover:border-[#9F19FF] transition-colors">
                    <AvatarFallback className="bg-[#9F19FF] text-white text-xs">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1a1a] border-white/10 text-white min-w-[200px]" align="end" style={{ direction: 'rtl' }}>
                  <DropdownMenuLabel className="text-right pr-4">החשבון שלי</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="flex items-center justify-start gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10" onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 ml-0" />
                    <span>פרופיל אישי</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-start gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10" onClick={() => navigate('/orders')}>
                    <ShoppingCart className="w-4 h-4 ml-0" />
                    <span>ההזמנות שלי</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem className="flex items-center justify-start gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 text-[#9F19FF]" onClick={() => navigate('/admin')}>
                      <span>לוח ניהול</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="flex items-center justify-start gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 text-red-500 hover:text-red-400 focus:text-red-400" onClick={() => {
                    logout();
                    navigate('/');
                  }}>
                    <span>התנתק</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className={isActive("/login")}>
                התחברות
              </Link>
              <Link to="/register" className={isActive("/register")}>
                הרשמה
              </Link>
            </div>
          )}
        </div>

        {/* Left: Cart Icon */}
        <div className="nav-icons">
          <button className="nav-icon-btn relative" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none" className="icon">
              <path d="M29.8989 25.5655C31.4374 25.5494 32.7825 24.5104 33.1772 23.0202L36.9709 8.89235C37.0917 8.43324 36.8259 7.96606 36.3668 7.83719C36.2943 7.82108 36.2218 7.80497 36.1493 7.80497H7.61166L5.67049 0.636319C5.57383 0.265804 5.23553 0 4.84891 0H0V1.71564H4.17232L6.04905 8.7232C6.041 8.77959 6.041 8.83597 6.04905 8.89235L9.91529 23.0686C9.93946 23.1813 9.97973 23.3022 10.02 23.4149L11.3249 28.1672C10.0683 28.8357 9.21454 30.1567 9.21454 31.679C9.21454 33.8779 10.9946 35.658 13.1935 35.658C15.3925 35.658 17.1725 33.8779 17.1725 31.679C17.1725 30.9944 16.9953 30.3419 16.6893 29.7781C16.6168 29.6492 16.5443 29.5204 16.4557 29.3915H26.5804C26.1293 30.0358 25.8555 30.8252 25.8555 31.679C25.8555 33.8779 27.6356 35.658 29.8345 35.658C32.0334 35.658 33.8135 33.8779 33.8135 31.679C33.8135 30.64 33.4188 29.6976 32.7664 28.9887C32.0656 28.1913 31.0346 27.6839 29.8828 27.6758H13.0405L12.4364 25.4608C12.6942 25.5252 12.96 25.5655 13.2258 25.5655H29.8989ZM29.8425 29.3915C31.1071 29.3915 32.1301 30.4144 32.1301 31.679C32.1301 32.9436 31.1071 33.9665 29.8425 33.9665C28.578 33.9665 27.555 32.9436 27.555 31.679C27.555 30.4144 28.578 29.3915 29.8425 29.3915ZM13.1935 29.3915C14.4581 29.3915 15.473 30.4225 15.473 31.679C15.473 32.9436 14.4501 33.9665 13.1855 33.9665C11.9209 33.9665 10.906 32.9436 10.906 31.679C10.906 30.4144 11.929 29.3915 13.1935 29.3915ZM11.6632 22.7625L9.73809 15.7227L8.02245 9.53672H34.9975L31.5099 22.6336C31.3165 23.3827 30.648 23.9062 29.8748 23.9224H13.2097C12.5089 23.8821 11.8967 23.431 11.6632 22.7625Z" fill="white" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} dir="rtl">
        {menuItems.map((item) => (
          item.type === 'scroll' ? (
            <button key={item.id} onClick={() => handleScroll(item.target)} className="mobile-link">
              {item.label}
            </button>
          ) : (
            <Link key={item.id} to={item.target} className="mobile-link" onClick={closeMenu}>
              {item.label}
            </Link>
          )
        ))}



        <div className="w-full h-[1px] bg-white/10 my-2"></div>

        {user ? (
          <>
            <div className="text-white text-center py-2 font-medium">
              {user.gender === 'female' ? 'ברוכה הבאה' : user.gender === 'male' ? 'ברוך הבא' : 'ברוכים הבאים'}, {user.firstName}
            </div>

            <Link to="/profile" className="mobile-link" onClick={closeMenu}>
              פרופיל אישי
            </Link>
            <Link to="/orders" className="mobile-link" onClick={closeMenu}>
              ההזמנות שלי
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="mobile-link text-[#9F19FF] border-[#9F19FF]/30" onClick={closeMenu}>
                לוח ניהול
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                closeMenu();
                navigate('/');
              }}
              className="mobile-link text-[#FF4B4B] border-[#FF4B4B]/30"
            >
              התנתק
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link" onClick={closeMenu}>התחברות</Link>
            <Link to="/register" className="mobile-link" onClick={closeMenu}>הרשמה</Link>
          </>
        )}
      </div>

      {/* Component-scoped styles */}
      <style>{`
        /* ===== Nav Bar Container ===== */
        .floating-nav {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 3px 2px;
          position: fixed;
          top: 33px; /* explicit pos */
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          border-radius: 140px;
          border: none;
          background: linear-gradient(
            90deg,
            #271C2F 0%,
            #0A0A0A 31.73%,
            #0A0A0A 56.4%,
            #0A0A0A 66.83%,
            #19260A 100%
          );
          box-shadow: 0 0 15px 0 #872B8F;
        }

        /* Inner frame with white border */
        .floating-nav::before {
          content: "";
          position: absolute;
          inset: 3px;
          width: calc(100% - 6px); /* 100% minus padding/inset */
          height: calc(100% - 6px);
          border-radius: 125px; /* Slightly smaller radius for inner */
          border: 3px solid #ffffff;
          pointer-events: none;
        }

        /* ===== Logo ===== */
        .nav-brand {
          display: flex;
          align-items: center;
          padding: 0;
          background: transparent;
          border: 0;
          box-shadow: none;
          border-radius: 0;
          text-decoration: none;
          cursor: pointer;
        }

        .nav-brand img {
          width: 144px;
          height: 41px;
          object-fit: cover;
          display: block;
        }

        /* ===== Center links ===== */
        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          flex: 1;
        }

        /* UPDATED: Target both a and button */
        .nav-links a,
        .nav-link-btn {
          font-family: "Assistant", sans-serif;
          font-weight: 400;
          color: #ffffff;
          font-size: 20px;
          font-style: normal;
          line-height: normal;
          text-decoration: none;
          letter-spacing: 0;
          direction: rtl;
          white-space: nowrap;
          transition: opacity 0.15s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .nav-links a:hover,
        .nav-link-btn:hover {
          opacity: 0.8;
        }

        .nav-links a.active,
        .nav-link-btn.active {
          font-weight: 700;
        }

        /* ===== Icons ===== */
        .nav-icons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-icon-btn {
          position: relative;
          width: 44px;
          height: 44px;
          background: transparent;
          border: 0;
          box-shadow: none;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .nav-icon-btn:hover {
          transform: translateY(-1px);
        }

        .icon {
          width: 37px;
          height: 35.658px;
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .nav-icon-btn:hover .icon path {
          fill: #E6FFB3;
          filter: drop-shadow(0 0 2px #E6FFB3) drop-shadow(0 0 5px #ccff00);
        }

        /* badge */
        .cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 9999px;
          background: #E53935;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          line-height: 20px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        /* ===== Main nav layout ===== */
        .floating-nav {
          width: 100%;
          max-width: 991px;
          height: 74px;
          padding: 16px 55px 16px 35px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        
        /* Mobile Menu Styles */
        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 5px;
        }

        .mobile-menu-overlay {
            position: fixed;
            top: 115px; 
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            width: 90%;
            max-width: 400px;
            background: linear-gradient(180deg, #16172E 0%, #0A0A0A 100%);
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(15px);
            border-radius: 24px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 48;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .mobile-menu-overlay.open {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
            pointer-events: all;
        }

        .mobile-link {
            color: #fff;
            text-decoration: none;
            font-family: "Assistant", sans-serif;
            font-size: 18px;
            padding: 12px 20px;
            border-radius: 12px;
            text-align: center;
            transition: background 0.2s;
            border: 1px solid transparent;
            width: 100%;
            background: transparent;
            cursor: pointer;
        }
        
        .mobile-link:hover, .mobile-link.active {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.1);
            font-weight: bold;
        }

        /* ===== Mobile ===== */
        @media (max-width: 820px) {
          .floating-nav {
            width: calc(100% - 24px);
            padding: 8px 24px;
            justify-content: space-between;
          }
          .floating-nav::before {
            width: calc(100% - 6px);
          }
          .nav-links {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          
          /* Adjust Logo size on mobile if needed */
          .nav-brand img {
              height: 32px;
              width: auto;
          }
          /* Adjust cart icon size */
          .nav-icon-btn {
              width: 36px;
              height: 36px;
          }
          .icon {
              width: 28px;
              height: 28px;
          }
        }

      `}</style>
    </>
  );
};

export default Navbar;
