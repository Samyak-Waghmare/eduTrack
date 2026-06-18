import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { User } from "../models/user.model.js";
import { getAllUsers, deleteUser, updateUserRole, getAdminAnalytics } from "../controllers/admin.controller.js";

const router = express.Router();

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.id);
        if (user && user.role === "Admin") {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify admin status"
        });
    }
};

router.route("/analytics").get(isAuthenticated, isAdmin, getAdminAnalytics);
router.route("/users").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/users/:userId").delete(isAuthenticated, isAdmin, deleteUser);
router.route("/users/:userId/role").patch(isAuthenticated, isAdmin, updateUserRole);

export default router;
