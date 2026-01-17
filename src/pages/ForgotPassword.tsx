import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";

const ForgotPassword = () => {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSent(true);
                toast({ title: "המייל נשלח!", description: "בדוק את תיבת הדואר שלך להוראות לאיפוס הסיסמה." });
            } else {
                toast({ title: "שגיאה", description: data.message || "נכשל בשליחת המייל", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "שגיאה", description: "שגיאת תקשורת", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-['Assistant']" dir="rtl">
            <Navbar /> {/* Ensure Navbar is present if desired, or just layout */}
            <Card className="w-full max-w-md shadow-lg border-none bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">שכחת סיסמה?</CardTitle>
                    <CardDescription>
                        אל דאגה! הכנס את המייל שלך ונשלח לך קישור לאיפוס הסיסמה.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="user@example.com"
                                        className="pr-10 text-right"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-[#9F19FF] hover:bg-[#8F00FF]" disabled={loading}>
                                {loading ? "שולח..." : "שלח קישור לאיפוס"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-100 text-green-600 p-4 rounded-lg">
                                מייל נשלח לכתובת <strong>{email}</strong>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/login">חזרה להתחברות</Link>
                            </Button>
                        </div>
                    )}
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-sm text-gray-600 hover:text-[#9F19FF] flex items-center justify-center gap-1">
                            <ArrowRight className="h-4 w-4" /> חזרה לדף הכניסה
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
