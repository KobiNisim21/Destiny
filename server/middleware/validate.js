import { z } from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Return the first error message to keep it simple for the frontend
            const firstError = error.errors[0];
            return res.status(400).json({
                message: firstError.message || 'Validation error',
                details: error.errors
            });
        }
        return res.status(400).json({ message: 'Invalid request data' });
    }
};

// Common Schemas
export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one number"),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    newsletterOptIn: z.boolean().optional()
});



export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export const orderSchema = z.object({
    items: z.array(z.object({
        product: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1")
    })).min(1, "Order must contain at least one item"),
    shippingAddress: z.object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().min(9, "Phone number is required"),
        address: z.string().min(5, "Address is required"),
        city: z.string().min(2, "City is required"),
        zipCode: z.string().min(2, "Zip code is required")
    })
});
