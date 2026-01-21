import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { BookOpen, Scale, Shield, Truck, UndoDot, FileText } from "lucide-react";

const PolicySettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // States for each policy
    const [shipping, setShipping] = useState("");
    const [returns, setReturns] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [legal, setLegal] = useState("");
    const [terms, setTerms] = useState("");

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/content`);
            const data = await res.json();
            if (res.ok) {
                setShipping(data.policyShipping || "");
                setReturns(data.policyReturns || "");
                setPrivacy(data.policyPrivacy || "");
                setLegal(data.policyLegal || "");
                setTerms(data.policyTerms || "");
            }
        } catch (error) {
            console.error("Failed to fetch policies:", error);
            toast({ title: "שגיאה בטעינת הנתונים", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const updates = {
                policyShipping: shipping,
                policyReturns: returns,
                policyPrivacy: privacy,
                policyLegal: legal,
                policyTerms: terms
            };

            await fetch(`${API_BASE_URL}/api/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            toast({ title: "השינויים נשמרו בהצלחה!" });
        } catch (error) {
            toast({ title: "שגיאה בשמירה", description: "אנא נסה שנית", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const renderTab = (value: string, title: string, description: string, state: string, setter: (v: string) => void, icon: any) => (
        <TabsContent value={value} className="mt-6 space-y-6">
            <Card className="bg-white border-2 border-gray-100">
                <CardHeader className="bg-gray-50/50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-gray-800 justify-start flex-row-reverse">
                        <span className="mr-auto text-right w-full">{title}</span>
                        {icon}
                    </CardTitle>
                    <CardDescription className="text-right">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2 text-right">
                        <label className="text-sm font-medium w-full block text-right">תוכן העמוד</label>
                        <Textarea
                            value={state}
                            onChange={(e) => setter(e.target.value)}
                            className="min-h-[400px] text-base leading-relaxed bg-white text-gray-900 text-right p-4"
                            dir="rtl"
                            placeholder="הקלד את תוכן המדיניות כאן..."
                        />
                        <p className="text-xs text-gray-500 text-right w-full block mt-2">
                            ניתן להשתמש ב-HTML בסיסי לעיצוב (כמו &lt;b&gt;להדגשה&lt;/b&gt; או &lt;br&gt; לשורה חדשה), או פשוט לכתוב טקסט רגיל.
                        </p>
                    </div>

                    <div className="flex justify-start">
                        <Button onClick={handleSave} disabled={saving} className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white min-w-[150px]">
                            {saving ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900 text-right">דפי מדיניות ותנאים</h1>
                <p className="text-gray-500 mt-2 text-right">ניהול התוכן המשפטי ותנאי השימוש באתר.</p>
            </div>

            <Tabs defaultValue="shipping" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start w-full" dir="rtl">
                    <TabsTrigger value="shipping" className="data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white border bg-white px-4 py-2">
                        מדיניות משלוחים
                    </TabsTrigger>
                    <TabsTrigger value="returns" className="data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white border bg-white px-4 py-2">
                        החזרות וביטולים
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white border bg-white px-4 py-2">
                        מדיניות פרטיות
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white border bg-white px-4 py-2">
                        תוכן משפטי
                    </TabsTrigger>
                    <TabsTrigger value="terms" className="data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white border bg-white px-4 py-2">
                        תנאי שימוש
                    </TabsTrigger>
                </TabsList>

                {renderTab("shipping", "מדיניות משלוחים", "פירוט זמני משלוח, עלויות ואזורי חלוקה.", shipping, setShipping, <Truck className="w-5 h-5 text-gray-600 ml-2" />)}
                {renderTab("returns", "מדיניות החזרות וביטולים", "תנאי החזרת מוצרים, ביטול עסקה וזיכויים.", returns, setReturns, <UndoDot className="w-5 h-5 text-gray-600 ml-2" />)}
                {renderTab("privacy", "מדיניות פרטיות", "איזה מידע נאסף ואיך אנו שומרים עליו.", privacy, setPrivacy, <Shield className="w-5 h-5 text-gray-600 ml-2" />)}
                {renderTab("legal", "תוכן משפטי", "הצהרות משפטיות נוספות.", legal, setLegal, <Scale className="w-5 h-5 text-gray-600 ml-2" />)}
                {renderTab("terms", "תנאי שימוש", "תקנון האתר והסכם השימוש בו.", terms, setTerms, <BookOpen className="w-5 h-5 text-gray-600 ml-2" />)}
            </Tabs>
        </div>
    );
};

export default PolicySettings;
