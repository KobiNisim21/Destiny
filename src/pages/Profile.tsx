import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import API_BASE_URL from "@/config";
import Footer from "@/components/Footer";

import {
    validateHebrewName,
    validateEmail,
    validatePhone,
    validateAddress,
    validateCity,
    validateZip
} from "@/lib/validators";

const Profile = () => {
    const { user, login } = useAuth(); // login used to update context
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        zipCode: "",
        country: "Israel",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                street: user.address?.street || "",
                city: user.address?.city || "",
                zipCode: user.address?.zipCode || "",
                country: user.address?.country || "Israel",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        const firstNameRes = validateHebrewName(formData.firstName, 'שם פרטי');
        if (!firstNameRes.isValid) newErrors.firstName = firstNameRes.message!;

        const lastNameRes = validateHebrewName(formData.lastName, 'שם משפחה');
        if (!lastNameRes.isValid) newErrors.lastName = lastNameRes.message!;

        const emailRes = validateEmail(formData.email);
        if (!emailRes.isValid) newErrors.email = emailRes.message!;

        const phoneRes = validatePhone(formData.phone);
        if (!phoneRes.isValid) newErrors.phone = phoneRes.message!;

        const addressRes = validateAddress(formData.street);
        if (!addressRes.isValid) newErrors.street = addressRes.message!;

        const cityRes = validateCity(formData.city);
        if (!cityRes.isValid) newErrors.city = cityRes.message!;

        const zipRes = validateZip(formData.zipCode);
        if (!zipRes.isValid) newErrors.zipCode = zipRes.message!;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({ title: "שגיאה בטופס", description: "אנא תקן את השגיאות בטופס", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email, // Note: Changing email normally requires verification
                    phone: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        zipCode: formData.zipCode,
                        country: formData.country,
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to update profile");

            // Update local context
            if (token) {
                login(token, data.user);
            }

            toast({ title: "הפרופיל עודכן בהצלחה!" });

        } catch (error: any) {
            console.error("Profile update error", error);
            toast({ title: "שגיאה בעדכון הפרופיל", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-['Assistant']" dir="rtl">
                <p>אנא התחבר כדי לצפות בפרופיל.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-['Assistant']" dir="rtl">
            <Navbar />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">הפרופיל שלי</h1>

                <Card className="bg-white border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>פרטים אישיים</CardTitle>
                        <CardDescription>עדכן את הפרטים האישיים וכתובת המשלוח שלך.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">שם פרטי</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={errors.firstName ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">שם משפחה</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={errors.lastName ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">אימייל</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">טלפון</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium mb-4">כתובת למשלוח</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="street">רחוב ומספר בית</Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            placeholder="הרקפת 42"
                                            className={errors.street ? "border-red-500" : ""}
                                        />
                                        {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">עיר</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="תל אביב"
                                                className={errors.city ? "border-red-500" : ""}
                                            />
                                            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">מיקוד</Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className={errors.zipCode ? "border-red-500" : ""}
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">מדינה</Label>
                                        <Input id="country" name="country" value={formData.country} onChange={handleChange} disabled className="bg-gray-100" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="bg-[#9F19FF] hover:bg-[#8F00FF]" disabled={isLoading}>
                                    {isLoading ? "שומר..." : "שמור שינויים"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
