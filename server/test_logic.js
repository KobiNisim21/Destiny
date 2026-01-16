
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/products';
// Mock login or assume we can hack it? 
// The routes require 'isAdmin', which checks for a valid JWT token of an admin user.
// I need an admin token.

// Since I have access to the DB (User model), I can manually create a token or mock the behavior?
// Easier: Disable the middleware temporarily OR try to login first.
// I'll try to login first if I know credentials?
// Wait, I can't guess credentials. 
// Modification: I will TEMPORARILY disable 'isAdmin' middleware on the POST route in products.js solely for this test, OR I will just read the code again to find a glaring error.

// Actually, I can create a fake admin user in a script? 
// No, I'll update the script to just print the error if it's 401/403, which confirms auth issue.
// If it's 400/500, it's logic.

async function testUpload() {
    try {
        //Login first - assuming default admin exists or I can't really do this without creds.
        // Wait, I'll temporarily wrap the POST route in a try-catch block that prints to a FILE if it fails.
        // No, I can't easily edit running code to print to file without restart.
        
        // Alternative: I will create a temporary route that bypasses auth to test the LOGIC.
        // Or I will inspect the 'processImages' logic in a standalone unit test script.
        
        console.log("SKIP INTEGRATION TEST - UNIT TEST LOGIC INSTEAD");
    } catch (e) {
        console.error(e);
    }
}

// Just unit test the processing logic?
// No, the error happens during the request.

// Let's create a unit test for `processImages` logic by mocking req/files/body.
// I'll copy the function and test it here.

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

    // Backward compatibility
    const legacyImages = [];
    if (filePaths.mainImage) legacyImages.push(filePaths.mainImage);
    if (filePaths.hoverImage) legacyImages.push(filePaths.hoverImage);
    if (gallery.length > 0) legacyImages.push(...gallery);
    filePaths.images = legacyImages;

    return filePaths;
};

// Test Case 1: New Product, Files Only
const req1 = {
    files: {
        mainImage: [{ filename: 'main.jpg' }],
        hoverImage: [{ filename: 'hover.jpg' }]
    },
    body: {
        title: 'Test',
        price: 100
    }
};
console.log('Test 1:', processImages(req1.files, req1.body));

// Test Case 2: Update Product, Existing Images
const req2 = {
    files: {},
    body: {
        existingMainImage: '/uploads/main.jpg',
        existingHoverImage: '/uploads/hover.jpg',
        existingGalleryImages: ['/uploads/g1.jpg']
    }
};
console.log('Test 2:', processImages(req2.files, req2.body));

// Test Case 3: Update, Mixed
const req3 = {
    files: {
        galleryImages: [{ filename: 'g2.jpg' }]
    },
    body: {
        existingMainImage: '/uploads/main.jpg',
        existingHoverImage: '/uploads/hover.jpg',
        existingGalleryImages: '/uploads/g1.jpg' // string (single item legacy from client)
    }
};
console.log('Test 3:', processImages(req3.files, req3.body));

