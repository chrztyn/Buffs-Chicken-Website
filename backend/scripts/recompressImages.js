/**
 * Batch recompress existing images to new optimized settings
 * Run this once to fix images uploaded before optimization update
 * 
 * Usage: node scripts/recompressImages.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../public/backend-images/compressed-images');
const BACKUP_DIR = path.join(__dirname, '../public/backend-images/backup-originals');

// New optimized settings matching imageCompression.js
const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;
const QUALITY = 75;

async function recompressImage(filePath) {
  try {
    const filename = path.basename(filePath);
    const stats = await fs.stat(filePath);
    const originalSize = stats.size;

    // Skip if not an image or already small enough
    if (originalSize < 30000) { // Skip files under 30KB
      console.log(`⏭️  Skipping ${filename} (already small: ${(originalSize / 1024).toFixed(1)}KB)`);
      return { skipped: true };
    }

    // Get image metadata first
    const metadata = await sharp(filePath).metadata();
    
    // Skip if already at or below target dimensions
    if (metadata.width <= MAX_WIDTH && metadata.height <= MAX_HEIGHT) {
      console.log(`⏭️  Skipping ${filename} (dimensions OK: ${metadata.width}x${metadata.height})`);
      return { skipped: true };
    }

    // Backup original to backup directory
    const backupPath = path.join(BACKUP_DIR, filename);
    await fs.copyFile(filePath, backupPath);

    // Recompress with new settings
    await sharp(filePath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: QUALITY,
        effort: 5
      })
      .toFile(filePath + '.tmp');

    // Replace original with recompressed
    await fs.rename(filePath + '.tmp', filePath);

    const newStats = await fs.stat(filePath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${filename}`);
    console.log(`   ${metadata.width}x${metadata.height} → ${MAX_WIDTH}x${MAX_HEIGHT} (max)`);
    console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (saved ${savings}%)`);

    return { 
      success: true, 
      originalSize, 
      newSize, 
      savings: originalSize - newSize 
    };
  } catch (error) {
    console.error(`❌ Failed to recompress ${filePath}:`, error.message);
    return { error: true };
  }
}

async function main() {
  console.log('🖼️  Batch Image Recompression Tool\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`New dimensions: max ${MAX_WIDTH}x${MAX_HEIGHT}`);
  console.log(`Quality: ${QUALITY}%\n`);

  // Create backup directory
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.log(`✅ Backup directory ready: ${BACKUP_DIR}\n`);
  } catch (error) {
    console.error('Failed to create backup directory:', error);
    return;
  }

  // Get all files in compressed-images directory
  let files;
  try {
    files = await fs.readdir(SOURCE_DIR);
    files = files.filter(f => f.match(/\.(webp|jpg|jpeg|png)$/i));
  } catch (error) {
    console.error(`❌ Cannot read directory: ${SOURCE_DIR}`);
    console.error('Make sure the path is correct and directory exists');
    return;
  }

  if (files.length === 0) {
    console.log('No images found to recompress');
    return;
  }

  console.log(`Found ${files.length} images to process\n`);
  console.log('─'.repeat(60));

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process each image
  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const result = await recompressImage(filePath);

    if (result.skipped) {
      skippedCount++;
    } else if (result.error) {
      errorCount++;
    } else if (result.success) {
      successCount++;
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
    }
  }

  console.log('─'.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   Recompressed: ${successCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Errors: ${errorCount}`);
  
  if (successCount > 0) {
    const totalSavings = totalOriginalSize - totalNewSize;
    const savingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
    console.log(`\n💾 Total Savings:`);
    console.log(`   ${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalNewSize / 1024).toFixed(1)}KB`);
    console.log(`   Saved ${(totalSavings / 1024).toFixed(1)}KB (${savingsPercent}%)`);
    console.log(`\n✅ Originals backed up to: ${BACKUP_DIR}`);
  }
}

main().catch(console.error);
