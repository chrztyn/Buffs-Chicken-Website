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
  
  const philippinesOffset = 8 * 60;
  const localOffset = now.getTimezoneOffset();
  const timezoneDifference = philippinesOffset + localOffset;
  const philippinesTime = new Date(now.getTime() + timezoneDifference * 60 * 1000);
  
  // Check temporary closures first (highest priority)
  if (this.temporaryClosures && this.temporaryClosures.length > 0) {
    const activeClosure = this.temporaryClosures.find(closure => {
      const start = new Date(closure.startDate);
      const end = new Date(closure.endDate);
      
      const philippinesStart = new Date(start.getTime() + timezoneDifference * 60 * 1000);
      const philippinesEnd = new Date(end.getTime() + timezoneDifference * 60 * 1000);
      
      philippinesStart.setHours(0, 0, 0, 0);
      philippinesEnd.setHours(23, 59, 59, 999);
      
      return philippinesTime >= philippinesStart && philippinesTime <= philippinesEnd;
    });
    
    if (activeClosure) {
      console.log('[StoreSettings] CLOSED — temporary closure active:', activeClosure.message || 'no message');
      return false;
    }
  }
  
  // Check manual override second
  if (this.manualOverride.isActive) {
    const result = !this.manualOverride.isClosed;
    console.log(`[StoreSettings] Manual override active — store is ${result ? 'OPEN' : 'CLOSED'}: ${this.manualOverride.message || 'no message'}`);
    return result;
  }

  // Check scheduled hours (using Philippines time)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[philippinesTime.getDay()];
  const daySchedule = this.operatingHours[currentDay];

  if (!daySchedule.isOpen) {
    console.log(`[StoreSettings] CLOSED — ${currentDay} is marked as closed`);
    return false;
  }

  const currentMinutes = philippinesTime.getHours() * 60 + philippinesTime.getMinutes();
  const [openHour, openMin] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.closeTime.split(':').map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  const isOpenNow = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  const phTimeStr = `${String(philippinesTime.getHours()).padStart(2,'0')}:${String(philippinesTime.getMinutes()).padStart(2,'0')}`;
  console.log(`[StoreSettings] ${isOpenNow ? 'OPEN' : 'CLOSED'} — PH time: ${phTimeStr} (${currentDay} ${daySchedule.openTime}–${daySchedule.closeTime})`);

  return isOpenNow;
};

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
