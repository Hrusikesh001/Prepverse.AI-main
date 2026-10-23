import {Router} from 'express'
import {signup, login, logout, sendOtp, verifyOtp, updateMobile, deleteMobile} from '../controller/user.controller.js'
import secureRoute from '../middleware/secureRoute.js';
import validateOTP from '../middleware/validateOTP.js';
import verifyGoogleToken from '../middleware/verifyGoogleToken.js';

const router = Router();

router.post('/signup',verifyGoogleToken, validateOTP, signup);
router.post('/login', verifyGoogleToken, validateOTP, login);
router.post('/logout', secureRoute, logout);
router.post('/sendOTP', sendOtp);
router.post('/verifyOTP', verifyOtp);
router.post('/update-mobile', secureRoute, updateMobile);
router.post('/delete-mobile', secureRoute, deleteMobile);

export default router;

























