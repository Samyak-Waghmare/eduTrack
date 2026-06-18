import express from "express";
import { getInstructorAnalytics } from "../controllers/analytics.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isInstructor } from "../middleware/isInstructor.js";

const router = express.Router();


router.route("/").get(isAuthenticated, isInstructor, getInstructorAnalytics);

export default router;
