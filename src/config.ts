
// In production (Vercel), use relative path so requests go to the same domain (e.g. /api/...)
// In development, use localhost:5000
const API_BASE_URL = import.meta.env.MODE === 'production'
    ? ''
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export default API_BASE_URL;
