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
import { useState } from "react";

import destinyLogo from "@/assets/destiny-logo-new.png";

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { label: "לוח בקרה", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { label: "מוצרים", path: "/admin/products", icon: <ShoppingBag size={20} /> },
        { label: "הזמנות", path: "/admin/orders", icon: <Package size={20} /> },
        { label: "קופונים", path: "/admin/coupons", icon: <Tag size={20} /> },
        { label: "ניהול צוות", path: "/admin/users", icon: <Users size={20} /> },
        { label: "שיווק וניוזלטר", path: "/admin/marketing", icon: <Mail size={20} /> },
        { label: "דפי מדיניות ותנאים", path: "/admin/policies", icon: <BookOpen size={20} /> },
        { label: "תוכן והגדרות", path: "/admin/content", icon: <Settings size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex" dir="rtl" style={{ direction: 'rtl' }}>
            {/* Sidebar */}
            <aside
                className={`bg-white border-l border-gray-200 shadow-sm transition-all duration-300 fixed md:relative z-50 h-full
        ${isSidebarOpen ? "w-64" : "w-20"} flex flex-col`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <img src={destinyLogo} alt="Destiny" className="h-8 object-contain" />
                    ) : (
                        <span className="text-2xl font-bold text-[#9F19FF]">D</span>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${location.pathname === item.path
                                    ? "bg-[#9F19FF]/10 text-[#9F19FF]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                } ${!isSidebarOpen && 'justify-center'}`}
                            title={!isSidebarOpen ? item.label : ""}
                        >
                            <div className={`${location.pathname === item.path ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}>
                                {item.icon}
                            </div>
                            {isSidebarOpen && <span className="font-medium text-[15px] font-['Assistant']">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 w-full transition-all duration-200
         ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Globe size={20} />
                        {isSidebarOpen && <span className="font-medium">חזרה לאתר</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all duration-200
                 ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">התנתק</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto h-screen">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
