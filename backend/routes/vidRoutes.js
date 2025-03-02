import express from 'express';
import multer from 'multer';
import { uploadVideo, getVideoByRequestId } from '../controllers/videoController.js';
//import authMiddleware from '../middleware/authMiddleware.js';
import Video from '../models/Vid.js';

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
router.post('/upload', upload.single('name'), uploadVideo);
router.get('/:requestId', getVideoByRequestId);
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedVideo);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        // Fetch the video name before deleting
        const video = await Video.findById(req.params.id, "name");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const videoName = video.name;
        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json(`Video "${videoName}" has been deleted!`);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
