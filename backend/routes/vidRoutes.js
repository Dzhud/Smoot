import express from 'express';
import multer from 'multer';
import { uploadVideo, getVideoByRequestId,
    allVids, updateSingleVid, delSingleVid
 } from '../controllers/videoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Routes
router.post('/upload', authMiddleware, upload.single('name'), uploadVideo);
router.get('/:requestId', getVideoByRequestId);
router.get('/', authMiddleware, allVids);
router.patch('/:requestId', updateSingleVid);
router.delete('/:requestId', delSingleVid);

export default router;
