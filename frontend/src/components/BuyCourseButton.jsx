import { Button } from "@/components/ui/button"
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi"
import { Loader2, ShoppingCart } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

const BuyCourseButton = ({ courseId, course }) => {
    const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] = useCreateCheckoutSessionMutation();

    const isFree = course?.price === 0 || !course?.price;

    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId);
    };

    useEffect(() => {
        if (isSuccess) {
            
            if (data?.url) {
                window.location.href = data.url;
                return;
            }
            
            toast.success(data?.message || "Successfully enrolled!");
            window.location.href = `/course-progress/${data?.courseId || courseId}`;
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to process enrollment");
        }
    }, [isSuccess, isError]);

    return (
        <Button
            disabled={isLoading}
            onClick={purchaseCourseHandler}
            className={`w-full font-semibold py-6 rounded-xl shadow-lg transition-all ${
                isFree 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/30" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-blue-500/30"
            }`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isFree ? "Enroll for Free" : "Purchase Course"}
                </>
            )}
        </Button>
    )
}

export default BuyCourseButton;
