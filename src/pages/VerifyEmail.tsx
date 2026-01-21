import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import API_BASE_URL from '@/config';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/newsletter/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
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

        verify();
    }, [token]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center mt-20" dir="rtl">
            {status === 'loading' && (
                <div className="space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#9F19FF] mx-auto" />
                    <h1 className="text-2xl font-bold">מאמת את כתובת המייל...</h1>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">ההרשמה הושלמה בהצלחה!</h1>
                    <p className="text-gray-600">
                        כתובת המייל שלך אומתה. שלחנו לך מייל נוסף עם קוד הקופון שלך להזמנה הראשונה.
                    </p>
                    <Link to="/">
                        <button className="bg-[#9F19FF] text-white px-8 py-3 rounded-full font-medium hover:bg-[#9F19FF]/90 transition-colors mt-4">
                            חזרה לאתר
                        </button>
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">שגיאה באימות</h1>
                    <p className="text-gray-600">
                        הקישור פג תוקף או שאינו תקין. אנא נסה להירשם שנית.
                    </p>
                    <Link to="/">
                        <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors mt-4">
                            חזרה לאתר
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
