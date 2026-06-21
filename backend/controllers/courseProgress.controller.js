import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { sendEmail, getCertificateEmailTemplate } from "../utils/sendEmail.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

        const courseDetails = await Course.findById(courseId)
            .populate("lectures")
            .populate({ path: "creator", select: "name photoUrl" });

        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                },
                success: true
            });
        }

        return res.status(200).json({
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed
            },
            success: true
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get course progress"
        });
    }
};

export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;
        const { viewed } = req.body;

        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            });
        }

        const wasAlreadyCompleted = courseProgress.completed;

        const lectureIndex = courseProgress.lectureProgress.findIndex(
            lp => lp.lectureId === lectureId
        );

        let newlyViewed = false;
        if (lectureIndex !== -1) {
            if (!courseProgress.lectureProgress[lectureIndex].viewed && viewed) {
                newlyViewed = true;
            }
            courseProgress.lectureProgress[lectureIndex].viewed = viewed;
        } else {
            if (viewed) newlyViewed = true;
            courseProgress.lectureProgress.push({ lectureId, viewed });
        }

        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        const allViewed = courseDetails.lectures.every(lecture =>
            courseProgress.lectureProgress.some(
                lp => lp.lectureId === lecture._id.toString() && lp.viewed
            )
        );

        courseProgress.completed = allViewed;
        await courseProgress.save();

        let xpGained = 0;
        if (newlyViewed) {
            xpGained += 50;
        }

        if (!wasAlreadyCompleted && courseProgress.completed) {
            xpGained += 200;
            const user = await User.findById(userId);
            if (user) {
                sendEmail({
                    to: user.email,
                    subject: "Course Completed! Your Certificate is ready.",
                    html: getCertificateEmailTemplate(user.name, courseDetails.title)
                });
            }
        }

        if (xpGained > 0) {
            await User.findByIdAndUpdate(userId, { $inc: { xp: xpGained } });
        }

        return res.status(200).json({
            message: "Lecture progress updated successfully.",
            success: true
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to update lecture progress"
        });
    }
};

export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        let wasAlreadyCompleted = false;

        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                lectureProgress: courseDetails.lectures.map(lecture => ({
                    lectureId: lecture._id.toString(),
                    viewed: true
                })),
                completed: true
            });
        } else {
            wasAlreadyCompleted = courseProgress.completed;
            courseProgress.lectureProgress = courseDetails.lectures.map(lecture => ({
                lectureId: lecture._id.toString(),
                viewed: true
            }));
            courseProgress.completed = true;
        }
        await courseProgress.save();

        if (!wasAlreadyCompleted) {
            const user = await User.findByIdAndUpdate(userId, { $inc: { xp: 200 } }, { new: true });
            if (user) {
                sendEmail({
                    to: user.email,
                    subject: "Course Completed! Your Certificate is ready.",
                    html: getCertificateEmailTemplate(user.name, courseDetails.title)
                });
            }
        }

        return res.status(200).json({ message: "Course marked as completed.", success: true });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to mark course as completed"
        });
    }
};

export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        let courseProgress = await CourseProgress.findOne({ courseId, userId });
        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found", success: false });
        }

        let xpToSubtract = 0;
        if (courseProgress.completed) xpToSubtract += 200;
        courseProgress.lectureProgress.forEach((lp) => {
            if (lp.viewed) xpToSubtract += 50;
        });

        courseProgress.lectureProgress = courseDetails.lectures.map(lecture => ({
            lectureId: lecture._id.toString(),
            viewed: false
        }));
        courseProgress.completed = false;
        await courseProgress.save();

        if (xpToSubtract > 0) {
            await User.findByIdAndUpdate(userId, { $inc: { xp: -xpToSubtract } });
        }

        return res.status(200).json({ message: "Course marked as incomplete.", success: true });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to mark course as incomplete"
        });
    }
};
