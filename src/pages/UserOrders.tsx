import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API_BASE_URL from "@/config";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
}

const UserOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    toast({ title: "שגיאה בטעינת הזמנות", variant: "destructive" });
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">ממתין</Badge>;
            case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">בטיפול</Badge>;
            case 'shipped': return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">נשלח</Badge>;
            case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">נתקבל</Badge>;
            case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">בוטל</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Assistant']" dir="rtl">
            <Navbar />
            <div className="container mx-auto px-4 pt-28 md:pt-40 pb-24 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">ההזמנות שלי</h1>

                {loading ? (
                    <div className="text-center py-10">טוען הזמנות...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>לא נמצאו הזמנות קודמות.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id} className="bg-white border-none shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b pb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-base">הזמנה #{order._id.slice(-6)}</CardTitle>
                                            <CardDescription>
                                                {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold">₪{order.totalAmount.toFixed(2)}</span>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">
                                                        {item.quantity}
                                                    </span>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UserOrders;
