import multer from 'multer';

// Configure multer to store images in memory instead of disk
const storage = multer.memoryStorage(); 

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10MB per file
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(file.originalname.toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
        }
    }
});

export default upload;
