import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Globe,
    Tag,
    Mail,
    BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";

import destinyLogo from "@/assets/destiny-logo-new.png";

const AdminLayout = () => {
    const { logout, user } = useAuth(); // Destructure user
    const location = useLocation();
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    // On mobile, default to closed (false). On desktop, default to open (true).
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile && !isSidebarOpen) {
                // Optional: Auto-open if resizing to desktop
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    // Close sidebar automatically on route change on mobile
    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    // Navigation Items with Permissions
    const allNavItems = [
        { label: "לוח בקרה", path: "/admin", icon: <LayoutDashboard size={20} />, requiredPermission: 'view_dashboard' },
        { label: "מוצרים", path: "/admin/products", icon: <ShoppingBag size={20} />, requiredPermission: 'manage_products' },
        { label: "הזמנות", path: "/admin/orders", icon: <Package size={20} />, requiredPermission: 'manage_orders' },
        { label: "קופונים", path: "/admin/coupons", icon: <Tag size={20} />, requiredPermission: 'manage_orders' },
        { label: "ניהול צוות", path: "/admin/users", icon: <Users size={20} />, requiredPermission: 'manage_team' },
        { label: "שיווק וניוזלטר", path: "/admin/marketing", icon: <Mail size={20} />, requiredPermission: 'manage_content' },
        { label: "דפי מדיניות ותנאים", path: "/admin/policies", icon: <BookOpen size={20} />, requiredPermission: 'manage_content' },
        { label: "תוכן והגדרות", path: "/admin/content", icon: <Settings size={20} />, requiredPermission: 'manage_content' },
    ];

    // Filter items based on user role/permissions
    const navItems = allNavItems.filter(item => {
        if (!user) return false;
        if (user.isSuperAdmin) return true; // Super Admin sees everything
        return user.permissions?.includes(item.requiredPermission);
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex relative" dir="rtl" style={{ direction: 'rtl' }}>

            {/* Mobile Hamburger Toggle (Floating) - Only visible when closed on mobile */}
            {isMobile && !isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-[#9F19FF]"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    bg-white border-l border-gray-200 shadow-xl transition-all duration-300 flex flex-col z-50 h-full overflow-hidden
                    ${isMobile ? 'fixed inset-y-0 right-0' : 'relative'}
                    ${isSidebarOpen ? "w-64 translate-x-0" : isMobile ? "translate-x-full w-0 opacity-0 pointer-events-none" : "w-20"} 
                `}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <img src={destinyLogo} alt="Destiny" className="h-8 object-contain" />
                    ) : (
                        // Desktop collapsed logo (Mobile collapsed is hidden by translate-x-full)
                        <span className="text-2xl font-bold text-[#9F19FF]">D</span>
                    )}

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        {/* On mobile, inside the specific menu, we only show X to close. The open button is floating outside. */}
                        {isSidebarOpen ? <X size={20} /> : !isMobile && <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap
                    ${location.pathname === item.path
                                    ? "bg-[#9F19FF]/10 text-[#9F19FF]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                } ${!isSidebarOpen && !isMobile && 'justify-center'}`}
                            title={!isSidebarOpen ? item.label : ""}
                        >
                            <div className={`${location.pathname === item.path || (!isSidebarOpen && !isMobile) ? "text-[#9F19FF]" : "group-hover:text-[#9F19FF]"} transition-colors duration-200`}>
                                {item.icon}
                            </div>
                            {(isSidebarOpen || isMobile) && <span className="font-medium text-[15px] font-['Assistant']">{item.label}</span>}
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 w-full transition-all duration-200 whitespace-nowrap
         ${!isSidebarOpen && !isMobile && 'justify-center'}`}
                    >
                        <Globe size={20} />
                        {(isSidebarOpen || isMobile) && <span className="font-medium">חזרה לאתר</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all duration-200 whitespace-nowrap
                 ${!isSidebarOpen && !isMobile && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {(isSidebarOpen || isMobile) && <span className="font-medium">התנתק</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 overflow-auto h-screen transition-all duration-300 w-full`}>
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
