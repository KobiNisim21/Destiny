import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingBag, Eye, Database } from "lucide-react";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config";

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log('Stats fetched:', data);
                    setStats(data);
                } else {
                    console.error('Stats fetch failed:', res.status, res.statusText);
                    setStats({ error: true });
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
                setStats({ error: true });
            }
        };
        fetchStats();
    }, []);

    const formatBytes = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-['Assistant']">לוח בקרה</h1>
                <p className="text-gray-500 mt-2 font-['Assistant']">ברוכים הבאים למערכת הניהול של דסטני</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">כל המכירות</CardTitle>
                        <DollarSign className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₪0.00</div>
                        <p className="text-xs text-gray-500 mt-1">+0% מהחודש שעבר</p>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">צפיות באתר</CardTitle>
                        <Eye className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? (stats.error ? '-' : stats.views || 0) : '...'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">סה"כ כניסות לדף הבית</p>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">נרשמו החודש</CardTitle>
                        <Users className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? (stats.error ? '-' : stats.users) : '...'}
                        </div>
                        <p className={`text-xs mt-1 ${stats && stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats ? (stats.error ? '' : `${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}% מהחודש שעבר`) : '...'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">נפח אחסון (DB)</CardTitle>
                        <Database className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? (stats.error ? '-' : formatBytes(stats.storageSize)) : '...'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">נפח בשימוש ב-MongoDB</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for future graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-[300px] flex items-center justify-center bg-white border-dashed">
                    <span className="text-gray-400">גרף מכירות (בקרוב)</span>
                </Card>
                <Card className="h-[300px] flex items-center justify-center bg-white border-dashed">
                    <span className="text-gray-400">הזמנות אחרונות (בקרוב)</span>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
