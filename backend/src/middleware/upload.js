const fs = require('fs');
const path = require('path');
const multer = require('multer');

const MAX_REVIEW_IMAGES = 4;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const reviewUploadsPath = path.resolve(__dirname, '../../uploads/reviews');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(reviewUploadsPath, { recursive: true });
    cb(null, reviewUploadsPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error('Invalid file type. Only jpeg, png and webp are allowed'));
    return;
  }

  cb(null, true);
}

const uploadReviewImages = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: MAX_REVIEW_IMAGES
  },
  fileFilter
}).array('images', MAX_REVIEW_IMAGES);

module.exports = {
  uploadReviewImages,
  MAX_REVIEW_IMAGES
};

