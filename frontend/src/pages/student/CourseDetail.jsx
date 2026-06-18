import { useParams, useNavigate } from "react-router-dom"
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, CheckCircle, Clock, Globe, Lock, Play, Star, Users, Zap, Award, BarChart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import BuyCourseButton from "@/components/BuyCourseButton"
import StarRating from "@/components/StarRating"
import CourseReviews from "@/components/CourseReviews"

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

    if (isLoading) return (
        <div className="min-h-screen">
            <div className="h-72 bg-muted animate-pulse" />
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-3/4 rounded-xl" />
                    <Skeleton className="h-4 w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3 rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-2xl mt-6" />
                </div>
                <div><Skeleton className="h-96 w-full rounded-2xl" /></div>
            </div>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <BookOpen size={28} className="text-destructive" />
            </div>
            <p className="font-bold text-lg">Failed to load course details</p>
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">Go Back</Button>
        </div>
    );

    const { course, purchased } = data;
    const levelConfig = {
        "Beginner": { cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25", dot: "bg-emerald-500" },
        "Medium": { cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25", dot: "bg-amber-500" },
        "Advance": { cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25", dot: "bg-rose-500" },
    };
    const lvl = levelConfig[course.level] || levelConfig["Beginner"];

    return (
        <div className="min-h-screen bg-background">
            {}
            <div className="relative bg-gradient-to-br from-slate-900 via-primary/20 to-purple-950 dark:from-slate-950 dark:via-primary/15 dark:to-purple-950 text-white py-14 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-800/20 blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="max-w-3xl space-y-5">
                        {}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${lvl.cls}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${lvl.dot}`} />
                                {course.level || "Beginner"}
                            </span>
                            {course.category && (
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 text-white/80 bg-white/10 backdrop-blur-sm">
                                    {course.category}
                                </span>
                            )}
                        </div>

                        {}
                        <h1 className="text-3xl md:text-[2.6rem] font-black leading-tight tracking-tight">
                            {course.title}
                        </h1>
                        {course.subTitle && (
                            <p className="text-white/65 text-lg leading-relaxed">{course.subTitle}</p>
                        )}

                        {}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-white/60 font-medium">
                            {course.reviewCount > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <StarRating value={course.rating} size={14} />
                                    <span className="font-bold text-amber-400">{course.rating?.toFixed(1)}</span>
                                    <span>({course.reviewCount} reviews)</span>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Users size={14} className="text-white/50" />
                                {course.enrolledStudents?.length || 0} students
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} className="text-white/50" />
                                {course.lectures?.length || 0} lectures
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Globe size={14} className="text-white/50" />
                                English
                            </span>
                        </div>

                        {}
                        <div className="flex items-center gap-3 pt-1">
                            <Avatar className="h-11 w-11 ring-2 ring-white/20 shadow-lg">
                                <AvatarImage src={course.creator?.photoUrl} />
                                <AvatarFallback className="bg-primary/70 text-white font-bold text-lg">
                                    {course.creator?.name?.charAt(0) || "I"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs text-white/50 font-medium">Created by</p>
                                <p className="font-bold text-white">{course.creator?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
                {}
                <div className="md:col-span-2 space-y-8">
                    {}
                    {course.description && (
                        <div className="rounded-2xl border border-border/60 bg-card p-7">
                            <h2 className="text-xl font-black mb-4 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <BarChart size={15} className="text-primary" />
                                </div>
                                About This Course
                            </h2>
                            <p className="text-muted-foreground leading-relaxed font-medium">{course.description}</p>
                        </div>
                    )}

                    {}
                    <div className="rounded-2xl border border-border/60 bg-card p-7">
                        <h2 className="text-xl font-black mb-5 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle size={15} className="text-emerald-500" />
                            </div>
                            What You'll Learn
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                "In-demand industry skills",
                                "Hands-on practical projects",
                                "Certificate of completion",
                                "Lifetime access to content",
                                "Expert instructor support",
                                "Real-world applications",
                            ].map(item => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-sm text-foreground font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                        <div className="px-7 py-5 border-b border-border/60 bg-muted/30 flex items-center justify-between">
                            <h2 className="text-xl font-black flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Play size={14} className="text-primary fill-primary" />
                                </div>
                                Course Content
                            </h2>
                            <span className="text-sm text-muted-foreground font-semibold">{course.lectures?.length || 0} lectures</span>
                        </div>
                        <div className="divide-y divide-border/40">
                            {course.lectures?.map((lecture, idx) => (
                                <div
                                    key={lecture._id}
                                    className="flex items-center gap-4 px-7 py-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        lecture.isPreviewFree
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {lecture.isPreviewFree
                                            ? <Play size={14} className="fill-primary" />
                                            : <Lock size={13} />
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-semibold text-foreground">
                                            {idx + 1}. {lecture.lectureTitle}
                                        </span>
                                    </div>
                                    {lecture.isPreviewFree && (
                                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            Preview
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <CourseReviews courseId={courseId} canReview={purchased} />
                </div>

                {}
                <div>
                    <div className="sticky top-24 rounded-2xl border border-border/60 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
                        {}
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
                                        <BookOpen size={36} className="text-primary/50" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-5">
                            {}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-foreground">
                                    {course.price === 0 || !course.price ? "Free" : `₹${course.price}`}
                                </span>
                                {course.price > 0 && (
                                    <span className="text-sm text-muted-foreground line-through">₹{Math.round(course.price * 1.5)}</span>
                                )}
                                {course.price > 0 && (
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">33% OFF</span>
                                )}
                            </div>

                            {}
                            {purchased ? (
                                <Button
                                    onClick={() => navigate(`/course-progress/${courseId}`)}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base border-0 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <Play className="mr-2 h-4 w-4 fill-white" />
                                    Continue Learning
                                </Button>
                            ) : (
                                <BuyCourseButton courseId={courseId} course={course} />
                            )}

                            {}
                            <div className="pt-3 space-y-3">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">This course includes:</p>
                                {[
                                    { icon: BookOpen, text: `${course.lectures?.length || 0} on-demand lectures` },
                                    { icon: Zap, text: "Full lifetime access" },
                                    { icon: Award, text: "Certificate of completion" },
                                    { icon: Globe, text: "Access on mobile & desktop" },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 text-sm">
                                        <Icon size={15} className="text-primary/70 shrink-0" />
                                        <span className="text-muted-foreground font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail;
