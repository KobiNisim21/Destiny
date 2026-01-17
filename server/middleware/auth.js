import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        // Ensure authenticateToken ran first so req.user exists
        if (!req.user) {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'No token provided' });
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
                req.user = decoded;
            } catch (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        req.user = user; // Attach full user object for subsequent middlewares if needed
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
