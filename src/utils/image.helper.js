const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Process an uploaded image file:
 * - Sanitizes filename (removes spaces, parentheses, special chars)
 * - Converts image to compressed .webp format
 * - Deletes the raw original file if different path
 * - Returns the sanitized .webp filename
 */
const processAndConvertImageToWebp = async (fileObject, targetDirectory) => {
  if (!fileObject || !fileObject.filename) return null;

  const originalPath = path.join(targetDirectory, fileObject.filename);
  if (!fs.existsSync(originalPath)) {
    return fileObject.filename.replace(/\s+/g, '-');
  }

  let nameWithoutExt = path.parse(fileObject.originalname || fileObject.filename).name;
  let cleanBaseName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/gi, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');

  if (!cleanBaseName) cleanBaseName = 'image';

  const timestamp = Date.now();
  const webpFilename = `${timestamp}-${cleanBaseName}.webp`;
  const webpPath = path.join(targetDirectory, webpFilename);

  try {
    await sharp(originalPath)
      .webp({ quality: 80, effort: 4 })
      .toFile(webpPath);

    if (fs.existsSync(originalPath) && originalPath !== webpPath) {
      try { fs.unlinkSync(originalPath); } catch (e) {}
    }

    return webpFilename;
  } catch (err) {
    console.error("Error compressing/converting image to webp:", err);
    const fallbackName = fileObject.filename.replace(/\s+/g, '-');
    return fallbackName;
  }
};

/**
 * Clean URL string to remove spaces and guarantee no whitespace exists in image URLs
 */
const cleanImageUrl = (url) => {
  if (!url) return null;
  let str = String(url).trim();
  if (!str || str === 'null' || str === 'undefined' || str.endsWith('/uploads/') || str.endsWith('/undefined')) return null;
  return str.replace(/\s+/g, '-').replace(/%20/g, '-');
};

module.exports = {
  processAndConvertImageToWebp,
  cleanImageUrl
};
