
export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const validateHebrewName = (name: string, fieldName: string): ValidationResult => {
    if (!name || name.trim().length < 2) {
        return { isValid: false, message: `${fieldName} חייב להכיל לפחות 2 תווים` };
    }
    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;
    if (!hebrewRegex.test(name)) {
        return { isValid: false, message: `${fieldName} חייב להכיל אותיות בעברית בלבד` };
    }
    return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
    if (!email) return { isValid: false, message: "נא להזין כתובת אימייל" };

    // Basic format: something@something.something
    // Also ensuring no Hebrew characters (user requested English/numbers/dots)
    // The requirement: "English letters or numbers and English letters, can contain dot. Must contain @ and valid extension"
    // Regex explanation:
    // ^[a-zA-Z0-9._-]+      => Start with English, number, dot, underscore, hyphen
    // @                     => must have @
    // [a-zA-Z0-9.-]+        => domain part
    // \.[a-zA-Z]{2,6}$      => extension dot and 2-6 letters

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return { isValid: false, message: "כתובת אימייל אינה תקינה (אנגלית בלבד, פורמט תקין)" };
    }
    return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
    if (!phone) return { isValid: false, message: "נא להזין מספר טלפון" };

    // Exactly 10 digits
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phone)) {
        return { isValid: false, message: "מספר טלפון חייב להכיל 10 ספרות בדיוק (מספרים בלבד)" };
    }
    return { isValid: true };
};

export const validateAddress = (street: string): ValidationResult => {
    if (!street) return { isValid: false, message: "נא להזין רחוב ומספר" };

    // Hebrew letters and numbers only.
    // Must contain at least 2 consecutive Hebrew letters? Requirements: "Hebrew letters and numbers only. (Minimum 2 letters and 1 digit)"

    // Check for invalid chars (non-hebrew, non-digit, non-space, non-comma)
    const validCharsRegex = /^[\u0590-\u05FF0-9\s,]+$/;
    if (!validCharsRegex.test(street)) {
        return { isValid: false, message: "הכתובת חייבת להכיל עברית, מספרים או פסיקים בלבד" };
    }

    // Count Hebrew letters
    const hebrewCount = (street.match(/[\u0590-\u05FF]/g) || []).length;
    if (hebrewCount < 2) {
        return { isValid: false, message: "הכתובת חייבת להכיל לפחות 2 אותיות בעברית" };
    }

    // Count digits
    const digitCount = (street.match(/\d/g) || []).length;
    if (digitCount < 1) {
        return { isValid: false, message: "הכתובת חייבת להכיל לפחות ספרה אחת (מספר בית)" };
    }

    return { isValid: true };
};

export const validateCity = (city: string): ValidationResult => {
    if (!city) return { isValid: false, message: "נא להזין עיר" };

    if (city.trim().length < 2) {
        return { isValid: false, message: "שם העיר חייב להכיל לפחות 2 תווים" };
    }

    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;
    if (!hebrewRegex.test(city)) {
        return { isValid: false, message: "שם העיר חייב להכיל אותיות בעברית בלבד" };
    }

    return { isValid: true };
};

export const validateZip = (zip: string): ValidationResult => {
    if (!zip) return { isValid: false, message: "נא להזין מיקוד" };

    // Numbers only, min 5 digits
    const zipRegex = /^\d{5,}$/;
    if (!zipRegex.test(zip)) {
        return { isValid: false, message: "מיקוד חייב להכיל לפחות 5 ספרות (מספרים בלבד)" };
    }

    return { isValid: true };
};
