import {Router} from 'express'
import secureRoute from '../middleware/secureRoute.js'
import {checkRoleAndTopicQuiz} from '../controller/quiz.controller.js'

const router = Router();

router.post('/generate-quiz-questions', secureRoute, checkRoleAndTopicQuiz);

export default router;




















