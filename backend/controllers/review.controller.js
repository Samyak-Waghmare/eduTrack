import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

export const getCourseRatingStats = async (courseIds = []) => {
    const ids = courseIds
        .filter(Boolean)
        .map((id) => new mongoose.Types.ObjectId(id));
    if (ids.length === 0) return {};

    const rows = await Review.aggregate([
        { $match: { course: { $in: ids } } },
        {
            $group: {
                _id: "$course",
                rating: { $avg: "$rating" },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    return rows.reduce((acc, row) => {
        acc[row._id.toString()] = {
            rating: Math.round(row.rating * 10) / 10,
            reviewCount: row.reviewCount
        };
        return acc;
    }, {});
};

const hasAccess = async (courseId, userId) => {
    const purchased = await CoursePurchase.findOne({
        courseId,
        userId,
        status: "completed"
    });
    if (purchased) return true;
    const course = await Course.findById(courseId).select("enrolledStudents");
    return !!course?.enrolledStudents?.some((s) => s.toString() === userId);
};

export const createOrUpdateReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        let { rating, comment } = req.body;

        rating = Number(rating);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 1 and 5"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (!(await hasAccess(courseId, userId))) {
            return res.status(403).json({
                success: false,
                message: "You can only review courses you are enrolled in"
            });
        }

        const review = await Review.findOneAndUpdate(
            { course: courseId, user: userId },
            { rating, comment: (comment || "").trim() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate({ path: "user", select: "name photoUrl" });

        return res.status(200).json({
            success: true,
            message: "Review saved",
            review
        });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to save review" });
    }
};

export const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;

        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const reviews = await Review.find({ course: courseId })
            .populate({ path: "user", select: "name photoUrl" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const stats = await Review.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        let reviewCount = 0;
        let totalScore = 0;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        stats.forEach((stat) => {
            distribution[stat._id] = stat.count;
            reviewCount += stat.count;
            totalScore += stat._id * stat.count;
        });

        const averageRating = reviewCount ? Math.round((totalScore / reviewCount) * 10) / 10 : 0;

        return res.status(200).json({
            success: true,
            reviews,
            averageRating,
            reviewCount,
            distribution,
            currentPage: pageNumber,
            totalPages: Math.ceil(reviewCount / limitNumber)
        });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to get reviews" });
    }
};

export const deleteMyReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const deleted = await Review.findOneAndDelete({ course: courseId, user: req.id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        return res.status(200).json({ success: true, message: "Review removed" });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to delete review" });
    }
};
