
// Mock of the processImages function from products.js
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

// --- TESTS ---
console.log("Running Logic Tests...");

// Test 1: Full New Upload
const req1 = {
    files: {
        mainImage: [{ filename: 'newMain.jpg' }],
        hoverImage: [{ filename: 'newHover.jpg' }],
        galleryImages: [{ filename: 'g1.jpg' }, { filename: 'g2.jpg' }]
    },
    body: {}
};
const res1 = processImages(req1.files, req1.body);
console.log("Test 1 (New Upload):", JSON.stringify(res1, null, 2));

if (res1.mainImage !== '/uploads/newMain.jpg') console.error("FAIL T1: mainImage");
if (res1.hoverImage !== '/uploads/newHover.jpg') console.error("FAIL T1: hoverImage");
if (res1.galleryImages.length !== 2) console.error("FAIL T1: galleryImages count");
if (res1.images.length !== 4) console.error("FAIL T1: legacy images count");


// Test 2: Update (Keep Existing)
const req2 = {
    files: {},
    body: {
        existingMainImage: '/uploads/oldMain.jpg',
        existingHoverImage: '/uploads/oldHover.jpg',
        existingGalleryImages: ['/uploads/oldG1.jpg']
    }
};
const res2 = processImages(req2.files, req2.body);
console.log("Test 2 (Keep Existing):", JSON.stringify(res2, null, 2));

if (res2.mainImage !== '/uploads/oldMain.jpg') console.error("FAIL T2: mainImage");
if (res2.galleryImages[0] !== '/uploads/oldG1.jpg') console.error("FAIL T2: gallery");


// Test 3: Mixed (New Main, Keep Hover, Add Gallery)
const req3 = {
    files: {
        mainImage: [{ filename: 'brandNewMain.jpg' }],
        galleryImages: [{ filename: 'newG2.jpg' }]
    },
    body: {
        existingMainImage: '/uploads/oldMain.jpg', // Should be IGNORED
        existingHoverImage: '/uploads/oldHover.jpg',
        existingGalleryImages: '/uploads/oldG1.jpg' // Single string from FormData?
    }
};
const res3 = processImages(req3.files, req3.body);
console.log("Test 3 (Mixed):", JSON.stringify(res3, null, 2));

if (res3.mainImage !== '/uploads/brandNewMain.jpg') console.error("FAIL T3: mainImage priority");
if (res3.hoverImage !== '/uploads/oldHover.jpg') console.error("FAIL T3: hoverImage keep");
if (res3.galleryImages.length !== 2) console.error("FAIL T3: gallery count");

console.log("Tests Completed.");
