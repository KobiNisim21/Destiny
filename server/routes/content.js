import express from 'express';
import Content from '../models/Content.js';
import upload from '../middleware/upload.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find({});
    // Convert array to object for easier frontend consumption
    const contentMap = {};
    contents.forEach(item => {
      contentMap[item.key] = item.value;
    });
    res.json(contentMap);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content (Admin only)
// Body should be an object: { "heroTitle": "New Title", "heroSubtitle": "..." }
router.put('/', isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const promises = Object.keys(updates).map(async (key) => {
      return Content.findOneAndUpdate(
        { key },
        { key, value: updates[key], updatedAt: Date.now() },
        { upsert: true, new: true }
      );
    });

    await Promise.all(promises);
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload file (Admin only)
router.post('/upload', isAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the path relative to the server
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
