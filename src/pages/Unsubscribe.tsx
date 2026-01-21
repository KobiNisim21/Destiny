import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, HeartHandshake } from 'lucide-react';
import API_BASE_URL from '@/config';
import destinyLogo from "@/assets/destiny-logo-new.png";

const Unsubscribe = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!id) {
            setStatus('error');
            return;
        }

        const unsubscribe = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/newsletter/unsubscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                setStatus('error');
            }
        };

        unsubscribe();
    }, [id]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center" dir="rtl">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
                <div className="mb-8 flex justify-center">
                    <img src={destinyLogo} alt="Destiny Logo" className="h-12 object-contain" />
                </div>

                {status === 'loading' && (
                    <div className="space-y-6 py-8">
                        <Loader2 className="w-12 h-12 animate-spin text-[#9F19FF] mx-auto" />
                        <h1 className="text-xl font-bold font-['Assistant']">מעבד את בקשת ההסרה...</h1>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-2 border-gray-100">
                            <HeartHandshake className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold font-['Assistant'] text-gray-900">הוסרת מרשימת התפוצה</h1>
                            <p className="text-gray-500 font-['Assistant']">
                                צר לנו שאתה עוזב. <br />
                                לא ישלחו אליך יותר מיילים שיווקיים מאיתנו.
                            </p>
                        </div>
                        <Link to="/" className="block pt-4">
                            <button className="w-full bg-[#9F19FF] text-white py-3 rounded-xl font-bold hover:bg-[#9F19FF]/90 transition-all shadow-lg hover:shadow-[#9F19FF]/25 font-['Assistant']">
                                חזרה לאתר
                            </button>
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-red-100">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold font-['Assistant'] text-gray-900">שגיאה</h1>
                            <p className="text-gray-500 font-['Assistant']">
                                לא הצלחנו לאתר את המנוי שלך במערכת,<br />או שכבר הוסרת מהרשימה בעבר.
                            </p>
                        </div>
                        <Link to="/" className="block pt-4">
                            <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all font-['Assistant']">
                                חזרה לאתר
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Unsubscribe;
