import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import API_BASE_URL from "@/config";
import { Loader2 } from "lucide-react";

interface PolicyPageProps {
    type: 'shipping' | 'returns' | 'privacy' | 'legal' | 'terms';
}

const titles = {
    shipping: "מדיניות משלוחים",
    returns: "מדיניות החזרות וביטולים",
    privacy: "מדיניות פרטיות",
    legal: "תוכן משפטי",
    terms: "תנאי שימוש"
};

const keys = {
    shipping: "policyShipping",
    returns: "policyReturns",
    privacy: "policyPrivacy",
    legal: "policyLegal",
    terms: "policyTerms"
};

const PolicyPage = ({ type }: PolicyPageProps) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/content`);
                const data = await res.json();
                if (res.ok) {
                    // @ts-ignore
                    setContent(data[keys[type]] || "התוכן יעודכן בקרוב.");
                }
            } catch (error) {
                console.error("Failed to fetch policy content");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        window.scrollTo(0, 0);
    }, [type]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-['Assistant']" dir="rtl">
            <Navbar />

            <main className="flex-grow pt-28 pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[500px]">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center border-b pb-6">
                            {titles[type]}
                        </h1>

                        {loading ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <Loader2 className="w-10 h-10 animate-spin text-[#9F19FF]" />
                            </div>
                        ) : (
                            <div
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PolicyPage;
