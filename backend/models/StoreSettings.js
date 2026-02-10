const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  operatingHours: {
    monday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '22:00' },
      customMessage: { type: String, default: '' }
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '22:00' },
      customMessage: { type: String, default: '' }
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '22:00' },
      customMessage: { type: String, default: '' }
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '22:00' },
      customMessage: { type: String, default: '' }
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '22:00' },
      customMessage: { type: String, default: '' }
    },
    saturday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '09:00' },
      closeTime: { type: String, default: '23:00' },
      customMessage: { type: String, default: '' }
    },
    sunday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '09:00' },
      closeTime: { type: String, default: '23:00' },
      customMessage: { type: String, default: '' }
    }
  },
  manualOverride: {
    isActive: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    message: { type: String, default: '' }
  },
  temporaryClosures: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    message: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Ensure only one settings document exists
storeSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Method to check if store is currently open
storeSettingsSchema.methods.isStoreOpen = function() {
  const now = new Date();
  
  // Convert to Philippines timezone (UTC+8) for consistent checking
  const philippinesOffset = 8 * 60; // 8 hours in minutes
  const localOffset = now.getTimezoneOffset(); // Server's offset from UTC in minutes
  const timezoneDifference = philippinesOffset + localOffset;
  const philippinesTime = new Date(now.getTime() + timezoneDifference * 60 * 1000);
  
  console.log('[isStoreOpen] Server time:', now.toString());
  console.log('[isStoreOpen] Philippines time:', philippinesTime.toString());
  console.log('[isStoreOpen] Server time ISO:', now.toISOString());
  
  // Check temporary closures first (highest priority)
  // Use Philippines timezone for date comparisons
  if (this.temporaryClosures && this.temporaryClosures.length > 0) {
    console.log('[isStoreOpen] Checking', this.temporaryClosures.length, 'temporary closures');
    
    const activeClosure = this.temporaryClosures.find(closure => {
      const start = new Date(closure.startDate);
      const end = new Date(closure.endDate);
      
      console.log('[isStoreOpen] Closure start (raw):', closure.startDate);
      console.log('[isStoreOpen] Closure start (parsed):', start.toString());
      console.log('[isStoreOpen] Closure end (raw):', closure.endDate);
      console.log('[isStoreOpen] Closure end (parsed):', end.toString());
      
      // Convert closure dates to Philippines timezone and set to start/end of day
      const philippinesStart = new Date(start.getTime() + timezoneDifference * 60 * 1000);
      const philippinesEnd = new Date(end.getTime() + timezoneDifference * 60 * 1000);
      
      philippinesStart.setHours(0, 0, 0, 0);
      philippinesEnd.setHours(23, 59, 59, 999);
      
      console.log('[isStoreOpen] After timezone adjustment - start:', philippinesStart.toString());
      console.log('[isStoreOpen] After timezone adjustment - end:', philippinesEnd.toString());
      console.log('[isStoreOpen] Philippines time >= start?', philippinesTime >= philippinesStart);
      console.log('[isStoreOpen] Philippines time <= end?', philippinesTime <= philippinesEnd);
      console.log('[isStoreOpen] Active?', philippinesTime >= philippinesStart && philippinesTime <= philippinesEnd);
      
      return philippinesTime >= philippinesStart && philippinesTime <= philippinesEnd;
    });
    
    if (activeClosure) {
      console.log('[isStoreOpen] Found active closure, returning false');
      return false; // Store is closed due to temporary closure
    }
  }
  
  // Check manual override second
  if (this.manualOverride.isActive) {
    return !this.manualOverride.isClosed;
  }

  // Check scheduled hours last (using Philippines time already calculated above)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[philippinesTime.getDay()];
  const daySchedule = this.operatingHours[currentDay];

  console.log('[isStoreOpen] Current day in Philippines:', currentDay);
  console.log('[isStoreOpen] Day schedule:', daySchedule);

  if (!daySchedule.isOpen) {
    console.log('[isStoreOpen] Store marked closed for', currentDay);
    return false;
  }

  // Get current time in minutes since midnight (in Philippines timezone)
  const currentMinutes = philippinesTime.getHours() * 60 + philippinesTime.getMinutes();
  
  console.log('[isStoreOpen] Philippines time - Hours:', philippinesTime.getHours(), 'Minutes:', philippinesTime.getMinutes());
  console.log('[isStoreOpen] Current minutes since midnight:', currentMinutes);
  
  // Parse open and close times
  const [openHour, openMin] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.closeTime.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  console.log('[isStoreOpen] Open time:', daySchedule.openTime, '=', openMinutes, 'minutes');
  console.log('[isStoreOpen] Close time:', daySchedule.closeTime, '=', closeMinutes, 'minutes');
  console.log('[isStoreOpen] Current >= Open?', currentMinutes >= openMinutes);
  console.log('[isStoreOpen] Current < Close?', currentMinutes < closeMinutes);
  
  const isOpenNow = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  console.log('[isStoreOpen] Final result:', isOpenNow ? 'OPEN' : 'CLOSED');
  
  return isOpenNow;
};

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
