import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

const ResetPassword = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({ title: "שגיאה", description: "הסיסמאות אינן תואמות", variant: "destructive" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast({ title: "הצלחה!", description: "הסיסמה שונתה בהצלחה. כעת ניתן להתחבר." });
                navigate("/login");
            } else {
                toast({ title: "שגיאה", description: data.message || "נכשל באיפוס הסיסמה", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "שגיאה", description: "שגיאת תקשורת", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Assistant']" dir="rtl">
                <Card className="w-full max-w-md p-6 text-center">
                    <CardTitle className="text-red-500 mb-2">קישור לא תקין</CardTitle>
                    <CardDescription>חסר מזהה ייחודי (Token) בקישור.</CardDescription>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-['Assistant']" dir="rtl">
            <Navbar />
            <Card className="w-full max-w-md shadow-lg border-none bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">איפוס סיסמה</CardTitle>
                    <CardDescription>
                        הזן את הסיסמה החדשה שלך למטה.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="סיסמה חדשה"
                                    className="pr-10 text-right"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="אמת סיסמה חדשה"
                                    className="pr-10 text-right"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-[#9F19FF] hover:bg-[#8F00FF]" disabled={loading}>
                            {loading ? "מעדכן..." : "שמור סיסמה חדשה"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
