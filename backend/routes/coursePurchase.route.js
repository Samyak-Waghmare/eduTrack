import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
    createCheckoutSession,
    verifyPaymentSession,
    getCourseDetailWithPurchaseStatus,
    getAllPurchasedCourse,
    getMyPurchasedCourses
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/verify").post(isAuthenticated, verifyPaymentSession);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated, getAllPurchasedCourse);
router.route("/my-courses").get(isAuthenticated, getMyPurchasedCourses);

export default router;
