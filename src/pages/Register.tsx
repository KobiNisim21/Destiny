import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import API_BASE_URL from "@/config";

const Register = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "שגיאה",
                description: "הסיסמאות אינן תואמות",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast({
                title: "ההרשמה הצליחה!",
                description: "כעת ניתן להתחבר למערכת",
            });

            navigate("/login");
        } catch (error: any) {
            toast({
                title: "שגיאה בהרשמה",
                description: error.message,
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
                    <h1 className="text-3xl font-bold text-center mb-6 text-[#22222A]">הרשמה</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">שם פרטי</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="ישראל"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">שם משפחה</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="ישראלי"
                                />
                            </div>
                        </div>

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
                            <Label htmlFor="phone">טלפון (אופציונלי)</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="050-0000000"
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#9F19FF] hover:bg-[#8A15DE] text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "נרשם..." : "הירשם"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        כבר יש לך חשבון?{" "}
                        <a href="/login" className="text-[#9F19FF] font-medium hover:underline">
                            התחבר כאן
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
