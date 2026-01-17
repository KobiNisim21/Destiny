import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import Footer from "@/components/Footer";

const Checkout = () => {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        zipCode: "",
        phone: "",
        email: ""
    });

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCouponCode, setAppliedCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        setCouponMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode,
                    cartItems: items,
                    cartTotal: cartTotal
                })
            });

            const data = await res.json();

            if (data.valid) {
                setCouponDiscount(data.discountAmount);
                setAppliedCouponCode(data.code);
                setCouponMessage("קופון הופעל בהצלחה!");
                toast({ title: "קופון הופעל בהצלחה" });
            } else {
                setCouponDiscount(0);
                setAppliedCouponCode("");
                setCouponMessage(data.message || "קופון לא תקין");
                toast({ title: data.message || "קופון לא תקין", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setCouponMessage("שגיאה בבדיקת קופון");
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                street: user.address?.street || "",
                city: user.address?.city || "",
                zipCode: user.address?.zipCode || ""
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast({ title: "הסל ריק", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast({ title: "נא להתחבר כדי לבצע הזמנה", variant: "destructive" });
                navigate('/login');
                return;
            }

            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: Math.max(0, cartTotal - couponDiscount),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    street: formData.street,
                    city: formData.city,
                    zipCode: formData.zipCode,
                    phone: formData.phone
                },
                couponCode: appliedCouponCode, // Optional: if backend supports it
                discountAmount: couponDiscount
            };

            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) throw new Error('Order creation failed');

            const newOrder = await res.json();

            clearCart();
            toast({ title: "ההזמנה בוצעה בהצלחה!" });
            navigate('/order-success'); // We assume this route will exist

        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה בביצוע ההזמנה", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Assistant']" dir="rtl">
                <Navbar />
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">סל הקניות ריק</h2>
                    <Button onClick={() => navigate('/')}>חזור לחנות</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-['Assistant']" dir="rtl">
            <Navbar />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">קופה</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checkout Form */}
                    <div className="space-y-6">
                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>פרטי משלוח</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">שם פרטי</Label>
                                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">שם משפחה</Label>
                                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">אימייל לאישור</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">טלפון</Label>
                                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="street">רחוב ומספר בית</Label>
                                        <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">עיר</Label>
                                            <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">מיקוד</Label>
                                            <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>תשלום</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Mock Payment Fields */}
                                <div className="space-y-4 opacity-70 pointer-events-none filter grayscale">
                                    <div className="space-y-2">
                                        <Label>מספר כרטיס אשראי (הדמיה)</Label>
                                        <Input placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="MM/YY" />
                                        <Input placeholder="CVV" />
                                    </div>
                                </div>
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded mt-4 text-sm">
                                    הערה: זהו אתר הדגמה. התשלום מדומק וההזמנה תירשם ללא חיוב בפועל.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="bg-white border-none shadow-sm sticky top-24">
                            <CardHeader>
                                <CardTitle>סיכום הזמנה</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {items.map(item => (
                                        <div key={item.productId} className="flex justify-between text-sm">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="pt-4 border-t">
                                    <Label>קוד קופון</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="הכנס קוד קופון"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon || !couponCode}
                                        >
                                            {isValidatingCoupon ? "בודק..." : "החל"}
                                        </Button>
                                    </div>
                                    {couponMessage && (
                                        <p className={`text-sm mt-1 ${couponDiscount > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {couponMessage}
                                        </p>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>סכום ביניים</span>
                                        <span>₪{cartTotal.toFixed(2)}</span>
                                    </div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>הנחה ({appliedCouponCode})</span>
                                            <span>-₪{couponDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg mt-2">
                                        <span>סה"כ לתשלום</span>
                                        <span>₪{(Math.max(0, cartTotal - couponDiscount)).toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-[#9F19FF] hover:bg-[#8F00FF] py-6 text-lg mt-6"
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "מעבד הזמנה..." : "בצע הזמנה"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
