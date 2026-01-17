import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-['Assistant']" dir="rtl">
            <Navbar />
            <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">ההזמנה התקבלה בהצלחה!</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-md">
                    תודה שרכשת בדסטיני. אישור ההזמנה נשלח לאימייל שלך.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/orders')} variant="outline">
                        צפה בהזמנות שלי
                    </Button>
                    <Button onClick={() => navigate('/')} className="bg-[#9F19FF] hover:bg-[#8F00FF]">
                        חזור לחנות
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
