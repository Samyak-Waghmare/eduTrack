import { useGetPublishedCoursesQuery } from "@/features/api/courseApi"
import CourseCard from "@/components/CourseCard"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, ArrowRight, Flame, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const CourseSkeleton = () => (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex flex-col">
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
        </div>
        <div className="p-5 flex flex-col gap-3">
            <div className="space-y-2">
                <Skeleton className="h-5 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-28 rounded-lg" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border/50">
                <Skeleton className="h-4 w-20 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-lg" />
            </div>
        </div>
    </div>
);

const Courses = () => {
    const { data, isLoading, isError } = useGetPublishedCoursesQuery();
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/4 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[13px] font-bold tracking-wide uppercase mb-5">
                            <Flame size={14} className="text-orange-500" />
                            Featured Courses
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
                            Start Learning{" "}
                            <span className="gradient-text">Today</span>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Expert-crafted courses to help you build skills that matter. Learn at your own pace, on any device.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/course/search")}
                        className="shrink-0 gap-2.5 rounded-xl h-12 px-7 font-bold border border-border/70 bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                        variant="outline"
                    >
                        <TrendingUp size={16} />
                        View All Courses
                        <ArrowRight size={16} />
                    </Button>
                </div>

                {isError ? (
                    <div className="text-center py-24 border border-dashed border-border/60 rounded-3xl bg-card/40 backdrop-blur-sm">
                        <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                            <BookOpen size={32} className="text-destructive/70" />
                        </div>
                        <p className="font-bold text-xl text-foreground mb-2">Could not load courses</p>
                        <p className="text-muted-foreground text-base">Make sure the backend server is running on port 8080</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => <CourseSkeleton key={i} />)
                            : data?.courses?.length > 0
                                ? data.courses.map((course, index) => (
                                    <div
                                        key={course._id}
                                        className="animate-fade-up"
                                        style={{ animationDelay: `${index * 80}ms` }}
                                    >
                                        <CourseCard course={course} />
                                    </div>
                                ))
                                : (
                                    <div className="col-span-full text-center py-28 border border-dashed border-border/60 rounded-3xl bg-card/40">
                                        <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                                            <BookOpen size={36} className="text-muted-foreground/60" />
                                        </div>
                                        <p className="font-bold text-2xl text-foreground mb-3">No courses yet</p>
                                        <p className="text-muted-foreground text-base">Come back soon — exciting content is on its way!</p>
                                    </div>
                                )
                        }
                    </div>
                )}
            </div>

            {}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-purple-700 p-10 md:p-16 text-white text-center">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-900/30 blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                            Ready to Transform Your Career?
                        </h3>
                        <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                            Join over 50,000 students who are already building the skills of tomorrow.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => navigate("/course/search")}
                                className="px-8 py-4 rounded-2xl bg-white text-primary font-black text-base hover:bg-white/90 hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                                Start Learning Free
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-8 py-4 rounded-2xl bg-white/15 backdrop-blur text-white font-bold text-base border border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300"
                            >
                                Create Account →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Courses;
