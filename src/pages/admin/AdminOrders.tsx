import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Mail } from "lucide-react";

interface Order {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        zipCode: string;
        phone: string;
        email?: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const handleContactUser = (order: Order) => {
        // Use user email or shipping email if user email is missing (though user should exist)
        const email = order.user?.email || order.shippingAddress?.email;
        if (!email) return;

        const subject = `פנייה בנוגע להזמנה #${order._id.slice(-6).toUpperCase()}`;
        const body = `שלום ${order.shippingAddress?.firstName || order.user?.firstName},\n\nבנוגע להזמנתך באתר Destiny...`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

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
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                                <Eye className="w-5 h-5 text-gray-600" />
                                            </Button>
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-3xl font-['Assistant']" dir="rtl">
                    <DialogHeader>
                        <DialogTitle>פרטי הזמנה #{selectedOrder?._id.slice(-6).toUpperCase()}</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* User Details */}
                            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">פרטי לקוח</h3>
                                    <p><strong>שם:</strong> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                    <p><strong>אימייל:</strong> {selectedOrder.user?.email}</p>
                                </div>
                                <div className="text-left rtl:text-right">
                                    <Button onClick={() => handleContactUser(selectedOrder)} className="gap-2">
                                        <Mail className="w-4 h-4" />
                                        צור קשר
                                    </Button>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="text-right w-[100px]">תמונה</TableHead>
                                            <TableHead className="text-right">מוצר</TableHead>
                                            <TableHead className="text-right">כמות</TableHead>
                                            <TableHead className="text-right">מחיר</TableHead>
                                            <TableHead className="text-right">סה"כ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedOrder.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                                                </TableCell>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>₪{item.price.toFixed(2)}</TableCell>
                                                <TableCell>₪{(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                                <span>סה"כ לתשלום:</span>
                                <span>₪{selectedOrder.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;
