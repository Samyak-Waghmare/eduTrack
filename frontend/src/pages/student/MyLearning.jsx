import { useGetMyPurchasedCoursesQuery } from "@/features/api/purchaseApi"
import CourseCard from "@/components/CourseCard"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, GraduationCap, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const MyLearning = () => {
    const { data, isLoading } = useGetMyPurchasedCoursesQuery();
    const navigate = useNavigate();
    const courses = data?.purchasedCourses || [];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background">
            {}
            <div className="relative bg-gradient-to-br from-primary/8 via-background to-purple-600/5 border-b border-border/60">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
                                <GraduationCap size={26} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-foreground tracking-tight">My Learning</h1>
                                <p className="text-muted-foreground font-medium text-sm mt-0.5">
                                    {courses.length > 0
                                        ? `${courses.length} course${courses.length !== 1 ? "s" : ""} in your library`
                                        : "Your learning journey starts here"
                                    }
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate("/course/search")}
                            variant="outline"
                            className="gap-2 rounded-xl h-10 px-5 font-bold border-border/70 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
                        >
                            Browse Courses
                            <ArrowRight size={15} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 shimmer" />
                                </div>
                                <div className="p-5 space-y-3">
                                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-xl mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        {}
                        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/15">
                            <div className="flex items-center gap-3">
                                <Sparkles size={18} className="text-primary" />
                                <p className="text-sm font-bold text-foreground">
                                    You're learning! Keep up the great work. 🚀
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course, index) => (
                                <div key={course._id} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="relative mb-8">
                            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/15 to-purple-500/15 flex items-center justify-center shadow-xl border border-primary/15">
                                <BookOpen size={44} className="text-primary/60" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                                <Sparkles size={16} className="text-amber-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3">Start your journey</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed font-medium mb-8">
                            You haven't enrolled in any courses yet. Explore our collection and start learning today!
                        </p>
                        <Button
                            onClick={() => navigate("/course/search")}
                            className="btn-primary-gradient text-white font-bold px-8 h-12 rounded-xl border-0 gap-2"
                        >
                            <Sparkles size={16} />
                            Explore Courses
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyLearning;
