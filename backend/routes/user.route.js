import express from "express"
import { getUserProfile, login, logout, register, updateProfile, getLeaderboard, getPublicPortfolio } from "../controllers/user.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js"
import upload from "../utils/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile").get(isAuthenticated, getUserProfile)
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile)
router.route("/leaderboard").get(isAuthenticated, getLeaderboard)
router.route("/portfolio/:userId").get(getPublicPortfolio)

export default router;