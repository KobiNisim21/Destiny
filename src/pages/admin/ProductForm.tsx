import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Upload, X, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "@/config";

interface ImageState {
    file: File | null;
    preview: string | null;
}

const ProductForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        section: "none",
        displaySlot: null,
        inStock: true,
        isNewArrival: false,
        faq: [] as { question: string; answer: string }[],
    });

    const DEFAULT_FAQS = [
        { question: "מה הגדלים הזמינים?", answer: "התייעצו בטבלת המידות שלנו בדף המוצר או פנו לשירות הלקוחות." },
        { question: "כיצד לשמור על המוצר?", answer: "מומלץ לכבס לפי ההוראות על התווית, בדרך כלל כביסה עדינה במים קרים." },
        { question: "מהי מדיניות ההחזרות?", answer: "ניתן להחזיר מוצר חדש באריזתו המקורית תוך 14 יום." }
    ];

    useEffect(() => {
        if (!isEditMode) {
            setFormData(prev => ({ ...prev, faq: DEFAULT_FAQS }));
        }
    }, [isEditMode]);

    // --- Image State Management ---
    // Main Image (Index 0)
    const [mainImage, setMainImage] = useState<ImageState>({ file: null, preview: null });
    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);

    // Hover Image (Index 1)
    const [hoverImage, setHoverImage] = useState<ImageState>({ file: null, preview: null });
    const [existingHoverImage, setExistingHoverImage] = useState<string | null>(null);

    // Gallery Images (Index 2+)
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setFormData({
                title: data.title,
                description: data.description,
                price: data.price,
                originalPrice: data.originalPrice || "",
                category: data.category,
                section: data.section || "none",
                displaySlot: data.displaySlot || null,
                inStock: data.inStock,
                isNewArrival: data.isNewArrival || false,
                faq: data.faq && data.faq.length > 0 ? data.faq : DEFAULT_FAQS,
            });

            // Distribute images
            if (data) {
                if (data.mainImage) setExistingMainImage(data.mainImage);
                if (data.hoverImage) setExistingHoverImage(data.hoverImage);
                if (data.galleryImages && Array.isArray(data.galleryImages)) {
                    setExistingGalleryImages(data.galleryImages);
                }
                // Fallback for old products that only have 'images' array
                else if (data.images && Array.isArray(data.images) && !data.mainImage) {
                    if (data.images.length > 0) setExistingMainImage(data.images[0]);
                    if (data.images.length > 1) setExistingHoverImage(data.images[1]);
                    if (data.images.length > 2) setExistingGalleryImages(data.images.slice(2));
                }
            }
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה", description: "טעינת נתוני מוצר נכשלה", variant: "destructive" });
        }
    };

    // Handle Main Image
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMainImage({
                file,
                preview: URL.createObjectURL(file)
            });
            setExistingMainImage(null); // Override existing
        }
    };

    // Handle Hover Image
    const handleHoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setHoverImage({
                file,
                preview: URL.createObjectURL(file)
            });
            setExistingHoverImage(null); // Override existing
        }
    };

    // Handle Gallery Images
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setGalleryFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryNew = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeGalleryExisting = (index: number) => {
        setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaq = [...formData.faq];
        newFaq[index][field] = value;
        setFormData({ ...formData, faq: newFaq });
    };

    const addFaq = () => {
        setFormData({ ...formData, faq: [...formData.faq, { question: "", answer: "" }] });
    };

    const removeFaq = (index: number) => {
        const newFaq = formData.faq.filter((_, i) => i !== index);
        setFormData({ ...formData, faq: newFaq });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            if (formData.originalPrice) data.append('originalPrice', formData.originalPrice.toString());
            data.append('category', formData.category);
            data.append('section', formData.section || 'none');
            if (formData.displaySlot) data.append('displaySlot', formData.displaySlot.toString());
            data.append('inStock', String(formData.inStock));
            data.append('isNewArrival', String(formData.isNewArrival));
            data.append('faq', JSON.stringify(formData.faq));

            // 1. Main Image
            if (mainImage.file) {
                data.append('mainImage', mainImage.file);
            } else if (existingMainImage) {
                data.append('existingMainImage', existingMainImage);
            }

            // 2. Hover Image
            if (hoverImage.file) {
                data.append('hoverImage', hoverImage.file);
            } else if (existingHoverImage) {
                data.append('existingHoverImage', existingHoverImage);
            }

            // 3. Gallery Images
            existingGalleryImages.forEach(img => data.append('existingGalleryImages', img));
            galleryFiles.forEach(file => data.append('galleryImages', file));

            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `${API_BASE_URL}/api/products/${id}`
                : `${API_BASE_URL}/api/products`;

            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (!res.ok) throw new Error('Failed to save');

            toast({ title: "המוצר נשמר בהצלחה!" });
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה", description: "שמירת המוצר נכשלה", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20" dir="rtl">
            <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 transition-colors">
                <Link to="/admin/products" className="flex items-center gap-2">
                    <ArrowRight size={20} />
                    חזרה לרשימת המוצרים
                </Link>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900">
                        {isEditMode ? 'עריכת מוצר' : 'הוספת מוצר חדש'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isEditMode ? 'עדכן את פרטי המוצר הקיים' : 'מלא את הפרטים ליצירת מוצר חדש בקטלוג'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Details */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle>פרטים כלליים</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">שם המוצר</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="לדוגמה: אוזניות גיימינג..."
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">קטגוריה</label>
                                <Input
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    placeholder="לדוגמה: אביזרים, ביגוד..."
                                    className="bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="section" className="text-sm font-medium">אזור תצוגה מיוחד</label>
                                    <select
                                        id="section"
                                        value={formData.section || 'none'}
                                        onChange={e => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="none">ללא (כללי)</option>
                                        <option value="featured">מוצרים נבחרים (Featured)</option>
                                        <option value="trinkets">טרינקטס (Trinkets)</option>
                                        <option value="pins">סיכות ומדבקות (Pins)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="displaySlot" className="text-sm font-medium">מיקום בקוביות (1-4)</label>
                                    <select
                                        id="displaySlot"
                                        value={formData.displaySlot || ''}
                                        onChange={e => setFormData({ ...formData, displaySlot: e.target.value ? Number(e.target.value) : null })}
                                        className="w-full h-10 px-3 rounded-md border border-input bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">ללא (יופיע רק ברשימה "הצג הכל")</option>
                                        <option value="1">קוביה 1 (ראשית/ימין)</option>
                                        <option value="2">קוביה 2</option>
                                        <option value="3">קוביה 3</option>
                                        <option value="4">קוביה 4 (אחרונה/שמאל)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">תיאור המוצר</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="תיאור מלא ושיווקי של המוצר..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">מחיר (₪)</label>
                                <Input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">מחיר מקורי (אופציונלי - למבצע)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.originalPrice}
                                    onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                    placeholder="השאר ריק אם אין מבצע"
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- New Images Layout --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader><CardTitle>תמונה ראשית (Main)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#9F19FF]/50 hover:bg-[#9F19FF]/5 transition-all text-center cursor-pointer relative aspect-square flex items-center justify-center bg-gray-50/50">
                                {mainImage.preview || existingMainImage ? (
                                    <div className="w-full h-full relative group">
                                        <img src={mainImage.preview || `${API_BASE_URL}${existingMainImage}`} className="w-full h-full object-cover rounded-lg shadow-sm" alt="Main" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <span className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm">לחץ להחלפה</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <div className="p-4 bg-white rounded-full shadow-sm">
                                            <ImageIcon size={32} className="text-[#9F19FF]" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-700">העלה תמונה ראשית</span>
                                            <span className="text-xs">מומלץ יחס 1:1 או 3:4</span>
                                        </div>
                                    </div>
                                )}
                                    </div>
                                )}
                                <Input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">זו התמונה שתוצג כברירת מחדל בכל רשימות המוצרים.</p>
                                <p className="text-xs text-gray-400 mt-0.5">פורמטים נתמכים: JPG, PNG, WEBP</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader><CardTitle>תמונת ריחוף (Hover - אופציונלי)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#9F19FF]/50 hover:bg-[#9F19FF]/5 transition-all text-center cursor-pointer relative aspect-square flex items-center justify-center bg-gray-50/50">
                                {hoverImage.preview || existingHoverImage ? (
                                    <div className="w-full h-full relative group">
                                        <img src={hoverImage.preview || `${API_BASE_URL}${existingHoverImage}`} className="w-full h-full object-cover rounded-lg shadow-sm" alt="Hover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <span className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm">לחץ להחלפה</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <div className="p-4 bg-white rounded-full shadow-sm">
                                            <ImageIcon size={32} className="text-[#9F19FF]" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-700">העלה תמונת ריחוף</span>
                                            <span className="text-xs">מופיעה במעבר עכבר</span>
                                        </div>
                                    </div>
                                )}
                                <Input type="file" accept="image/*" onChange={handleHoverImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">תמונה זו תופיע כאשר הלקוח יעבור עם העכבר על המוצר.</p>
                                <p className="text-xs text-gray-400 mt-0.5">פורמטים נתמכים: JPG, PNG, WEBP</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader><CardTitle>גלריית תמונות נוספות</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-[#9F19FF]/50 hover:bg-[#9F19FF]/5 transition-all text-center cursor-pointer relative bg-gray-50/50">
                            <Input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <Upload size={32} className="text-[#9F19FF]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-gray-700">לחץ להוספת תמונות לגלריה</span>
                                    <span className="text-xs">ניתן לבחור מספר תמונות יחד</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-2">פורמטים נתמכים: JPG, PNG, WEBP</p>

                        {(existingGalleryImages.length > 0 || galleryPreviews.length > 0) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                                {existingGalleryImages.map((img, index) => (
                                    <div key={`existing-gallery-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                                        <img src={`${API_BASE_URL}${img}`} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeGalleryExisting(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"><X size={14} /></button>
                                    </div>
                                ))}
                                {galleryPreviews.map((preview, index) => (
                                    <div key={`new-gallery-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                                        <img src={preview} alt={`New Gallery ${index}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeGalleryNew(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card >



                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>שאלות ותשובות (FAQ)</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-2">
                            <Plus size={16} />
                            הוסף שאלה
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formData.faq.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex-1 space-y-3">
                                    <Input
                                        placeholder="שאלה"
                                        value={item.question}
                                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                        className="bg-white font-medium"
                                    />
                                    <Textarea
                                        placeholder="תשובה"
                                        value={item.answer}
                                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                        className="bg-white min-h-[80px]"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFaq(index)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                        {formData.faq.length === 0 && (
                            <p className="text-center text-gray-400 py-4">אין שאלות ותשובות למוצר זה</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader><CardTitle>סטטוס מוצר</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50/50 transition-colors">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium text-gray-900 cursor-pointer">זמין במלאי</label>
                                <p className="text-sm text-gray-500">האם הלקוחות יכולים לרכוש מוצר זה כרגע?</p>
                            </div>
                            <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="w-5 h-5 accent-[#9F19FF] cursor-pointer" />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50/50 transition-colors">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium text-gray-900 cursor-pointer">מוצר חדש (New Arrival)</label>
                                <p className="text-sm text-gray-500">האם להציג תגית "חדש" על המוצר?</p>
                            </div>
                            <input type="checkbox" checked={formData.isNewArrival} onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })} className="w-5 h-5 accent-[#9F19FF] cursor-pointer" />
                        </div>
                    </CardContent>
                </Card>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center z-10 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:justify-end lg:mb-12">
                    <Button type="submit" disabled={loading} className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white font-medium px-8 py-4 h-12 w-full lg:w-auto rounded-xl shadow-lg shadow-[#9F19FF]/20 gap-2 text-base transition-all hover:scale-105 active:scale-95">
                        <Save size={20} />
                        {loading ? 'שומר שינויים...' : 'שמור מוצר'}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default ProductForm;
