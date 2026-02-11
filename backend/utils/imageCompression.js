const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Compress and optimize images automatically
 * - Converts to WebP format (best compression)
 * - Resizes to max dimensions (prevents huge uploads)
 * - Strips metadata (privacy + smaller file)
 * - Quality optimized for web (75%)
 */
const compressImage = async (file, outputDir, maxWidth = 600, maxHeight = 600) => {
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    
    // Always save as WebP for best compression
    const filename = `${originalName}-${uniqueSuffix}.webp`;
    const filepath = path.join(outputDir, filename);

    // Process image with Sharp
    await sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',  // Maintain aspect ratio
        withoutEnlargement: true  // Don't upscale smaller images
      })
      .webp({
        quality: 75,  // Optimized for web performance
        effort: 5     // Compression effort (0-6, higher = smaller file but slower)
      })
      .toFile(filepath);

    // Get file size info for logging
    const stats = fs.statSync(filepath);
    const originalSize = file.buffer.length;
    const compressedSize = stats.size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    console.log(`✅ Image compressed: ${file.originalname}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB → Compressed: ${(compressedSize / 1024).toFixed(1)}KB`);
    console.log(`   Saved ${savings}% (${((originalSize - compressedSize) / 1024).toFixed(1)}KB)`);

    return filename;
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
};

/**
 * Create compressed images directory if it doesn't exist
 */
const ensureCompressedImagesDir = (baseDir) => {
  const compressedDir = path.join(baseDir, 'compressed-images');
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
    console.log('📁 Created compressed-images directory');
  }
  return compressedDir;
};

module.exports = {
  compressImage,
  ensureCompressedImagesDir
};
