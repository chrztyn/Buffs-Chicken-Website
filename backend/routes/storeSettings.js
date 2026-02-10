const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');
const authenticateAdmin = require('../middleware/authenticateAdmin');

// Get store settings (public - anyone can check if store is open)
router.get('/', async (req, res) => {
  try {
    const settings = await StoreSettings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store settings'
    });
  }
});

// Get store status (public - simplified response)
router.get('/status', async (req, res) => {
  try {
    // Prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const settings = await StoreSettings.getSettings();
    const isOpen = settings.isStoreOpen();
    
    // Find active temporary closure
    const now = new Date();
    const activeClosure = settings.temporaryClosures?.find(closure => {
      const start = new Date(closure.startDate);
      const end = new Date(closure.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return now >= start && now <= end;
    });
    
    res.json({
      success: true,
      data: {
        isOpen,
        manualOverride: settings.manualOverride,
        operatingHours: settings.operatingHours,
        activeClosure: activeClosure || null,
        temporaryClosures: settings.temporaryClosures || []
      }
    });
  } catch (error) {
    console.error('Error fetching store status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store status'
    });
  }
});

// Update store settings (admin only)
router.put('/', authenticateAdmin, async (req, res) => {
  try {
    const { operatingHours, manualOverride } = req.body;
    
    const settings = await StoreSettings.getSettings();
    
    if (operatingHours) {
      settings.operatingHours = operatingHours;
    }
    
    if (manualOverride !== undefined) {
      settings.manualOverride = manualOverride;
    }
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store settings'
    });
  }
});

// Toggle manual override (admin only - quick action)
router.post('/toggle-override', authenticateAdmin, async (req, res) => {
  try {
    const { isActive, isClosed, message } = req.body;
    
    const settings = await StoreSettings.getSettings();
    
    settings.manualOverride = {
      isActive: isActive !== undefined ? isActive : !settings.manualOverride.isActive,
      isClosed: isClosed !== undefined ? isClosed : settings.manualOverride.isClosed,
      message: message !== undefined ? message : settings.manualOverride.message
    };
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Manual override toggled successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error toggling manual override:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle manual override'
    });
  }
});

// Add temporary closure (admin only)
router.post('/temporary-closures', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate, message } = req.body;
    
    console.log('[Add Closure] Received:', { startDate, endDate, message });
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const settings = await StoreSettings.getSettings();
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    console.log('[Add Closure] Parsed dates:');
    console.log('  Start:', startDateObj.toString(), '|', startDateObj.toISOString());
    console.log('  End:', endDateObj.toString(), '|', endDateObj.toISOString());
    
    settings.temporaryClosures.push({
      startDate: startDateObj,
      endDate: endDateObj,
      message: message || ''
    });
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Temporary closure added successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error adding temporary closure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add temporary closure'
    });
  }
});

// Delete temporary closure (admin only)
router.delete('/temporary-closures/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('[Delete Closure] Attempting to delete ID:', id);
    
    const settings = await StoreSettings.getSettings();
    
    console.log('[Delete Closure] Current closures count:', settings.temporaryClosures.length);
    console.log('[Delete Closure] Current closure IDs:', settings.temporaryClosures.map(c => c._id.toString()));
    
    const originalLength = settings.temporaryClosures.length;
    settings.temporaryClosures = settings.temporaryClosures.filter(
      closure => closure._id.toString() !== id
    );
    
    console.log('[Delete Closure] After filter count:', settings.temporaryClosures.length);
    console.log('[Delete Closure] Removed:', originalLength - settings.temporaryClosures.length, 'closure(s)');
    
    await settings.save();
    
    console.log('[Delete Closure] Successfully saved');
    
    res.json({
      success: true,
      message: 'Temporary closure deleted successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error deleting temporary closure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete temporary closure'
    });
  }
});

module.exports = router;
