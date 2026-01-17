import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "@/config";

const CartDrawer = () => {
    const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col p-0 bg-white" dir="rtl">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-right flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        סל הקניות שלי
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">הסל שלך ריק</p>
                        <Button className="mt-4" variant="outline" onClick={() => setIsCartOpen(false)}>
                            המשך בקניות
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-sm font-bold text-[#9F19FF]">₪{item.price}</p>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <button
                                                        className="p-1 hover:bg-gray-100"
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                                                    onClick={() => removeFromCart(item.productId)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-6 border-t bg-gray-50">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">משלוח</span>
                                    <span>יחושב בקופה</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>סה"כ לתשלום</span>
                                    <span>₪{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button className="w-full bg-[#9F19FF] hover:bg-[#8F00FF] py-6 text-lg" onClick={handleCheckout}>
                                מעבר לתשלום
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
