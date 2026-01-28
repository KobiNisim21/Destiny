import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { isAdmin } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// --- Simple In-Memory Cache ---
let productsCache = {
    data: null,
    timestamp: 0
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const invalidateCache = () => {
    productsCache = { data: null, timestamp: 0 };
    console.log('Products cache invalidated');
};

// Helper to process images
const processImages = (files, body) => {
    const filePaths = {
        mainImage: null,
        hoverImage: null,
        galleryImages: []
    };

    // 1. Process Main Image
    if (files.mainImage && files.mainImage[0]) {
        filePaths.mainImage = files.mainImage[0].path;
    } else if (body.existingMainImage) {
        filePaths.mainImage = body.existingMainImage;
    }

    // 2. Process Hover Image
    if (files.hoverImage && files.hoverImage[0]) {
        filePaths.hoverImage = files.hoverImage[0].path;
    } else if (body.existingHoverImage) {
        filePaths.hoverImage = body.existingHoverImage;
    } else if (body.clearHoverImage === 'true') {
        filePaths.hoverImage = null;
    }

    // 3. Process Gallery Images
    let gallery = [];
    if (body.existingGalleryImages) {
        gallery = Array.isArray(body.existingGalleryImages)
            ? body.existingGalleryImages
            : [body.existingGalleryImages];
    }

    if (files.galleryImages) {
        const newGalleryPaths = files.galleryImages.map(file => file.path);
        gallery = [...gallery, ...newGalleryPaths];
    }
    filePaths.galleryImages = gallery;

    // Backward compatibility: Construct 'images' array
    const legacyImages = [];
    if (filePaths.mainImage) legacyImages.push(filePaths.mainImage);
    if (filePaths.hoverImage) legacyImages.push(filePaths.hoverImage);
    if (gallery.length > 0) legacyImages.push(...gallery);
    filePaths.images = legacyImages;

    return filePaths;
};

// Get all products
router.get('/', async (req, res) => {
    try {
        // Check Cache
        if (productsCache.data && (Date.now() - productsCache.timestamp < CACHE_DURATION)) {
            console.log('Serving products from cache');
            return res.json(productsCache.data);
        }

        console.log('GET /api/products request received (Not Cached)');

        // 1. Fetch all products
        const products = await Product.find().sort({ createdAt: -1 });

        // 2. Aggregate sales count from Orders
        const salesAggregation = await mongoose.model('Order').aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" }
                }
            }
        ]);

        // 3. Create a map for quick lookup
        const salesMap = {};
        salesAggregation.forEach(item => {
            salesMap[item._id.toString()] = item.totalSold;
        });

        // 4. Attach sales count to products
        const productsWithSales = products.map(product => ({
            ...product.toObject(),
            salesCount: salesMap[product._id.toString()] || 0
        }));

        // Update Cache
        productsCache = {
            data: productsWithSales,
            timestamp: Date.now()
        };

        console.log(`Found ${products.length} products with sales data`);
        res.json(productsWithSales);
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create product (Admin only)
router.post('/', isAdmin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'hoverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        console.log('--- Create Product Request ---');
        console.log('Body:', req.body);
        console.log('Files keys:', req.files ? Object.keys(req.files) : 'No files');

        const imagePaths = processImages(req.files || {}, req.body);
        console.log('Processed Image Paths:', imagePaths);

        // Validation: Main image is required
        if (!imagePaths.mainImage) {
            return res.status(400).json({ message: 'Main image is required' });
        }

        // --- Slot Bump Logic ---
        if (req.body.displaySlot && req.body.section && req.body.section !== 'none') {
            const slot = Number(req.body.displaySlot);
            if (slot >= 1 && slot <= 4) {
                // Find existing product in this slot and clear it
                await Product.updateMany(
                    {
                        section: req.body.section,
                        displaySlot: slot
                    },
                    { $set: { displaySlot: null } }
                );
                console.log(`Bumped existing products from slot ${slot} in section ${req.body.section}`);
            }
        }
        // -----------------------

        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
            category: req.body.category,
            section: req.body.section || 'none',
            displaySlot: req.body.displaySlot ? Number(req.body.displaySlot) : null,
            inStock: req.body.inStock === 'true',
            isNewArrival: req.body.isNewArrival === 'true',
            customLabel: req.body.customLabel || null,
            faq: req.body.faq ? JSON.parse(req.body.faq) : [],

            // New Fields
            mainImage: imagePaths.mainImage,
            hoverImage: imagePaths.hoverImage,
            galleryImages: imagePaths.galleryImages,
            // Legacy Field
            images: imagePaths.images
        });

        const newProduct = await product.save();
        invalidateCache(); // Invalidate cache
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Update product
router.put('/:id', isAdmin, upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'hoverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const imagePaths = processImages(req.files || {}, req.body);

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
            category: req.body.category,
            section: req.body.section || 'none',
            displaySlot: req.body.displaySlot ? Number(req.body.displaySlot) : null,
            inStock: req.body.inStock === 'true' || req.body.inStock === true,
            isNewArrival: req.body.isNewArrival === 'true' || req.body.isNewArrival === true,
            customLabel: req.body.customLabel || null,
            faq: req.body.faq ? JSON.parse(req.body.faq) : undefined,

            // New Fields
            mainImage: imagePaths.mainImage,
            hoverImage: imagePaths.hoverImage,
            galleryImages: imagePaths.galleryImages,
            // Legacy Field
            images: imagePaths.images
        };

        // If mainImage is null (meaning no new file and no existing path sent?), we might have a problem if it's required.
        // But logic says: if files.mainImage -> use it. Else if body.existing -> use it.
        // If both null -> null. 
        // In UPDATE, if the user didn't change the main image, `existingMainImage` should be sent by frontend.
        // The frontend `ProductForm` logic does send `existingMainImage`.

        // Slot Bump Logic for Update
        if (req.body.displaySlot && req.body.section && req.body.section !== 'none') {
            const slot = Number(req.body.displaySlot);
            if (slot >= 1 && slot <= 4) {
                await Product.updateMany(
                    {
                        section: req.body.section,
                        displaySlot: slot,
                        _id: { $ne: req.params.id } // Exclude current product
                    },
                    { $set: { displaySlot: null } }
                );
                console.log(`Bumped existing products from slot ${slot} in section ${req.body.section} (excluding current)`);
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        invalidateCache(); // Invalidate cache
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        invalidateCache(); // Invalidate cache
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
