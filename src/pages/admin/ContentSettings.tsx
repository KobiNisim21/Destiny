import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import API_BASE_URL from "@/config";

const ContentSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        heroTitle: "",
        heroSubtitle: "",
        heroVideo: "",
        heroYoutubeUrl: "",
        aboutTitle1: "",
        aboutTitle2: "",
        aboutTitle3: "",
        aboutDescription: "",
        aboutSubscribers: "",
        aboutSubscribersLabel: "",
        aboutFollowers: "",
        aboutFollowersLabel: "",
        aboutVideos: "",
        aboutVideosLabel: "",
        aboutImage: "",
        aboutVideoUrl: "",
        aboutButtonVideoText: "",

        aboutButtonCollectionText: "",
        faqTitle: "",
        faqSubtitle: "",
        faqItems: [] as { question: string; answer: string }[],
        heroInfoItems: [] as { icon: string; title: string; subtitle: string }[],
        footerCopyright: "",
        footerSocialYoutube: "",
        footerSocialInstagram: "",
        footerSocialTiktok: "",

        // YouTube Section
        youtubeTitle: "",
        youtubeSubtitle: "",

        // Newsletter Section
        newsletterTitle: "",
        newsletterSubtitle: "",
        newsletterButtonText: "",
        newsletterBenefits: [] as { text: string }[],

        // New Arrivals Section
        newArrivalsTitle: "",
        newArrivalsSubtitle: "",
        newArrivalsTagText: "",
        newArrivalsButtonText: "",
        newArrivalsFeatures: [] as { title: string; description: string }[],

        // New separate About Page fields
        pageAboutTitle1: "",
        pageAboutTitle2: "",
        pageAboutTitle3: "",
        pageAboutDescription: "",
        pageAboutImage: "",
        pageAboutSubscribers: "",
        pageAboutSubscribersLabel: "",
        pageAboutFollowers: "",
        pageAboutFollowersLabel: "",
        pageAboutVideos: "",
        pageAboutVideosLabel: "",
    });
    const [menuItems, setMenuItems] = useState([
        { id: 'home', label: 'דף הבית', type: 'scroll', target: 'hero-section' },
        { id: 'featured', label: 'נבחרים', type: 'scroll', target: 'featured-section' },
        { id: 'trinkets', label: 'טרינקטס', type: 'scroll', target: 'trinkets-section' },
        { id: 'new', label: 'חדשים', type: 'scroll', target: 'new-arrivals-section' },
        { id: 'about', label: 'אודות', type: 'route', target: '/about' },
    ]);
    const [file, setFile] = useState<File | null>(null);
    const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
    const [pageAboutImageFile, setPageAboutImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/content`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSettings({
                heroTitle: data.heroTitle || "",
                heroSubtitle: data.heroSubtitle || "",
                heroVideo: data.heroVideo || "",
                heroYoutubeUrl: data.heroYoutubeUrl || "",
                aboutTitle1: data.aboutTitle1 || "לחלום.",
                aboutTitle2: data.aboutTitle2 || "ליצור.",
                aboutTitle3: data.aboutTitle3 || "להעניק.",
                aboutDescription: data.aboutDescription || "ברוכים הבאים לקולקציית המרצ'נדייז הרשמית של דסטני. עיצובים בלעדיים, מכירות מוגבלות ומוצרים שיוצרו באהבה עבור הקהילה המדהימה שלי. ✨",
                aboutSubscribers: data.aboutSubscribers || "+153K",
                aboutSubscribersLabel: data.aboutSubscribersLabel || "רשומים לערוץ",
                aboutFollowers: data.aboutFollowers || "+35K",
                aboutFollowersLabel: data.aboutFollowersLabel || "עוקבים בטיקטוק",
                aboutVideos: data.aboutVideos || "+370",
                aboutVideosLabel: data.aboutVideosLabel || "סירטונים ביוטיוב",
                aboutImage: data.aboutImage || "",
                aboutVideoUrl: data.aboutVideoUrl || "",
                aboutButtonVideoText: data.aboutButtonVideoText || "לצפייה בסירטון",
                aboutButtonCollectionText: data.aboutButtonCollectionText || "לחנות הקולקציות",
                faqTitle: data.faqTitle || "שאלות נפוצות",
                faqSubtitle: data.faqSubtitle || "כל מה שצריך לדעת על הזמנות, משלוחים והחזרות",
                faqItems: data.faqItems && data.faqItems.length > 0 ? data.faqItems : [
                    {
                        question: "כמה זמן לוקח המשלוח?",
                        answer: "משלוח רגיל לוקח 3-5 ימי עסקים בישראל. משלוח בינלאומי לוקח בדרך כלל 7-14 ימי עסקים. תקבלו מספר מעקב ברגע שההזמנה תצא!",
                    },
                    {
                        question: "מה מדיניות ההחזרות שלכם?",
                        answer: "אנחנו מציעים מדיניות החזרה של 30 יום לכל הפריטים שלא נלבשו, לא נשטפו ועם התגיות עדיין מחוברות. אם אתם לא מרוצים מהרכישה, פנו לצוות התמיכה שלנו כדי להתחיל בהחזרה.",
                    },
                    {
                        question: "איך אני יודע איזה מידה להזמין?",
                        answer: "בכל עמוד מוצר יש טבלת מידות מפורטת. אנחנו ממליצים למדוד בגד שמתאים לכם היטב ולהשוות לטבלאות שלנו. אם אתם בין מידות, מומלץ לקחת מידה גדולה יותר לגזרה רפויה יותר.",
                    },
                    {
                        question: "האם המוצרים במהדורה מוגבלת?",
                        answer: "הרבה מהפריטים שלנו יוצאים במהדורות מוגבלות וברגע שנגמרים, הם לא חוזרים. אנחנו משיקים קולקציות חדשות באופן קבוע, אז הירשמו לניוזלטר כדי להישאר מעודכנים!",
                    },
                    {
                        question: "איך אני יכול לעקוב אחרי ההזמנה שלי?",
                        answer: "ברגע שההזמנה נשלחה, תקבלו מייל עם מספר מעקב. אתם יכולים גם לבדוק את סטטוס ההזמנה בכל עת דרך החשבון שלכם באתר.",
                    },
                    {
                        question: "האם אתם שולחים לחו״ל?",
                        answer: "כן! אנחנו שולחים לרוב המדינות בעולם. עלויות המשלוח וזמני האספקה משתנים לפי מיקום ויחושבו בקופה. שימו לב שהזמנות בינלאומיות עשויות להיות כפופות לעמלות מכס.",
                    },
                ],
                heroInfoItems: data.heroInfoItems && data.heroInfoItems.length > 0 ? data.heroInfoItems : [
                    { icon: 'badge', title: 'מוצרים איכותיים', subtitle: 'סטנדרט פרימיום' },
                    { icon: 'shield', title: 'קנייה בטוחה', subtitle: 'תשלום מאובטח ומוגן' },
                    { icon: 'truck', title: 'משלוח חינם בקנייה מעל ₪349', subtitle: 'אספקה מהירה ונוחה' }
                ],
                footerCopyright: data.footerCopyright || "© 2025 כל הזכויות שמורות - שם העסק",
                footerSocialYoutube: data.footerSocialYoutube || "https://youtube.com",
                footerSocialInstagram: data.footerSocialInstagram || "https://instagram.com",
                footerSocialTiktok: data.footerSocialTiktok || "https://tiktok.com",

                // YouTube Defaults
                youtubeTitle: data.youtubeTitle || "הגיימרים הגדולים בארץ כבר התנסו ואהבו,",
                youtubeSubtitle: data.youtubeSubtitle || "מה איתכם?",

                // Newsletter Defaults
                newsletterTitle: data.newsletterTitle || "הצטרפו לקבוצה שלי",
                newsletterSubtitle: data.newsletterSubtitle || "קבלו גישה בלעדית לדרופים חדשים, הנחות מיוחדות, ותוכן מאחורי הקלעים. וגם - 15% הנחה על ההזמנה הראשונה!",
                newsletterButtonText: data.newsletterButtonText || "הצטרפו עכשיו",
                newsletterBenefits: data.newsletterBenefits && data.newsletterBenefits.length > 0 ? data.newsletterBenefits : [
                    { text: "משלוח חינם מעל ₪395" },
                    { text: "הטבות בלעדיות לחברים" },
                    { text: "גישה מוקדמת להטבות" }
                ],

                // New Arrivals Defaults
                newArrivalsTitle: data.newArrivalsTitle || "פריטים חדשים.",
                newArrivalsSubtitle: data.newArrivalsSubtitle || "היו הראשונים להשיג את המוצר החדש ביותר. כמות מוגבלת זמינה - ברגע שהם נגמרים, הם נגמרים לתמיד!",
                newArrivalsTagText: data.newArrivalsTagText || "מוצרים שנחתו עכשיו",
                newArrivalsButtonText: data.newArrivalsButtonText || "הזמינו עכשיו",
                newArrivalsFeatures: data.newArrivalsFeatures && data.newArrivalsFeatures.length > 0 ? data.newArrivalsFeatures : [
                    { title: "מהדורות במהדורה מוגבלת", description: "עיצובים בלעדיים שלא תמצאו בשום מקום אחר" },
                    { title: "חומרים איכותיים", description: "בדים איכותיים לנוחות מרבית" },
                    { title: "משלוח מהיר", description: "קבלו את הסחורה שלכם תוך 3-5 ימים" }
                ],

                // Page About Defaults (Fallback to homepage ones initially if empty)
                pageAboutTitle1: data.pageAboutTitle1 || "לחלום.",
                pageAboutTitle2: data.pageAboutTitle2 || "ליצור.",
                pageAboutTitle3: data.pageAboutTitle3 || "להעניק.",
                pageAboutDescription: data.pageAboutDescription || "ברוכים הבאים לקולקציית המרצ'נדייז הרשמית של דסטני...",
                pageAboutImage: data.pageAboutImage || "",
                pageAboutSubscribers: data.pageAboutSubscribers || "+153K",
                pageAboutSubscribersLabel: data.pageAboutSubscribersLabel || "רשומים לערוץ",
                pageAboutFollowers: data.pageAboutFollowers || "+35K",
                pageAboutFollowersLabel: data.pageAboutFollowersLabel || "עוקבים בטיקטוק",
                pageAboutVideos: data.pageAboutVideos || "+370",
                pageAboutVideosLabel: data.pageAboutVideosLabel || "סירטונים ביוטיוב",
            });
            if (data.menuItems) {
                setMenuItems(data.menuItems);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (fileToUpload: File) => {
        if (!fileToUpload) return null;

        const formData = new FormData();
        formData.append('file', fileToUpload);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/api/content/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            return data.filePath;
        } catch (error) {
            console.error('Upload error:', error);
            toast({ title: "שגיאה", description: "העלאת הקובץ נכשלה", variant: "destructive" });
            return null;
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let videoPath = settings.heroVideo;
            let aboutImagePath = settings.aboutImage;
            let pageAboutImagePath = settings.pageAboutImage;

            if (file) {
                const uploadedPath = await handleUpload(file);
                if (uploadedPath) videoPath = uploadedPath;
            }

            if (aboutImageFile) {
                const uploadedPath = await handleUpload(aboutImageFile);
                if (uploadedPath) aboutImagePath = uploadedPath;
            }

            if (pageAboutImageFile) {
                const uploadedPath = await handleUpload(pageAboutImageFile);
                if (uploadedPath) pageAboutImagePath = uploadedPath;
            }

            const token = localStorage.getItem('token');
            const updates = {
                ...settings,
                heroVideo: videoPath,
                aboutImage: aboutImagePath,
                pageAboutImage: pageAboutImagePath,
                menuItems: menuItems
            };

            await fetch(`${API_BASE_URL}/api/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            setSettings(updates);
            setFile(null);
            setAboutImageFile(null);
            setPageAboutImageFile(null);
            toast({ title: "נשמר בהצלחה", description: "ההגדרות עודכנו באתר" });
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה", description: "שמירת השינויים נכשלה", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900">ניהול תוכן</h1>
                <p className="text-gray-500 mt-2">כאן ניתן לערוך את האלמנטים הראשיים באתר שאינם מוצרים.</p>
            </div>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">סרטון ראשי (Hero Video)</CardTitle>
                    <CardDescription>
                        זהו הסרטון הגדול שמופיע בראש דף הבית מיד בכניסה לאתר.
                        <br />
                        מומלץ להעלות סרטון ביחס רוחב 16:9 ובמשקל סביר (עד 50MB).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {/* YouTube URL Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">או: הדבק קישור מ-YouTube</label>
                        <Input
                            value={settings.heroYoutubeUrl || ""}
                            onChange={(e) => setSettings({ ...settings, heroYoutubeUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            dir="ltr"
                        />
                        <p className="text-xs text-gray-500">אם מוזן קישור ליוטיוב, הוא יגבר על הסרטון שהועלה.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">או</span>
                        </div>
                    </div>

                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#9F19FF]/50 transition-colors bg-gray-50/50">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <label className="text-lg font-medium text-gray-700 cursor-pointer hover:text-[#9F19FF] transition-colors">
                                {file ? `קובץ נבחר: ${file.name}` : 'לחץ כאן לבחירת סרטון חדש מהמחשב'}
                                <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {settings.heroVideo && !file && (
                                <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                    ✓ קיים סרטון פעיל באתר
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">פורמטים נתמכים: MP4, MOV</p>
                        </div>
                    </div>

                    {file && (
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white font-medium px-8 py-2 h-12 rounded-xl shadow-lg shadow-[#9F19FF]/20"
                            >
                                {loading ? 'מעלה את הסרטון...' : 'שמור והחלף סרטון'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">סקשן יוטיוב (משפיענים/גיימרים)</CardTitle>
                    <CardDescription>עריכת הכותרות המופיעות מעל רצועת הסרטונים.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">כותרת עליונה (שחור)</label>
                        <Input
                            value={settings.youtubeTitle}
                            onChange={(e) => setSettings({ ...settings, youtubeTitle: e.target.value })}
                            placeholder="הגיימרים הגדולים בארץ כבר התנסו ואהבו,"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">כותרת תחתונה (סגול)</label>
                        <Input
                            value={settings.youtubeSubtitle}
                            onChange={(e) => setSettings({ ...settings, youtubeSubtitle: e.target.value })}
                            placeholder="מה איתכם?"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">סקשן הצטרפות (ניוזלטר)</CardTitle>
                    <CardDescription>עריכת הטקסטים וההטבות המופיעים ב"הצטרפו לקבוצה שלי".</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">כותרת ראשית</label>
                        <Input
                            value={settings.newsletterTitle}
                            onChange={(e) => setSettings({ ...settings, newsletterTitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">כותרת משנה</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={settings.newsletterSubtitle}
                            onChange={e => setSettings({ ...settings, newsletterSubtitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">טקסט כפתור</label>
                        <Input
                            value={settings.newsletterButtonText}
                            onChange={(e) => setSettings({ ...settings, newsletterButtonText: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <label className="text-sm font-medium">הטבות (אייקונים למטה)</label>
                        {settings.newsletterBenefits.map((item, index) => (
                            <div key={index} className="flex gap-4 items-center p-3 border rounded-xl bg-gray-50">
                                <span className="font-bold text-gray-400">#{index + 1}</span>
                                <Input
                                    value={item.text}
                                    onChange={(e) => {
                                        const newItems = [...settings.newsletterBenefits];
                                        newItems[index].text = e.target.value;
                                        setSettings({ ...settings, newsletterBenefits: newItems });
                                    }}
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        const newItems = settings.newsletterBenefits.filter((_, i) => i !== index);
                                        setSettings({ ...settings, newsletterBenefits: newItems });
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setSettings({
                                ...settings,
                                newsletterBenefits: [...settings.newsletterBenefits, { text: "" }]
                            })}
                            className="w-full border-dashed"
                        >
                            + הוסף הטבה
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">פריטים חדשים (New Arrivals)</CardTitle>
                    <CardDescription>עריכת הטקסטים בסקשן המציג את המוצר החדש ביותר.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת ראשית</label>
                            <Input
                                value={settings.newArrivalsTitle}
                                onChange={(e) => setSettings({ ...settings, newArrivalsTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">תגית (Tag)</label>
                            <Input
                                value={settings.newArrivalsTagText}
                                onChange={(e) => setSettings({ ...settings, newArrivalsTagText: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">תיאור משני</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={settings.newArrivalsSubtitle}
                            onChange={e => setSettings({ ...settings, newArrivalsSubtitle: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">טקסט כפתור</label>
                        <Input
                            value={settings.newArrivalsButtonText}
                            onChange={(e) => setSettings({ ...settings, newArrivalsButtonText: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <label className="text-sm font-medium">רשימת פיצ'רים (3 פריטים)</label>
                        {settings.newArrivalsFeatures.map((feature, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 border rounded-xl bg-gray-50">
                                <span className="font-bold text-gray-400 mt-2">#{index + 1}</span>
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="כותרת הפיצ'ר"
                                        value={feature.title}
                                        onChange={(e) => {
                                            const newFeatures = [...settings.newArrivalsFeatures];
                                            newFeatures[index].title = e.target.value;
                                            setSettings({ ...settings, newArrivalsFeatures: newFeatures });
                                        }}
                                    />
                                    <Input
                                        placeholder="תיאור הפיצ'ר"
                                        value={feature.description}
                                        onChange={(e) => {
                                            const newFeatures = [...settings.newArrivalsFeatures];
                                            newFeatures[index].description = e.target.value;
                                            setSettings({ ...settings, newArrivalsFeatures: newFeatures });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">סרגל מידע (מתחת לוידאו)</CardTitle>
                    <CardDescription>כאן ניתן לערוך את האייקונים והטקסטים המופיעים בשורה השחורה מתחת לוידאו הראשי.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                        {settings.heroInfoItems.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 border rounded-xl bg-gray-50">
                                <div className="space-y-2 w-[150px]">
                                    <label className="text-xs font-medium">אייקון</label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={item.icon}
                                        onChange={(e) => {
                                            const newItems = [...settings.heroInfoItems];
                                            newItems[index].icon = e.target.value;
                                            setSettings({ ...settings, heroInfoItems: newItems });
                                        }}
                                    >
                                        <option value="badge">תג (Badge)</option>
                                        <option value="shield">מגן (Shield)</option>
                                        <option value="truck">משאית (Truck)</option>
                                        <option value="credit-card">כרטיס אשראי</option>
                                        <option value="star">כוכב</option>
                                        <option value="heart">לב</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">כותרת</label>
                                        <Input
                                            value={item.title}
                                            onChange={(e) => {
                                                const newItems = [...settings.heroInfoItems];
                                                newItems[index].title = e.target.value;
                                                setSettings({ ...settings, heroInfoItems: newItems });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">כותרת משנה</label>
                                        <Input
                                            value={item.subtitle}
                                            onChange={(e) => {
                                                const newItems = [...settings.heroInfoItems];
                                                newItems[index].subtitle = e.target.value;
                                                setSettings({ ...settings, heroInfoItems: newItems });
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="mt-6"
                                    onClick={() => {
                                        const newItems = settings.heroInfoItems.filter((_, i) => i !== index);
                                        setSettings({ ...settings, heroInfoItems: newItems });
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setSettings({
                                ...settings,
                                heroInfoItems: [...settings.heroInfoItems, { icon: "star", title: "חדש", subtitle: "תיאור" }]
                            })}
                            className="w-full border-dashed"
                        >
                            + הוסף פריט חדש
                        </Button>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">אודות היוצר (About Section)</CardTitle>
                    <CardDescription>עריכת הטקסטים והתמונה באזור "אודות" (דף הבית).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 1</label>
                            <Input value={settings.aboutTitle1} onChange={e => setSettings({ ...settings, aboutTitle1: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 2</label>
                            <Input value={settings.aboutTitle2} onChange={e => setSettings({ ...settings, aboutTitle2: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 3</label>
                            <Input value={settings.aboutTitle3} onChange={e => setSettings({ ...settings, aboutTitle3: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">תיאור ראשי</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={settings.aboutDescription}
                            onChange={e => setSettings({ ...settings, aboutDescription: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 1 (מספר)</label>
                            <Input value={settings.aboutSubscribers} onChange={e => setSettings({ ...settings, aboutSubscribers: e.target.value })} dir="ltr" />
                            <Input value={settings.aboutSubscribersLabel} onChange={e => setSettings({ ...settings, aboutSubscribersLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 2 (מספר)</label>
                            <Input value={settings.aboutFollowers} onChange={e => setSettings({ ...settings, aboutFollowers: e.target.value })} dir="ltr" />
                            <Input value={settings.aboutFollowersLabel} onChange={e => setSettings({ ...settings, aboutFollowersLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 3 (מספר)</label>
                            <Input value={settings.aboutVideos} onChange={e => setSettings({ ...settings, aboutVideos: e.target.value })} dir="ltr" />
                            <Input value={settings.aboutVideosLabel} onChange={e => setSettings({ ...settings, aboutVideosLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כפתור וידאו (טקסט)</label>
                            <Input value={settings.aboutButtonVideoText} onChange={e => setSettings({ ...settings, aboutButtonVideoText: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כפתור קולקציות (טקסט)</label>
                            <Input value={settings.aboutButtonCollectionText} onChange={e => setSettings({ ...settings, aboutButtonCollectionText: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">קישור לוידאו (YouTube)</label>
                        <Input
                            value={settings.aboutVideoUrl}
                            onChange={e => setSettings({ ...settings, aboutVideoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            dir="ltr"
                        />
                        <p className="text-xs text-gray-500">הוידאו יפתח בחלונית צפה בלחיצה על הכפתור "לצפייה בסירטון"</p>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">תמונת היוצר</label>
                        <div className="flex items-center gap-4">
                            {settings.aboutImage && (
                                <img src={`${API_BASE_URL}${settings.aboutImage}`} alt="Creator" className="w-16 h-16 rounded-full object-cover border" />
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => e.target.files && setAboutImageFile(e.target.files[0])} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">פורמטים נתמכים: JPG, PNG, WEBP</p>
                        {aboutImageFile && <p className="text-xs text-green-600">קובץ חדש נבחר: {aboutImageFile.name}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">דף אודות - עמוד ייעודי (About Page)</CardTitle>
                    <CardDescription>כאן עורכים את התוכן של הדף הנפרד (destiny.co.il/about)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 1</label>
                            <Input value={settings.pageAboutTitle1} onChange={e => setSettings({ ...settings, pageAboutTitle1: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 2</label>
                            <Input value={settings.pageAboutTitle2} onChange={e => setSettings({ ...settings, pageAboutTitle2: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">כותרת 3</label>
                            <Input value={settings.pageAboutTitle3} onChange={e => setSettings({ ...settings, pageAboutTitle3: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">תיאור ראשי (דף אודות)</label>
                        <textarea
                            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={settings.pageAboutDescription}
                            onChange={e => setSettings({ ...settings, pageAboutDescription: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <label className="text-sm font-medium">תמונה לדף אודות</label>
                        <div className="flex items-center gap-4">
                            {settings.pageAboutImage && (
                                <img src={`${API_BASE_URL}${settings.pageAboutImage}`} alt="About Page" className="w-16 h-16 rounded-lg object-cover border" />
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => e.target.files && setPageAboutImageFile(e.target.files[0])} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">פורמטים נתמכים: JPG, PNG, WEBP</p>
                        {pageAboutImageFile && <p className="text-xs text-green-600">קובץ חדש נבחר: {pageAboutImageFile.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 1 (מספר)</label>
                            <Input value={settings.pageAboutSubscribers} onChange={e => setSettings({ ...settings, pageAboutSubscribers: e.target.value })} dir="ltr" />
                            <Input value={settings.pageAboutSubscribersLabel} onChange={e => setSettings({ ...settings, pageAboutSubscribersLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 2 (מספר)</label>
                            <Input value={settings.pageAboutFollowers} onChange={e => setSettings({ ...settings, pageAboutFollowers: e.target.value })} dir="ltr" />
                            <Input value={settings.pageAboutFollowersLabel} onChange={e => setSettings({ ...settings, pageAboutFollowersLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">נתון 3 (מספר)</label>
                            <Input value={settings.pageAboutVideos} onChange={e => setSettings({ ...settings, pageAboutVideos: e.target.value })} dir="ltr" />
                            <Input value={settings.pageAboutVideosLabel} onChange={e => setSettings({ ...settings, pageAboutVideosLabel: e.target.value })} placeholder="תיאור" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">שאלות נפוצות (FAQ)</CardTitle>
                    <CardDescription>ניהול שאלות ותשובות המופיעות בדף הבית.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">כותרת ראשית</label>
                        <Input value={settings.faqTitle} onChange={e => setSettings({ ...settings, faqTitle: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">תיאור משני</label>
                        <Input value={settings.faqSubtitle} onChange={e => setSettings({ ...settings, faqSubtitle: e.target.value })} />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">רשימת השאלות</label>
                        {settings.faqItems.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 border rounded-xl bg-gray-50">
                                <span className="font-bold text-gray-400 mt-2">#{index + 1}</span>
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="שאלה"
                                        value={item.question}
                                        onChange={(e) => {
                                            const newItems = [...settings.faqItems];
                                            newItems[index].question = e.target.value;
                                            setSettings({ ...settings, faqItems: newItems });
                                        }}
                                    />
                                    <textarea
                                        className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="תשובה"
                                        value={item.answer}
                                        onChange={(e) => {
                                            const newItems = [...settings.faqItems];
                                            newItems[index].answer = e.target.value;
                                            setSettings({ ...settings, faqItems: newItems });
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        const newItems = settings.faqItems.filter((_, i) => i !== index);
                                        setSettings({ ...settings, faqItems: newItems });
                                    }}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setSettings({
                                ...settings,
                                faqItems: [...settings.faqItems, { question: "", answer: "" }]
                            })}
                            className="w-full border-dashed"
                        >
                            + הוסף שאלה חדשה
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-[#9F19FF] text-white">
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">תפריט ניווט (Navbar)</CardTitle>
                    <CardDescription>
                        עריכת הטקסטים של הכפתורים בתפריט העליון.
                        <br />
                        שים לב: שינוי הטקסט לא ישנה את לאן הכפתור מוביל, רק את המילה שמוצגת.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems.map((item, index) => (
                            <div key={item.id} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">כפתור {index + 1}:</label>
                                <Input
                                    value={item.label}
                                    onChange={(e) => {
                                        const newItems = [...menuItems];
                                        newItems[index].label = e.target.value;
                                        setMenuItems(newItems);
                                    }}
                                    placeholder={`לדוגמה: ${item.label}`}
                                />
                                <p className="text-xs text-gray-400">מוביל ל: {item.id === 'about' ? 'דף אודות' : `אזור ${item.label}`}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white font-medium px-8 py-2 h-12 rounded-xl shadow-lg shadow-[#9F19FF]/20"
                        >
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border-2 border-[#9F19FF]/20">
                <CardHeader className="bg-[#9F19FF]/5 rounded-t-lg">
                    <CardTitle className="text-[#9F19FF]">הגדרות פוטר (Footer)</CardTitle>
                    <CardDescription>עריכת הקישורים והטקסטים בחלק התחתון של האתר.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">זכויות יוצרים (שורת קרדיט)</label>
                        <Input
                            value={settings.footerCopyright}
                            onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <label className="text-sm font-medium">קישורים לרשתות חברתיות</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">YouTube</label>
                                <Input
                                    value={settings.footerSocialYoutube}
                                    onChange={(e) => setSettings({ ...settings, footerSocialYoutube: e.target.value })}
                                    dir="ltr"
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Instagram</label>
                                <Input
                                    value={settings.footerSocialInstagram}
                                    onChange={(e) => setSettings({ ...settings, footerSocialInstagram: e.target.value })}
                                    dir="ltr"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">TikTok</label>
                                <Input
                                    value={settings.footerSocialTiktok}
                                    onChange={(e) => setSettings({ ...settings, footerSocialTiktok: e.target.value })}
                                    dir="ltr"
                                    placeholder="https://tiktok.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white font-medium"
                        >
                            {loading ? 'שומר...' : 'שמור שינויים'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default ContentSettings;
