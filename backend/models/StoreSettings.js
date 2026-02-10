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
  
  console.log('[isStoreOpen] Current time:', now.toString());
  console.log('[isStoreOpen] Current time ISO:', now.toISOString());
  
  // Check temporary closures first (highest priority)
  if (this.temporaryClosures && this.temporaryClosures.length > 0) {
    console.log('[isStoreOpen] Checking', this.temporaryClosures.length, 'temporary closures');
    
    const activeClosure = this.temporaryClosures.find(closure => {
      const start = new Date(closure.startDate);
      const end = new Date(closure.endDate);
      
      console.log('[isStoreOpen] Closure start (raw):', closure.startDate);
      console.log('[isStoreOpen] Closure start (parsed):', start.toString());
      console.log('[isStoreOpen] Closure end (raw):', closure.endDate);
      console.log('[isStoreOpen] Closure end (parsed):', end.toString());
      
      // Set time to start/end of day for proper comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      console.log('[isStoreOpen] After setHours - start:', start.toString());
      console.log('[isStoreOpen] After setHours - end:', end.toString());
      console.log('[isStoreOpen] now >= start?', now >= start);
      console.log('[isStoreOpen] now <= end?', now <= end);
      console.log('[isStoreOpen] Active?', now >= start && now <= end);
      
      return now >= start && now <= end;
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

  // Check scheduled hours last
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const daySchedule = this.operatingHours[currentDay];

  if (!daySchedule.isOpen) {
    return false;
  }

  // Get current time in minutes since midnight
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Parse open and close times
  const [openHour, openMin] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.closeTime.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
