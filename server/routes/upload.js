const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

const router = express.Router();

// POST /api/upload - upload single image (auth required)
router.post('/', auth, (req, res) => {
  const uploadSingle = uploadMiddleware.single('image');

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    res.json({
      url: '/uploads/' + req.file.filename,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

// POST /api/upload/multiple - upload multiple images (auth required)
router.post('/multiple', auth, (req, res) => {
  const uploadArray = uploadMiddleware.array('images', 10);

  uploadArray(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const urls = req.files.map(file => ({
      url: '/uploads/' + file.filename,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({ files: urls, urls: urls.map(f => f.url) });
  });
});

// DELETE /api/upload/:filename - delete uploaded file (auth required)
router.delete('/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename.' });
    }

    const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    const filePath = path.join(uploadDir, filename);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found.' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});

module.exports = router;
