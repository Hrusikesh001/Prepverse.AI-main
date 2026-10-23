import express from 'express'
import {uploadResume, getResumeData} from '../controller/resumeUpload.controller.js'
import secureRoute from '../middleware/secureRoute.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post('/upload', secureRoute, upload.single("file"), uploadResume);
router.post('/getResumeData', secureRoute, getResumeData);


export default router
