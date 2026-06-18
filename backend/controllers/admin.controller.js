import { User } from "../models/user.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({});
        const users = await User.find({}).select("-password").skip(skip).limit(limit);
        
        return res.status(200).json({
            success: true,
            users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { role } = req.body;
        
        if (!["Instructor", "Student", "Admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }
        
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};

export const getAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalInstructors = await User.countDocuments({ role: "Instructor" });

        const purchases = await CoursePurchase.find({ status: "completed" });
        const totalRevenue = purchases.reduce((acc, purchase) => acc + (purchase.amount || 0), 0);

        const totalCourses = await Course.countDocuments({});

        const salesData = await CoursePurchase.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$amount" },
                    sales: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedSalesData = salesData.map((item) => ({
            date: item._id,
            revenue: item.revenue,
            sales: item.sales
        }));

        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalInstructors,
                totalRevenue,
                totalCourses,
                salesData: formattedSalesData
            }
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to load analytics dashboard"
        });
    }
};
