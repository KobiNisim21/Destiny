import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingBag, Eye, Database } from "lucide-react";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
                        <CardTitle className="text-sm font-medium text-gray-500">מכירות החודש</CardTitle>
                        <DollarSign className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats ? (stats.error ? '-' : `₪${stats.monthlySales?.toFixed(0) || '0'}`) : '...'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats?.yearlySales ? `שנתי: ₪${stats.yearlySales.toFixed(0)}` : 'טוען...'}
                        </p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders - Takes up 2 columns */}
                <Card className="lg:col-span-2 bg-white">
                    <CardHeader>
                        <CardTitle>הזמנות אחרונות</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="p-3 rounded-r-lg">מספר</th>
                                            <th className="p-3">לקוח</th>
                                            <th className="p-3">סכום</th>
                                            <th className="p-3">סטטוס</th>
                                            <th className="p-3 rounded-l-lg">תאריך</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {stats.recentOrders.map((order: any) => (
                                            <tr key={order._id}>
                                                <td className="p-3 font-medium">#{order._id.slice(-6)}</td>
                                                <td className="p-3">{order.user?.firstName} {order.user?.lastName}</td>
                                                <td className="p-3">₪{order.totalAmount.toFixed(2)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status === 'pending' ? 'ממתין' :
                                                            order.status === 'processing' ? 'בטיפול' :
                                                                order.status === 'shipped' ? 'נשלח' :
                                                                    order.status === 'delivered' ? 'נמסר' : order.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">אין הזמנות אחרונות</div>
                        )}
                    </CardContent>
                </Card>

                {/* Sales Graph */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                            ניתוח מכירות (14 ימים)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {stats?.salesGraph ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.salesGraph}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        interval={1}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value: number) => [`₪${value}`, 'מכירות']}
                                        labelStyle={{ textAlign: 'right', direction: 'rtl' }}
                                    />
                                    <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                                טוען נתונים...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
