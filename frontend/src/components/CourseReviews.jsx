import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Star, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import StarRating from "@/components/StarRating"
import {
    useGetCourseReviewsQuery,
    useCreateOrUpdateReviewMutation,
    useDeleteReviewMutation
} from "@/features/api/reviewApi"

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const CourseReviews = ({ courseId, canReview }) => {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetCourseReviewsQuery(courseId);
    const [createOrUpdateReview, { isLoading: saving }] = useCreateOrUpdateReviewMutation();
    const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

    const reviews = data?.reviews || [];
    const averageRating = data?.averageRating || 0;
    const reviewCount = data?.reviewCount || 0;
    const distribution = data?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const myReview = useMemo(
        () => reviews.find((r) => r.user?._id === user?._id),
        [reviews, user?._id]
    );

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // Prefill the form when the user's existing review loads
    useEffect(() => {
        if (myReview) {
            setRating(myReview.rating);
            setComment(myReview.comment || "");
        }
    }, [myReview]);

    const submit = async () => {
        if (rating < 1) {
            toast.error("Please select a star rating");
            return;
        }
        try {
            await createOrUpdateReview({ courseId, rating, comment }).unwrap();
            toast.success(myReview ? "Review updated" : "Review submitted");
        } catch (err) {
            toast.error(err?.data?.message || "Could not save review");
        }
    };

    const remove = async () => {
        try {
            await deleteReview(courseId).unwrap();
            setRating(0);
            setComment("");
            toast.success("Review removed");
        } catch (err) {
            toast.error(err?.data?.message || "Could not remove review");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Student Reviews
            </h2>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
            ) : (
                <>
                    {}
                    <div className="flex flex-col sm:flex-row gap-6 sm:items-center rounded-2xl border border-border/60 bg-card p-6 mb-6">
                        <div className="text-center sm:border-r sm:border-border/60 sm:pr-6">
                            <div className="text-5xl font-extrabold text-foreground">{averageRating.toFixed(1)}</div>
                            <StarRating value={averageRating} size={16} className="mt-1 justify-center" />
                            <p className="text-xs text-muted-foreground mt-1">{reviewCount} review{reviewCount === 1 ? "" : "s"}</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = distribution[star] || 0;
                                const pct = reviewCount ? (count / reviewCount) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-sm">
                                        <span className="w-3 text-muted-foreground">{star}</span>
                                        <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="w-8 text-right text-muted-foreground text-xs">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {}
                    {canReview && (
                        <div className="rounded-2xl border border-border/60 bg-card p-6 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-semibold">{myReview ? "Your review" : "Write a review"}</p>
                                {myReview && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={remove}
                                        disabled={deleting}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                )}
                            </div>
                            <StarRating value={rating} onChange={setRating} size={28} className="mb-3" />
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                maxLength={1000}
                                placeholder="Share what you thought about this course..."
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                            />
                            <div className="flex justify-end mt-3">
                                <Button onClick={submit} disabled={saving} className="rounded-xl font-semibold">
                                    {saving ? "Saving..." : myReview ? "Update Review" : "Submit Review"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {}
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border border-dashed border-border/60 rounded-2xl">
                            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No reviews yet</p>
                            <p className="text-sm">{canReview ? "Be the first to share your experience!" : "Enroll to leave the first review."}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((r) => (
                                <div key={r._id} className="rounded-2xl border border-border/60 bg-card p-5">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={r.user?.photoUrl} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {r.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <p className="font-semibold text-sm">
                                                    {r.user?.name || "Student"}
                                                    {r.user?._id === user?._id && (
                                                        <span className="ml-2 text-xs text-primary font-medium">(You)</span>
                                                    )}
                                                </p>
                                                <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                                            </div>
                                            <StarRating value={r.rating} size={13} className="my-1" />
                                            {r.comment && (
                                                <p className="text-sm text-muted-foreground leading-relaxed mt-1 whitespace-pre-line">{r.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CourseReviews;
