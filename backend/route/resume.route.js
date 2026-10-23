import {Router} from 'express'
import secureRoute from '../middleware/secureRoute.js'
import {createResume, getResumes, editResume} from '../controller/resume.controller.js'

const router = Router();

router.post('/create-resume', secureRoute, createResume);
router.post('/get-resumes', secureRoute, getResumes);
router.post('/edit-resume', secureRoute, editResume);

export default router;

