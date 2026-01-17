import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import API_BASE_URL from "@/config";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    images: string[];
    inStock: boolean;
}

const Products = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log(`Fetching products from: ${API_BASE_URL}/api/products`);
            const res = await fetch(`${API_BASE_URL}/api/products`);

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Fetch failed: ${res.status} ${res.statusText}`, errorText);
                throw new Error(`Failed to fetch: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("API returned non-array data:", data);
                throw new Error("Invalid data format received");
            }

            setProducts(data);
        } catch (error) {
            console.error("Fetch error details:", error);
            toast({ title: "שגיאה", description: "לא ניתן לטעון מוצרים", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/products/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setProducts(products.filter(p => p._id !== deleteId));
                toast({ title: "המוצר נמחק בהצלחה" });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast({ title: "שגיאה", description: "מחיקת המוצר נכשלה", variant: "destructive" });
        } finally {
            setDeleteId(null);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900">ניהול מוצרים</h1>
                    <p className="text-gray-500 mt-1">סה"כ {products.length} מוצרים בחנות</p>
                </div>
                <Link to="/admin/products/new">
                    <Button className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 gap-2 rounded-xl">
                        <Plus size={20} />
                        הוסף מוצר חדש
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="חיפוש לפי שם או קטגוריה..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Products List */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">טוען מוצרים...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-4 w-20">תמונה</th>
                                <th className="p-4">שם המוצר</th>
                                <th className="p-4">קטגוריה</th>
                                <th className="p-4">מחיר</th>
                                <th className="p-4">סטטוס</th>
                                <th className="p-4 text-left">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                            {product.images[0] && (
                                                <img
                                                    src={`${API_BASE_URL}${product.images[0]}`}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{product.title}</td>
                                    <td className="p-4 text-gray-500">{product.category}</td>
                                    <td className="p-4 font-bold text-gray-900">₪{product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.inStock
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {product.inStock ? 'במלאי' : 'חסר'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/products/edit/${product._id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Pencil size={18} />
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeleteId(product._id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent dir="rtl">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            פעולה זו תמחק את המוצר "{product.title}" לצמיתות ולא ניתן יהיה לשחזר אותו.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                                                            מחק מוצר
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        לא נמצאו מוצרים תואמים לחיפוש.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;
