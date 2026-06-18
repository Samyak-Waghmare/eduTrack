import { useParams, Navigate } from "react-router-dom"
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"

const PurchaseCourseProtectedRoute = ({ children }) => {
    const { courseId } = useParams();
    const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} replace />;
}

export default PurchaseCourseProtectedRoute;
