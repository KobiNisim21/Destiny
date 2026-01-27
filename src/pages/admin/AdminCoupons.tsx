import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Trash, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expirationDate: string;
    isActive: boolean;
    applicableType: 'all' | 'product' | 'collection';
    applicableIds: string[];
    usedCount: number;
}

interface Product {
    _id: string;
    title: string;
    name?: string;
}

const COLLECTION_OPTIONS = [
    { id: 'trinkets', label: 'Trinkets (מחזיקי מפתחות)' },
    { id: 'pins', label: 'Pins (סיכות)' },
    { id: 'featured', label: 'Featured (נבחרים)' },
    { id: 'apparel', label: 'Apparel (הלבשה)' } // Assuming we have apparel or 'none' implies general
];

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();

    // New Coupon State
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expirationDate: "",
        applicableType: "all",
        applicableIds: [] as string[]
    });

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/coupons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchProducts();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCoupon)
            });

            if (!res.ok) throw new Error('Failed to create coupon');

            toast({ title: "קופון נוצר בהצלחה" });
            setIsCreateOpen(false);
            setNewCoupon({
                code: "",
                discountType: "percentage",
                discountValue: "",
                expirationDate: "",
                applicableType: "all",
                applicableIds: []
            });
            fetchCoupons();

        } catch (error) {
            toast({ title: "שגיאה ביצירת קופון", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("האם אתה בתוך שברצונך למחוק קופון זה?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast({ title: "קופון נמחק" });
            fetchCoupons();
        } catch (error) {
            toast({ title: "שגיאה במחיקת קופון", variant: "destructive" });
        }
    };

    const toggleApplicableId = (id: string) => {
        setNewCoupon(prev => {
            const ids = prev.applicableIds.includes(id)
                ? prev.applicableIds.filter(i => i !== id)
                : [...prev.applicableIds, id];
            return { ...prev, applicableIds: ids };
        });
    };

    return (
        <div className="space-y-6 font-['Assistant']" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">ניהול קופונים</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#9F19FF] hover:bg-[#7DE400] text-white">
                            <Plus className="w-4 h-4 ml-2" />
                            קופון חדש
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>יצירת קופון חדש</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>קוד קופון (באנגלית)</Label>
                                <Input
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    required
                                    placeholder="SUMMER2026"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>סוג הנחה</Label>
                                    <Select
                                        value={newCoupon.discountType}
                                        onValueChange={(val) => setNewCoupon({ ...newCoupon, discountType: val as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">אחוזים (%)</SelectItem>
                                            <SelectItem value="fixed">סכום קבוע (₪)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>ערך ההנחה</Label>
                                    <Input
                                        type="number"
                                        value={newCoupon.discountValue}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>תאריך תפוגה</Label>
                                <Input
                                    type="date"
                                    value={newCoupon.expirationDate}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, expirationDate: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Applicability Section */}
                            <div className="space-y-2 border-t pt-4">
                                <Label className="text-base font-bold">תחולת הקופון</Label>
                                <Select
                                    value={newCoupon.applicableType}
                                    onValueChange={(val) => setNewCoupon({ ...newCoupon, applicableType: val as any, applicableIds: [] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">כל המוצרים בחנות</SelectItem>
                                        <SelectItem value="product">מוצרים ספציפיים</SelectItem>
                                        <SelectItem value="collection">קולקציות ספציפיות</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dynamic Selection Area */}
                            {newCoupon.applicableType === 'product' && (
                                <div className="space-y-2 animate-fade-in">
                                    <Label>בחר מוצרים ({newCoupon.applicableIds.length} נבחרו)</Label>
                                    <ScrollArea className="h-[200px] border rounded-md p-2">
                                        <div className="space-y-2">
                                            {products.map(p => (
                                                <div key={p._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer" onClick={() => toggleApplicableId(p._id)}>
                                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${newCoupon.applicableIds.includes(p._id) ? 'bg-[#9F19FF] border-[#9F19FF] text-white' : 'border-gray-300'}`}>
                                                        {newCoupon.applicableIds.includes(p._id) && <Check size={12} />}
                                                    </div>
                                                    <span className="text-sm">{p.title || p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {newCoupon.applicableType === 'collection' && (
                                <div className="space-y-2 animate-fade-in">
                                    <Label>בחר קולקציות</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {COLLECTION_OPTIONS.map(opt => (
                                            <div key={opt.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 bg-white" onClick={() => toggleApplicableId(opt.id)}>
                                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${newCoupon.applicableIds.includes(opt.id) ? 'bg-[#9F19FF] border-[#9F19FF] text-white' : 'border-gray-300'}`}>
                                                    {newCoupon.applicableIds.includes(opt.id) && <Check size={12} />}
                                                </div>
                                                <span className="text-sm">{opt.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-[#9F19FF] hover:bg-[#8F00FF]">
                                צור קופון
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">קוד</TableHead>
                            <TableHead className="text-right">הנחה</TableHead>
                            <TableHead className="text-right">סוג תכולה</TableHead>
                            <TableHead className="text-right">תוקף</TableHead>
                            <TableHead className="text-right">שימושים</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">טוען...</TableCell>
                            </TableRow>
                        ) : coupons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    לא נמצאו קופונים
                                </TableCell>
                            </TableRow>
                        ) : (
                            coupons.map((coupon) => (
                                <TableRow key={coupon._id}>
                                    <TableCell className="font-bold font-mono text-[#9F19FF]">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            {coupon.code}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₪${coupon.discountValue}`}
                                    </TableCell>
                                    <TableCell>
                                        {coupon.applicableType === 'all' && <span className="text-green-600 font-bold">כל החנות</span>}
                                        {coupon.applicableType === 'product' && <span className="text-blue-600">מוצרים ({coupon.applicableIds?.length || 0})</span>}
                                        {coupon.applicableType === 'collection' && <span className="text-purple-600">קולקציה ({coupon.applicableIds?.length || 0})</span>}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(coupon.expirationDate).toLocaleDateString('he-IL')}
                                    </TableCell>
                                    <TableCell>{coupon.usedCount}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(coupon._id)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminCoupons;
