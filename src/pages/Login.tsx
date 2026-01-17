import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import API_BASE_URL from "@/config";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            login(data.token, data.user);

            toast({
                title: "התחברת בהצלחה!",
            });

            navigate("/"); // Redirect to home or dashboard
        } catch (error: any) {
            toast({
                title: "שגיאה בהתחברות",
                description: error.message || "אירעה שגיאה בלתי צפויה",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <Navbar />
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-6 text-[#22222A]">התחברות</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">אימייל</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">סיסמה</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="text-left">
                                <a href="/forgot-password" className="text-sm text-gray-500 hover:text-[#9F19FF]">
                                    שכחת סיסמה?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#9F19FF] hover:bg-[#8A15DE] text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "מתחבר..." : "התחבר"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        עדיין אין לך חשבון?{" "}
                        <a href="/register" className="text-[#9F19FF] font-medium hover:underline">
                            הירשם כאן
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
