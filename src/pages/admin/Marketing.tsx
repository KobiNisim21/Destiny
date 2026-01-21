import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";
import { Mail, Users, Send, Settings, Sparkles } from "lucide-react";

interface Subscriber {
    _id: string;
    email: string;
    subscribedAt: string;
    isActive: boolean;
}

const Marketing = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Automation Settings
    const [welcomeSubject, setWelcomeSubject] = useState("");
    const [welcomeBody, setWelcomeBody] = useState("");
    const [couponCode, setCouponCode] = useState("");

    // Campaign
    const [campaignSubject, setCampaignSubject] = useState("");
    const [campaignBody, setCampaignBody] = useState("");
    const [sending, setSending] = useState(false);

    // Subscribers
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

    useEffect(() => {
        fetchSettings();
        fetchSubscribers();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWelcomeSubject(data.marketingWelcomeSubject || "");
            setWelcomeBody(data.marketingWelcomeBody || "");
            setCouponCode(data.marketingCouponCode || "");
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSubscribers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const updates = {
                marketingWelcomeSubject: welcomeSubject,
                marketingWelcomeBody: welcomeBody,
                marketingCouponCode: couponCode
            };

            await fetch(`${API_BASE_URL}/api/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            toast({ title: "הגדרות נשמרו", description: "הודעת ברוכים הבאים וקוד הקופון עודכנו" });
        } catch (error) {
            toast({ title: "שגיאה", description: "שמירת ההגדרות נכשלה", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const sendCampaign = async () => {
        if (!confirm("האם את/ה בטוח/ה שברצונך לשלוח את המייל לכל המנויים?")) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/newsletter/send-campaign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subject: campaignSubject,
                    body: campaignBody
                })
            });

            if (res.ok) {
                toast({ title: "הקמפיין נשלח!", description: "המיילים נשלחים כעת ברקע לכל המנויים." });
                setCampaignSubject("");
                setCampaignBody("");
            } else {
                throw new Error("Failed");
            }
        } catch (error) {
            toast({ title: "שגיאה", description: "שליחת הקמפיין נכשלה", variant: "destructive" });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900">שיווק וניוזלטר</h1>
                <p className="text-gray-500 mt-2">ניהול רשימת התפוצה, אוטומציות וקמפיינים במייל.</p>
            </div>

            <Tabs defaultValue="automation" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="automation">אוטומציה</TabsTrigger>
                    <TabsTrigger value="campaign">קמפיין חדש</TabsTrigger>
                    <TabsTrigger value="subscribers">מנויים</TabsTrigger>
                </TabsList>

                {/* Automation Tab */}
                <TabsContent value="automation" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#9F19FF]" />
                                מייל ״ברוכים הבאים״ אוטומטי
                            </CardTitle>
                            <CardDescription>
                                מייל זה נשלח אוטומטית לכל משתמש חדש שנרשם לרשימת התפוצה.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">כותרת המייל (Subject)</label>
                                <Input
                                    value={welcomeSubject}
                                    onChange={(e) => setWelcomeSubject(e.target.value)}
                                    placeholder="ברוכים הבאים ל-Destiny! ✨ קוד הקופון שלך בפנים"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">קוד קופון להזמנה ראשונה</label>
                                <Input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="WELCOME15"
                                    className="font-mono text-center text-lg tracking-wider border-[#9F19FF]/50"
                                />
                                <p className="text-xs text-gray-500">
                                    ניתן להשתמש ב-<code>{`{{couponCode}}`}</code> בתוך גוף המייל כדי לשתול את הקוד אוטומטית.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">תוכן המייל (HTML)</label>
                                <Textarea
                                    value={welcomeBody}
                                    onChange={(e) => setWelcomeBody(e.target.value)}
                                    className="min-h-[300px] font-mono text-sm"
                                    dir="ltr"
                                />
                                <p className="text-xs text-gray-500">
                                    טיפ: המערכת עוטפת את התוכן הזה בעיצוב הכללי של המותג אוטומטית. אין צורך להוסיף <code>&lt;html&gt;</code> וכו'.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={saveSettings} disabled={loading} className="bg-[#9F19FF]">
                                    {loading ? 'שומר...' : 'שמור הגדרות'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campaign Tab */}
                <TabsContent value="campaign" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <Send className="w-5 h-5 text-[#9F19FF]" />
                                שליחת קמפיין חדש
                            </CardTitle>
                            <CardDescription>
                                שליחת מייל יזום לכל {subscribers.filter(s => s.isActive).length} המנויים הפעילים.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">כותרת המייל</label>
                                <Input
                                    value={campaignSubject}
                                    onChange={(e) => setCampaignSubject(e.target.value)}
                                    placeholder="מבצע מטורף ל-24 שעות בלבד! ⏰"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">תוכן המייל (HTML)</label>
                                <Textarea
                                    value={campaignBody}
                                    onChange={(e) => setCampaignBody(e.target.value)}
                                    className="min-h-[400px] font-mono text-sm"
                                    dir="ltr"
                                    placeholder="<h1>המבצע התחיל!</h1><p>...</p>"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={sendCampaign}
                                    disabled={sending || !campaignSubject || !campaignBody}
                                    className="bg-[#22222A] hover:bg-[#9F19FF]"
                                >
                                    {sending ? 'שולח...' : 'שלח קמפיין לכולם 🚀'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Subscribers Tab */}
                <TabsContent value="subscribers" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                רשימת מנויים ({subscribers.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-right">אימייל</TableHead>
                                            <TableHead className="text-right">תאריך הרשמה</TableHead>
                                            <TableHead className="text-right">סטטוס</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscribers.map((sub) => (
                                            <TableRow key={sub._id}>
                                                <TableCell className="font-medium">{sub.email}</TableCell>
                                                <TableCell>{new Date(sub.subscribedAt).toLocaleDateString('he-IL')}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {sub.isActive ? 'פעיל' : 'לא פעיל'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {subscribers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                                    אין עדיין מנויים ברשימה.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Marketing;
