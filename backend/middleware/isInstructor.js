import { User } from "../models/user.model.js";

export const isInstructor = async (req, res, next) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.role !== "Instructor" && user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Instructor role required."
            });
        }
        next();
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to authenticate instructor"
        });
    }
};
