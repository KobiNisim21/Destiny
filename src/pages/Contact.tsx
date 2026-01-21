
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API_BASE_URL from "@/config";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.");
                setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
            } else {
                toast.error(data.message || "שגיאה בשליחת ההודעה");
            }
        } catch (error) {
            console.error(error);
            toast.error("שגיאה בחיבור לשרת");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-['Noto_Sans_Hebrew']" dir="rtl">
            <Navbar />

            <main className="pt-40 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#22222A]">צור קשר</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            יש לכם שאלה? אנחנו כאן לכל דבר. מלאו את הפרטים ונחזור אליכם בהקדם האפשרי.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Contact Info & Map/Image placeholder */}
                        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-2xl font-bold text-[#9F19FF]">פרטי התקשרות</h3>

                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-10 h-10 rounded-full bg-[#9F19FF]/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#9F19FF]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">אימייל</p>
                                        <p>support@destiny.co.il</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-10 h-10 rounded-full bg-[#9F19FF]/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[#9F19FF]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">כתובת</p>
                                        <p>תל אביב, ישראל</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative block or additional info */}
                            <div className="bg-gradient-to-br from-[#9F19FF] to-[#7DE400] p-8 rounded-2xl text-white shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">שירות לקוחות</h3>
                                <p className="mb-4 text-white/90">
                                    אנחנו זמינים למענה בימים א'-ה' בין השעות 09:00 - 18:00.
                                    פניות שיתקבלו בסופ"ש יענו ביום ראשון.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">שם פרטי <span className="text-red-500">*</span></label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                            placeholder="ישראל"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">שם משפחה <span className="text-red-500">*</span></label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                            placeholder="ישראלי"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">אימייל <span className="text-red-500">*</span></label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">טלפון (אופציונלי)</label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        placeholder="050-0000000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">תוכן ההודעה <span className="text-red-500">*</span></label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white transition-all resize-none"
                                        placeholder="כתוב את הודעתך כאן..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#22222A] hover:bg-[#9F19FF] text-white py-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                                >
                                    {loading ? 'שולח...' : 'שלח הודעה'}
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
