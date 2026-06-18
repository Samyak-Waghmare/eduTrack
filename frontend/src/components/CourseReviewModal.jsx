import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { useCreateOrUpdateReviewMutation } from '@/features/api/reviewApi';
import { toast } from 'sonner';

const CourseReviewModal = ({ courseId, isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    const [submitReview, { isLoading }] = useCreateOrUpdateReviewMutation();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        try {
            await submitReview({ courseId, rating, comment }).unwrap();
            toast.success("Review submitted successfully!");
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to submit review");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-card border-border/60">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-black text-center text-foreground">
                        How would you rate this course?
                    </DialogTitle>
                    <DialogDescription className="text-center font-medium text-muted-foreground">
                        Your feedback helps other students decide if this course is right for them.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6">
                    {}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    size={36}
                                    className={`transition-colors duration-200 ${
                                        star <= (hover || rating)
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-muted text-muted-foreground/30"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="w-full">
                        <Textarea
                            placeholder="Tell us about your experience in this course... (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[120px] resize-none rounded-xl border-border/60 bg-muted/30 focus-visible:ring-primary p-4"
                        />
                    </div>

                    <div className="flex w-full gap-3 pt-2">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 rounded-xl h-12 font-bold text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isLoading || rating === 0}
                            className="flex-1 rounded-xl h-12 btn-primary-gradient text-white font-bold border-0 shadow-lg shadow-primary/20"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CourseReviewModal;
