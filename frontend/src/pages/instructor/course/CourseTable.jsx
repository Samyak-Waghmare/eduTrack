import { useGetCreatorCoursesQuery, usePublishCourseMutation } from "@/features/api/courseApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Edit, Plus, Eye, EyeOff, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const CourseTable = () => {
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetCreatorCoursesQuery();
    const [publishCourse, { isLoading: publishing }] = usePublishCourseMutation();

    const handlePublishToggle = async (courseId, isPublished) => {
        try {
            await publishCourse({ courseId, query: isPublished ? "false" : "true" });
            refetch();
            toast.success(isPublished ? "Course unpublished" : "Course published!");
        } catch {
            toast.error("Failed to toggle publish status");
        }
    };

    if (isLoading) return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="w-48 h-8 bg-muted animate-pulse rounded-lg" />
                <div className="w-32 h-10 bg-muted animate-pulse rounded-xl" />
            </div>
            <div className="h-[400px] bg-muted animate-pulse rounded-2xl" />
        </div>
    );

    const courses = data?.courses || [];

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BookOpen size={20} className="text-primary" />
                        </div>
                        My Courses
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">{courses.length} course{courses.length !== 1 ? "s" : ""} in your portfolio</p>
                </div>
                <Button onClick={() => navigate("/instructor/course/create")} className="btn-primary-gradient text-white gap-2 font-bold h-11 px-6 rounded-xl border-0 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                    <Plus size={16} />Create Course
                </Button>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-28 border-2 border-dashed border-border/60 bg-card/50 backdrop-blur-sm rounded-3xl">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
                        <BookOpen size={36} className="text-muted-foreground/50" />
                    </div>
                    <h3 className="font-black text-2xl mb-2 text-foreground">No courses yet</h3>
                    <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto">Create your first course and start sharing your knowledge with the world!</p>
                    <Button onClick={() => navigate("/instructor/course/create")} className="btn-primary-gradient text-white font-bold h-12 px-8 rounded-xl border-0">
                        <Plus size={16} className="mr-2" />Create First Course
                    </Button>
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/30">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Course</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Students</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {courses.map((course, idx) => (
                                    <tr key={course._id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 overflow-hidden flex-shrink-0 shadow-sm border border-border/50">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <BookOpen size={16} className="text-primary/40" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground text-sm line-clamp-1">{course.title}</p>
                                                    <p className="text-xs text-muted-foreground font-medium mt-1">{course.level || "Beginner"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-foreground bg-muted px-2.5 py-1 rounded-md">{course.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-foreground">{course.enrolledStudents?.length || 0}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                                {course.price ? `₹${course.price}` : "Free"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className={`px-2.5 py-1 rounded-full text-xs font-bold ${course.isPublished ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"}`}>
                                                {course.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => navigate(`/instructor/course/${course._id}`)} className="h-9 px-3 gap-1.5 rounded-lg border-border/60 hover:bg-muted font-bold text-xs">
                                                    <Edit size={14} />Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={publishing}
                                                    onClick={() => handlePublishToggle(course._id, course.isPublished)}
                                                    className={`h-9 px-3 gap-1.5 rounded-lg font-bold text-xs ${course.isPublished ? 'border-amber-500/30 text-amber-600 hover:bg-amber-500/10' : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'}`}
                                                >
                                                    {publishing ? <Loader2 size={14} className="animate-spin" /> : course.isPublished ? <><EyeOff size={14} />Unpublish</> : <><Eye size={14} />Publish</>}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseTable;
