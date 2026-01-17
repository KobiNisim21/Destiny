import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret_key_123'
        );

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log(`Access denied: User ${user.email} is not admin (Role: ${user.role})`);
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        console.log(`Admin Authenticated: ${user.email} | SuperAdmin: ${user.isSuperAdmin}`);
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = req.user; // Assumes isAdmin or auth middleware already ran

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Super Admin has full access
            if (user.isSuperAdmin) {
                console.log(`Access granted to ${user.email} (Super Admin)`);
                return next();
            }

            // Check specific permission
            if (user.permissions && user.permissions.includes(requiredPermission)) {
                console.log(`Access granted to ${user.email} (Permission: ${requiredPermission})`);
                return next();
            }

            console.warn(`Access denied for ${user.email}. Missing permission: ${requiredPermission}. User permissions:`, user.permissions);
            return res.status(403).json({ message: `Access denied: Missing permission ${requiredPermission}` });

        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};
