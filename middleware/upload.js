/**
 * File Upload Middleware
 * Using Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sanitizeFilename, isAllowedFileType } = require('../utils/helpers');

// Ensure upload directories exist (cross-platform)
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Use path.resolve for absolute cross-platform paths
ensureDirectoryExists(path.resolve(__dirname, '..', 'uploads', 'profiles'));
ensureDirectoryExists(path.resolve(__dirname, '..', 'uploads', 'posts'));

// Storage configuration (cross-platform)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads';
        
        if (file.fieldname === 'profile_picture') {
            uploadPath = path.join('uploads', 'profiles');
        } else if (file.fieldname === 'post_image' || file.fieldname === 'image') {
            uploadPath = path.join('uploads', 'posts');
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const sanitized = sanitizeFilename(path.basename(file.originalname, ext));
        cb(null, sanitized + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (isAllowedFileType(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
    }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'File size exceeds 5MB limit');
        } else {
            req.flash('error', 'File upload error: ' + err.message);
        }
    } else if (err) {
        req.flash('error', err.message);
    }
    next();
};

module.exports = {
    upload,
    handleUploadError
};
