import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

export const getInstructorAnalytics = async (req, res) => {
    try {
        const instructorId = req.id;

        const instructorCourses = await Course.find({ creator: instructorId });
        const courseIds = instructorCourses.map(course => course._id);

        if (courseIds.length === 0) {
            return res.status(200).json({
                success: true,
                analytics: {
                    totalRevenue: 0,
                    totalSales: 0,
                    totalActiveCourses: 0,
                    revenueData: [],
                    courseSalesData: []
                }
            });
        }

        const purchases = await CoursePurchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        }).populate("courseId");

        const totalSales = purchases.length;
        const totalRevenue = purchases.reduce((acc, purchase) => acc + (purchase.amount || 0), 0);
        const totalActiveCourses = instructorCourses.filter(c => c.isPublished).length;

        const revenueMap = {};
        purchases.forEach(purchase => {
            const date = new Date(purchase.createdAt);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!revenueMap[monthYear]) {
                revenueMap[monthYear] = 0;
            }
            revenueMap[monthYear] += purchase.amount || 0;
        });

        const revenueData = Object.keys(revenueMap)
            .sort()
            .map(date => ({
                date,
                revenue: revenueMap[date]
            }));

        const courseSalesMap = {};
        purchases.forEach(purchase => {
            if (!purchase.courseId) return; 
            const courseTitle = purchase.courseId.title;
            if (!courseSalesMap[courseTitle]) {
                courseSalesMap[courseTitle] = { sales: 0, revenue: 0 };
            }
            courseSalesMap[courseTitle].sales += 1;
            courseSalesMap[courseTitle].revenue += purchase.amount || 0;
        });

        const courseSalesData = Object.keys(courseSalesMap).map(title => ({
            name: title.substring(0, 20) + (title.length > 20 ? '...' : ''),
            sales: courseSalesMap[title].sales,
            revenue: courseSalesMap[title].revenue
        }));

        return res.status(200).json({
            success: true,
            analytics: {
                totalRevenue,
                totalSales,
                totalActiveCourses,
                revenueData,
                courseSalesData
            }
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to load instructor analytics."
        });
    }
};
