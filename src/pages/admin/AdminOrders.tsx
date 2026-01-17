import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { Loader2 } from "lucide-react";

interface Order {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/orders/admin`, {
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

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast({ title: "סטטוס הזמנה עודכן" });
                setOrders(prev => prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                toast({ title: "שגיאה בעדכון סטטוס", variant: "destructive" });
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">ממתין</Badge>;
            case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">בטיפול</Badge>;
            case 'shipped': return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">נשלח</Badge>;
            case 'delivered': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">נמסר</Badge>;
            case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">בוטל</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-3xl font-bold font-['Assistant']">ניהול הזמנות</h1>

            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>כל ההזמנות</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">מספר הזמנה</TableHead>
                                <TableHead className="text-right">לקוח</TableHead>
                                <TableHead className="text-right">תאריך</TableHead>
                                <TableHead className="text-right">סכום</TableHead>
                                <TableHead className="text-right">סטטוס</TableHead>
                                <TableHead className="text-right">פעולות</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                                    <TableCell>
                                        <div>{order.user?.firstName} {order.user?.lastName}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString('he-IL')}</TableCell>
                                    <TableCell>₪{order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val) => handleStatusUpdate(order._id, val)}
                                        >
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent dir="rtl">
                                                <SelectItem value="pending">ממתין</SelectItem>
                                                <SelectItem value="processing">בטיפול</SelectItem>
                                                <SelectItem value="shipped">נשלח</SelectItem>
                                                <SelectItem value="delivered">נמסר</SelectItem>
                                                <SelectItem value="cancelled">בוטל</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrders;
