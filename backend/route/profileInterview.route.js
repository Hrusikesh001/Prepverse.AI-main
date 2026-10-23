import express from 'express'
import { checkRoleValidity, profileBasedInterview } from '../controller/profileInterview.controller.js';
import secureRoute from '../middleware/secureRoute.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post('/checkRoleValidity', secureRoute, upload.single("file"), checkRoleValidity);
router.post('/profileBasedInterview', secureRoute, profileBasedInterview);


export default router
























