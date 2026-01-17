import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_MS = 28 * 60 * 1000; // Warning at 28 minutes
// const TIMEOUT_MS = 10 * 1000; // Test: 10 sec
// const WARNING_MS = 5 * 1000; // Test: 5 sec

const SessionTimeout = () => {
    const { logout, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [showWarning, setShowWarning] = useState(false);
    const lastActivity = useRef<number>(Date.now());
    const warningShown = useRef<boolean>(false);

    const checkActivity = useCallback(() => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivity.current;

        if (timeSinceLastActivity > TIMEOUT_MS) {
            handleLogout();
        } else if (timeSinceLastActivity > WARNING_MS && !warningShown.current) {
            setShowWarning(true);
            warningShown.current = true;
        }
    }, [logout]);

    const handleLogout = () => {
        setShowWarning(false);
        logout();
        window.location.href = '/login';
        toast({
            title: "נותקת מהמערכת",
            description: "עקב חוסר פעילות, נותקת מהמערכת באופן אוטומטי.",
            variant: "destructive",
        });
    };

    const handleActivity = useCallback(() => {
        // Only reset if warning is NOT shown.
        // If warning IS shown, user must click "Continue" to reset.
        if (!warningShown.current) {
            lastActivity.current = Date.now();
        }
    }, []);

    const handleContinue = () => {
        lastActivity.current = Date.now();
        warningShown.current = false;
        setShowWarning(false);
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        // Events to track activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const eventHandler = () => handleActivity();

        // Add listeners
        events.forEach(event => document.addEventListener(event, eventHandler));

        // Start interval
        const intervalId = setInterval(checkActivity, 1000);

        return () => {
            events.forEach(event => document.removeEventListener(event, eventHandler));
            clearInterval(intervalId);
        };
    }, [isAuthenticated, handleActivity, checkActivity]);

    if (!isAuthenticated) return null;

    return (
        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-right">האם אתה עדיין כאן?</AlertDialogTitle>
                    <AlertDialogDescription className="text-right">
                        זוהתה חוסר פעילות במשך זמן רב.
                        <br />
                        למען אבטחת המידע, החיבור ינותק באופן אוטומטי בעוד 2 דקות.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-start">
                    <AlertDialogAction onClick={handleContinue} className="bg-[#9F19FF] hover:bg-[#9F19FF]/90">
                        המשך גלישה
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SessionTimeout;
