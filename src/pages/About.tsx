import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API_BASE_URL from "../config";
import { Youtube, Instagram } from "lucide-react";

interface ContentData {
    aboutTitle1: string;
    aboutTitle2: string;
    aboutTitle3: string;
    aboutDescription: string;
    aboutSubscribers: string;
    aboutSubscribersLabel: string;
    aboutFollowers: string;
    aboutFollowersLabel: string;
    aboutVideos: string;
    aboutVideosLabel: string;
    aboutImage: string;
    footerSocialYoutube: string;
    footerSocialInstagram: string;
    footerSocialTiktok: string;

    // Page Specific
    pageAboutTitle1?: string;
    pageAboutTitle2?: string;
    pageAboutTitle3?: string;
    pageAboutDescription?: string;
    pageAboutImage?: string;
    pageAboutSubscribers?: string;
    pageAboutSubscribersLabel?: string;
    pageAboutFollowers?: string;
    pageAboutFollowersLabel?: string;
    pageAboutVideos?: string;
    pageAboutVideosLabel?: string;
}

const About = () => {
    const [content, setContent] = useState<ContentData | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/content`)
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error(err));
    }, []);

    if (!content) return <div className="min-h-screen bg-white" />;

    return (
        <div className="min-h-screen bg-white font-['Assistant']" dir="rtl">
            <Navbar />

            <main className="pt-36 pb-16">
                <div className="container mx-auto px-4">

                    {/* Hero Text Section */}
                    <div className="text-center mb-16 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-4xl md:text-6xl font-black tracking-tight text-[#1A1A1A]">
                            <span className="text-[#9F19FF]">{content.pageAboutTitle1 || content.aboutTitle1 || "לחלום."}</span>
                            <span>{content.pageAboutTitle2 || content.aboutTitle2 || "ליצור."}</span>
                            <span>{content.pageAboutTitle3 || content.aboutTitle3 || "להעניק."}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

                        {/* Image Section */}
                        <div className="relative group animate-scale-in">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#9F19FF] to-[#7DE400] rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={content.pageAboutImage ? `${API_BASE_URL}${content.pageAboutImage}` : (content.aboutImage ? `${API_BASE_URL}${content.aboutImage}` : "/placeholder.svg")}
                                    alt="About Creator"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Social Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {content.footerSocialYoutube && (
                                        <a href={content.footerSocialYoutube} target="_blank" rel="noreferrer" className="text-white hover:text-[#FF0000] transition-colors">
                                            <Youtube size={32} />
                                        </a>
                                    )}
                                    {content.footerSocialInstagram && (
                                        <a href={content.footerSocialInstagram} target="_blank" rel="noreferrer" className="text-white hover:text-[#E1306C] transition-colors">
                                            <Instagram size={32} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Text Content Section */}
                        <div className="space-y-8 lg:pt-8 animate-slide-up">
                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {content.pageAboutDescription || content.aboutDescription || "ברוכים הבאים לקולקציית המרצ'נדייז הרשמית של דסטני. עיצובים בלעדיים, מכירות מוגבלות ומוצרים שיוצרו באהבה עבור הקהילה המדהימה שלי. ✨"}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-[#9F19FF]/5 transition-colors duration-300">
                                    <div className="text-3xl font-black text-[#9F19FF] mb-1">{content.pageAboutSubscribers || content.aboutSubscribers || "+153K"}</div>
                                    <div className="text-sm text-gray-500 font-medium">{content.pageAboutSubscribersLabel || content.aboutSubscribersLabel || "רשומים"}</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-[#9F19FF]/5 transition-colors duration-300">
                                    <div className="text-3xl font-black text-[#1A1A1A] mb-1">{content.pageAboutFollowers || content.aboutFollowers || "+35K"}</div>
                                    <div className="text-sm text-gray-500 font-medium">{content.pageAboutFollowersLabel || content.aboutFollowersLabel || "עוקבים"}</div>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-[#9F19FF]/5 transition-colors duration-300">
                                    <div className="text-3xl font-black text-[#1A1A1A] mb-1">{content.pageAboutVideos || content.aboutVideos || "+370"}</div>
                                    <div className="text-sm text-gray-500 font-medium">{content.pageAboutVideosLabel || content.aboutVideosLabel || "סרטונים"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
