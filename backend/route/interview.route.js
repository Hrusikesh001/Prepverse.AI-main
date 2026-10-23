import express from 'express'

import {Router} from 'express'
import { generateQuestions, checkRoleAndTopic} from '../controller/interview.controller.js';
import {createCompanyInterview, sendAllInterviews, searchInterviews, generateInterviewQuestions, evaluateInterviewResult, getAllCandidates} from '../controller/companyInterview.controller.js'
import secureRoute from '../middleware/secureRoute.js';

const router = Router();

router.post("/generate-question", secureRoute, generateQuestions);
router.post("/checkRoleAndTopic", secureRoute, checkRoleAndTopic);
router.post("/create-companyInterview", secureRoute, createCompanyInterview);
router.post("/getAll-Interviews", secureRoute, sendAllInterviews);
router.post("/search-Interviews", secureRoute, searchInterviews);
router.post("/generateInterviewQuestions", secureRoute, generateInterviewQuestions);
router.post("/evaluateInterviewResult", secureRoute, evaluateInterviewResult);
router.post("/getAllCandidates", secureRoute, getAllCandidates );

export default router;
























