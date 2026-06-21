import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Lecture } from "../models/lecture.model.js";
import { getCourseRatingStats } from "./review.controller.js";
import { stripe, isStripeEnabled } from "../utils/stripe.js";
import { sendEmail, getReceiptEmailTemplate } from "../utils/sendEmail.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const fulfillPurchase = async (purchase) => {
    let isNewPurchase = false;
    if (purchase.status !== "completed") {
        purchase.status = "completed";
        await purchase.save();
        isNewPurchase = true;
    }
    
    await Course.findByIdAndUpdate(purchase.courseId, { $addToSet: { enrolledStudents: purchase.userId } });
    await User.findByIdAndUpdate(purchase.userId, { $addToSet: { enrolledCourses: purchase.courseId } });

    if (isNewPurchase) {
        try {
            const user = await User.findById(purchase.userId);
            const course = await Course.findById(purchase.courseId);
            if (user && course) {
                sendEmail({
                    to: user.email,
                    subject: `Receipt: ${course.title}`,
                    html: getReceiptEmailTemplate(user.name, course.title, purchase.amount)
                });
            }
        } catch (error) {

        }
    }
};

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!", success: false });
        }

        const existingPurchase = await CoursePurchase.findOne({ courseId, userId, status: "completed" });
        if (existingPurchase) {
            return res.status(400).json({
                success: false,
                message: "You have already purchased this course"
            });
        }

        const newPurchase = await CoursePurchase.create({
            courseId,
            userId,
            amount: course.price,
            status: "pending"
        });

        if (isStripeEnabled && course.price > 0) {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: course.title,
                                images: course.thumbnail ? [course.thumbnail] : []
                            },
                            unit_amount: Math.round(course.price * 100)
                        },
                        quantity: 1
                    }
                ],
                success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${CLIENT_URL}/course-detail/${courseId}`,
                metadata: { courseId: courseId.toString(), userId: userId.toString() }
            });

            newPurchase.paymentId = session.id;
            await newPurchase.save();

            return res.status(200).json({ success: true, url: session.url });
        }

        newPurchase.paymentId = `MOCK_${Date.now()}`;
        await fulfillPurchase(newPurchase);

        return res.status(200).json({
            success: true,
            message: "Course purchased successfully!",
            courseId
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to process payment"
        });
    }
};

export const verifyPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Missing session id" });
        }
        if (!isStripeEnabled) {
            return res.status(400).json({ success: false, message: "Stripe is not configured" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        const purchase = await CoursePurchase.findOne({ paymentId: sessionId });
        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase record not found" });
        }

        if (purchase.userId.toString() !== req.id) {
            return res.status(403).json({ success: false, message: "Not authorized for this purchase" });
        }

        await fulfillPurchase(purchase);

        return res.status(200).json({
            success: true,
            message: "Payment verified",
            courseId: purchase.courseId
        });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
            .populate({ path: "creator", select: "name photoUrl" })
            .populate({ path: "lectures", select: "lectureTitle isPreviewFree videoUrl" });

        let purchased = null;
        if (userId) {
            purchased = await CoursePurchase.findOne({ courseId, userId, status: "completed" });
        }

        if (!course) {
            return res.status(404).json({ message: "course not found!" });
        }

        const stats = await getCourseRatingStats([course._id]);
        const s = stats[course._id.toString()] || { rating: 0, reviewCount: 0 };

        return res.status(200).json({
            course: { ...course.toObject(), rating: s.rating, reviewCount: s.reviewCount },
            purchased: !!purchased,
            success: true
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get course details"
        });
    }
};

export const getAllPurchasedCourse = async (req, res) => {
    try {
        const purchasedCourse = await CoursePurchase.find({
            status: "completed"
        }).populate("courseId");

        if (!purchasedCourse) {
            return res.status(404).json({
                purchasedCourse: [],
                success: false
            });
        }
        return res.status(200).json({
            purchasedCourse,
            success: true
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get purchased courses"
        });
    }
};

export const getMyPurchasedCourses = async (req, res) => {
    try {
        const userId = req.id;
        const purchases = await CoursePurchase.find({ userId, status: "completed" })
            .populate({ path: "courseId", populate: { path: "creator", select: "name photoUrl" } });

        return res.status(200).json({
            success: true,
            purchasedCourses: purchases.map(p => p.courseId).filter(Boolean)
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get purchased courses"
        });
    }
};
