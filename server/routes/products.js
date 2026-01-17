import express from 'express';
import Product from '../models/Product.js';
import { isAdmin } from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Helper to process images
const processImages = (files, body) => {
    const filePaths = {
        mainImage: null,
        hoverImage: null,
        galleryImages: []
    };

    // 1. Process Main Image
    if (files.mainImage && files.mainImage[0]) {
        filePaths.mainImage = `/uploads/${files.mainImage[0].filename}`;
    } else if (body.existingMainImage) {
        filePaths.mainImage = body.existingMainImage;
    }

    // 2. Process Hover Image
    if (files.hoverImage && files.hoverImage[0]) {
        filePaths.hoverImage = `/uploads/${files.hoverImage[0].filename}`;
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
        const newGalleryPaths = files.galleryImages.map(file => `/uploads/${file.filename}`);
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
        console.log('GET /api/products request received');
        const products = await Product.find().sort({ createdAt: -1 });
        console.log(`Found ${products.length} products`);
        res.json(products);
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
            faq: req.body.faq ? JSON.parse(req.body.faq) : [],

            // New Fields
            mainImage: imagePaths.mainImage,
            hoverImage: imagePaths.hoverImage,
            galleryImages: imagePaths.galleryImages,
            // Legacy Field
            images: imagePaths.images
        });

        const newProduct = await product.save();
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

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
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
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
