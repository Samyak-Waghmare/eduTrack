import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
    createCourse,
    editCourse,
    getCourseById,
    getCreatorCourses,
    getPublishedCourses,
    searchCourse,
    togglePublishCourse,
    createLecture,
    getCourseLecture,
    editLecture,
    removeLecture,
    getLectureById,
    uploadSubtitle,
    getCloudinarySignature
} from "../controllers/course.controller.js";
import {
    createOrUpdateReview,
    getCourseReviews,
    deleteMyReview
} from "../controllers/review.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/cloudinary-signature").get(isAuthenticated, getCloudinarySignature);
router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(searchCourse);
router.route("/published-courses").get(getPublishedCourses);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/publish").patch(isAuthenticated, togglePublishCourse);

router.route("/:courseId/reviews").get(getCourseReviews);
router.route("/:courseId/review").post(isAuthenticated, createOrUpdateReview);
router.route("/:courseId/review").delete(isAuthenticated, deleteMyReview);

router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated, upload.single("video"), editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId/lecture/:lectureId/subtitle").post(isAuthenticated, upload.single("subtitle"), uploadSubtitle);

export default router;
