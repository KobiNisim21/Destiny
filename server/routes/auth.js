import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Subscriber from '../models/Subscriber.js';
import Content from '../models/Content.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendAccountVerificationEmail, sendNewsletterWelcome } from '../services/emailService.js';

import { validateRequest, registerSchema, loginSchema } from '../middleware/validate.js';

const router = express.Router();

// Register
// Update Profile
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { firstName, lastName, email, phone, address } = req.body;

        // Validation / Check email uniqueness if changed
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    address
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
                permissions: updatedUser.permissions,
                isSuperAdmin: updatedUser.isSuperAdmin,
                gender: updatedUser.gender
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register', validateRequest(registerSchema), async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, gender, newsletterOptIn } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Strong Password Validation (Min 8 chars, at least 1 letter and 1 number)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 8 תווים, כולל אות אחת ומספר אחד' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = uuidv4();

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            gender: gender || 'other',
            newsletterOptIn: newsletterOptIn || false,
            isVerified: false,
            verificationToken: verificationToken
        });

        await newUser.save();

        // Send Verification Email instead of Welcome Email
        await sendAccountVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered successfully. Please accept the verification email.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: 'Token is required' });

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        // 1. Send Welcome Email (with Coupon - same as Newsletter Welcome)
        // Fetch dynamic content
        const welcomeSubjectSetting = await Content.findOne({ key: 'marketingWelcomeSubject' });
        const welcomeBodySetting = await Content.findOne({ key: 'marketingWelcomeBody' });
        const couponSetting = await Content.findOne({ key: 'marketingCouponCode' });

        const subject = welcomeSubjectSetting?.value;
        const body = welcomeBodySetting?.value;
        const couponCode = couponSetting?.value;

        // 2. Handle Newsletter Opt-in
        let subscriberId = null;
        if (user.newsletterOptIn) {
            // Check if already subscribed
            let subscriber = await Subscriber.findOne({ email: user.email });
            if (!subscriber) {
                subscriber = new Subscriber({
                    email: user.email,
                    isActive: true,
                    isVerified: true, // Already verified via account
                });
                await subscriber.save();
            } else {
                // Ensure they are verified/active
                if (!subscriber.isVerified || !subscriber.isActive) {
                    subscriber.isVerified = true;
                    subscriber.isActive = true;
                    await subscriber.save();
                }
            }
            subscriberId = subscriber._id;
        }

        // Send the email (pass subscriberId only if they opted in, for unsubscribe link)
        if (subject && body) {
            await sendNewsletterWelcome(user.email, subject, body, couponCode, subscriberId);
        } else {
            // Fallback if no content settings found
            await sendWelcomeEmail(user.email, user.firstName);
        }

        res.json({ message: 'Email verified successfully' });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists (explicitly select password)
        const user = await User.findOne({ email }).select('+password');

        // Generic error message for security (prevents user enumeration)
        const invalidCredentialsMsg = 'אימייל או סיסמה שגויים';

        if (!user) {
            return res.status(400).json({ message: invalidCredentialsMsg });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: invalidCredentialsMsg });
        }

        // Check verification
        if (user.isVerified === false) { // Explicit check
            return res.status(401).json({ message: 'יש לאמת את כתובת האימייל לפני ההתחברות' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                permissions: user.permissions,
                isSuperAdmin: user.isSuperAdmin,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send Email
        const result = await sendPasswordResetEmail(email, resetToken);

        if (result.success) {
            res.json({ message: 'Password reset link sent to email' });
        } else {
            console.error('Failed to send email:', result.error);
            res.status(500).json({ message: 'Failed to send email' });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Missing token or password' });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Link expired' });
        }
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});

export default router;
