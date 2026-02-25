const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { compressImage, ensureCompressedImagesDir } = require('../utils/imageCompression');

// Ensure backend-images directory exists
const backendImagesDir = path.join(__dirname, '../public/backend-images');
if (!fs.existsSync(backendImagesDir)) {
  fs.mkdirSync(backendImagesDir, { recursive: true });
}

// Ensure compressed-images subdirectory exists
const compressedImagesDir = ensureCompressedImagesDir(backendImagesDir);

// Configure multer for logo uploads (using memory storage for compression)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (will be compressed)
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper to save and compress image
const saveEventLogo = async (file) => {
  try {
    // Compress and save image
    const filename = await compressImage(file, compressedImagesDir);
    return `/backend-images/compressed-images/${filename}`;
  } catch (error) {
    console.error('Error saving event logo:', error);
    throw error;
  }
};

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date_start: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events by month/year
router.get('/month/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // JavaScript months are 0-indexed
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const events = await Event.find({
      $or: [
        { date_start: { $gte: startDate, $lte: endDate } },
        { date_end: { $gte: startDate, $lte: endDate } },
        { 
          date_start: { $lte: startDate },
          date_end: { $gte: endDate }
        }
      ]
    }).sort({ date_start: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (admin only)
router.post('/', authenticateAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { name, date_start, date_end, time, location, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Logo image is required' });
    }

    // Compress and save the logo image
    const logo_url = await saveEventLogo(req.file);

    const event = new Event({
      name,
      date_start: new Date(date_start),
      date_end: new Date(date_end),
      time,
      location,
      logo_url,
      description: description || ''
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    // Note: With compressed images, cleanup is handled by the compressImage utility
    res.status(400).json({ message: error.message });
  }
});

// Update event (admin only)
router.put('/:id', authenticateAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { name, date_start, date_end, time, location, description } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update fields
    event.name = name || event.name;
    event.date_start = date_start ? new Date(date_start) : event.date_start;
    event.date_end = date_end ? new Date(date_end) : event.date_end;
    event.time = time || event.time;
    event.location = location || event.location;
    event.description = description !== undefined ? description : event.description;

    // Update logo if new file uploaded
    if (req.file) {
      // Delete old logo file
      if (event.logo_url) {
        const oldLogoPath = path.join(__dirname, '../public', event.logo_url);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      // Compress and save the new logo image
      event.logo_url = await saveEventLogo(req.file);
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete logo file
    if (event.logo_url) {
      const logoPath = path.join(__dirname, '../public', event.logo_url);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
