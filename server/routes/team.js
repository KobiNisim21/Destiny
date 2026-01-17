import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { isAdmin, checkPermission } from '../middleware/adminAuth.js';

const router = express.Router();

// Middleware: All routes require admin access
// Specific routes might require 'manage_team' permission
router.use(isAdmin);

// @route   GET /api/team/users
// @desc    Get all users (for searching/adding to team)
// @access  Admin (manage_team)
router.get('/users', checkPermission('manage_team'), async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/team/admins
// @desc    Get all admins
// @access  Admin (manage_team)
router.get('/admins', checkPermission('manage_team'), async (req, res) => {
    try {
        console.log('Fetching admins list...');
        const admins = await User.find({ role: 'admin' }, '-password');
        console.log(`Found ${admins.length} admins`);
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/team/update-role
// @desc    Update user role and permissions
// @access  Super Admin Only (or manage_team)
router.put('/update-role', checkPermission('manage_team'), async (req, res) => {
    try {
        const { userId, role, permissions, isSuperAdmin } = req.body;

        // Security check: Only Super Admin can assign Super Admin status
        if (isSuperAdmin && !req.user.isSuperAdmin) {
            return res.status(403).json({ message: 'Only Super Admin can assign Super Admin role' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        user.permissions = permissions || [];
        if (typeof isSuperAdmin !== 'undefined') {
            user.isSuperAdmin = isSuperAdmin;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;
