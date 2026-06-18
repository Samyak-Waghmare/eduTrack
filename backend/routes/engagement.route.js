import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { 
    getQuestionsForLecture, 
    askQuestion, 
    replyToQuestion, 
    getQuizForLecture, 
    createOrUpdateQuiz,
    getInstructorQA
} from "../controllers/engagement.controller.js";

const router = express.Router();

router.route("/course/:courseId/lecture/:lectureId/qa").get(isAuthenticated, getQuestionsForLecture);
router.route("/course/:courseId/lecture/:lectureId/qa").post(isAuthenticated, askQuestion);
router.route("/qa/:questionId/reply").post(isAuthenticated, replyToQuestion);

router.route("/instructor/qa").get(isAuthenticated, getInstructorQA);

router.route("/course/:courseId/lecture/:lectureId/quiz").get(isAuthenticated, getQuizForLecture);
router.route("/course/:courseId/lecture/:lectureId/quiz").post(isAuthenticated, createOrUpdateQuiz);

export default router;
