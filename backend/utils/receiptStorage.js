const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');

const RECEIPTS_DIR = path.join(__dirname, '..', 'uploads', 'receipts');

/**
 * Compress and save receipt image.
 * Target: under 300KB, max 1200px wide, JPEG quality 60.
 * @param {Buffer} fileBuffer
 * @param {string} orderId
 * @returns {{ filename: string, path: string }}
 */
const saveReceipt = async (fileBuffer, orderId) => {
  fs.mkdirSync(RECEIPTS_DIR, { recursive: true });

  const filename = `receipt_${orderId}_${Date.now()}.jpg`;
  const filePath = path.join(RECEIPTS_DIR, filename);

  await sharp(fileBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 60 })
    .toFile(filePath);

  return { filename, path: filePath };
};

/**
 * Delete a receipt image from disk. Never throws — logs warnings only.
 * @param {string} filename
 */
const deleteReceipt = (filename) => {
  try {
    const filePath = path.join(RECEIPTS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`Receipt cleanup: file not found, skipping: ${filename}`);
      return;
    }
    fs.unlinkSync(filePath);
  } catch (err) {
    console.warn(`Receipt cleanup: failed to delete ${filename}:`, err.message);
  }
};

/**
 * Start the 24-hour receipt cleanup job.
 * Deletes physically and marks deletedAt for receipts uploaded more than 7 days ago.
 */
const startReceiptCleanupJob = () => {
  const runCleanup = async () => {
    try {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const orders = await Order.find({
        'receiptImage.filename': { $ne: null },
        'receiptImage.deletedAt': null,
        'receiptImage.uploadedAt': { $lt: cutoff },
      });

      let deleted = 0;
      for (const order of orders) {
        deleteReceipt(order.receiptImage.filename);
        order.receiptImage.deletedAt = new Date();
        await order.save();
        deleted++;
      }

      console.log(`Receipt cleanup: ${deleted} files deleted`);
    } catch (err) {
      console.error('Receipt cleanup error:', err.message);
    }
  };

  // Run once on start, then every 24 hours
  runCleanup();
  setInterval(runCleanup, 24 * 60 * 60 * 1000);
};

module.exports = { saveReceipt, deleteReceipt, startReceiptCleanupJob };
