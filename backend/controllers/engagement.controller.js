import { QA } from "../models/qa.model.js";
import { Quiz } from "../models/quiz.model.js";
import { getIO } from "../utils/socket.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

export const getQuestionsForLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const questions = await QA.find({ lectureId })
            .populate("user", "name photoUrl")
            .populate("replies.user", "name photoUrl")
            .sort({ createdAt: -1 });
        
        return res.status(200).json({ success: true, questions });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to fetch questions" });
    }
};

export const getInstructorQA = async (req, res) => {
    try {
        const userId = req.id;
        
        const myCourses = await Course.find({ creator: userId }).select("_id");
        const courseIds = myCourses.map(c => c._id);

        const questions = await QA.find({ courseId: { $in: courseIds } })
            .populate("courseId", "title")
            .populate("lectureId", "lectureTitle")
            .populate("user", "name photoUrl")
            .populate("replies.user", "name photoUrl role")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, questions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch instructor Q&A" });
    }
};

export const askQuestion = async (req, res) => {
    try {
        const { lectureId, courseId } = req.params;
        const { content } = req.body;
        const userId = req.id;

        if (!content) return res.status(400).json({ success: false, message: "Content is required" });

        const question = await QA.create({ lectureId, courseId, user: userId, content });
        await question.populate("user", "name photoUrl");

        const io = getIO();
        io.to(`qa_${lectureId}`).emit("new_question", question);

        return res.status(201).json({ success: true, message: "Question posted", question });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to post question" });
    }
};

export const replyToQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { content } = req.body;
        const userId = req.id;

        if (!content) return res.status(400).json({ success: false, message: "Content is required" });

        const question = await QA.findById(questionId);
        if (!question) return res.status(404).json({ success: false, message: "Question not found" });

        question.replies.push({ user: userId, content });
        await question.save();
        await question.populate("replies.user", "name photoUrl");

        const io = getIO();
        io.to(`qa_${question.lectureId}`).emit("new_reply", { questionId, replies: question.replies });

        await User.findByIdAndUpdate(userId, { $inc: { xp: 20 } });

        return res.status(201).json({ success: true, message: "Reply posted", question });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to post reply" });
    }
};

export const getQuizForLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const quiz = await Quiz.findOne({ lectureId });
        
        if (!quiz) return res.status(200).json({ success: true, quiz: null });
        return res.status(200).json({ success: true, quiz });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to fetch quiz" });
    }
};

export const createOrUpdateQuiz = async (req, res) => {
    try {
        const { lectureId, courseId } = req.params;
        const { questions } = req.body;

        if (!questions || !questions.length) {
            return res.status(400).json({ success: false, message: "Questions are required" });
        }

        let quiz = await Quiz.findOne({ lectureId });
        if (quiz) {
            quiz.questions = questions;
            await quiz.save();
        } else {
            quiz = await Quiz.create({ lectureId, courseId, questions });
        }

        return res.status(200).json({ success: true, message: "Quiz saved", quiz });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to save quiz" });
    }
};
