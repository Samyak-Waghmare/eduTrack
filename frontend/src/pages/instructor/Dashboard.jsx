import { useGetCreatorCoursesQuery } from "@/features/api/courseApi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, BookOpen, GraduationCap, IndianRupee, Plus, Users, Sparkles } from "lucide-react"

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { data } = useGetCreatorCoursesQuery();

    const courses = data?.courses || [];
    const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
    const totalRevenue = courses.reduce((sum, c) => sum + ((c.enrolledStudents?.length || 0) * (c.price || 0)), 0);
    const publishedCourses = courses.filter(c => c.isPublished).length;

    const chartCourses = [...courses]
        .sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0))
        .slice(0, 5);
    const maxEnroll = Math.max(1, ...chartCourses.map(c => c.enrolledStudents?.length || 0));

    const stats = [
        { label: "Total Courses", value: courses.length, icon: BookOpen, color: "from-blue-600 to-indigo-600", bg: "bg-blue-500/10 text-blue-600" },
        { label: "Published", value: publishedCourses, icon: GraduationCap, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10 text-emerald-600" },
        { label: "Total Students", value: totalStudents, icon: Users, color: "from-purple-600 to-fuchsia-600", bg: "bg-purple-500/10 text-purple-600" },
        { label: "Revenue (est.)", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10 text-amber-600" }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background">
            {}
            <div className="relative bg-gradient-to-br from-primary/10 via-background to-purple-600/5 border-b border-border/60 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-3">
                            <Sparkles size={12} /> Instructor Hub
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            Welcome back, <span className="gradient-text">{user?.name}</span> 👋
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Here's what's happening with your courses today.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate("/instructor/analytics")} className="h-12 px-6 rounded-2xl font-bold border-border/70 shadow-sm hover:-translate-y-0.5 transition-all bg-background text-foreground hover:bg-muted">
                            <BarChart3 size={18} className="mr-2 text-primary" />Analytics
                        </Button>
                        <Button onClick={() => navigate("/instructor/course")} className="h-12 px-6 rounded-2xl btn-primary-gradient text-white font-bold border-0 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                            <Plus size={18} className="mr-2" />Manage Courses
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
                        <Card key={label} className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden bg-card animate-fade-up group hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold tracking-wider uppercase text-muted-foreground">{label}</span>
                                    <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                                <p className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br ${color}`}>{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {}
                    {chartCourses.length > 0 && (
                        <Card className="lg:col-span-2 border border-border/60 shadow-sm rounded-3xl bg-card overflow-hidden animate-fade-up" style={{ animationDelay: '400ms' }}>
                            <div className="px-6 py-5 border-b border-border/60 bg-muted/20">
                                <h2 className="font-black text-lg flex items-center gap-2 text-foreground">
                                    <BarChart3 size={20} className="text-primary" />Enrollments Overview
                                </h2>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {chartCourses.map(course => {
                                        const count = course.enrolledStudents?.length || 0;
                                        return (
                                            <div key={course._id} className="group">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="font-bold text-foreground truncate pr-3 group-hover:text-primary transition-colors">{course.title}</span>
                                                    <span className="font-black text-muted-foreground shrink-0">{count} students</span>
                                                </div>
                                                <div className="h-3 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 relative overflow-hidden"
                                                        style={{ width: `${(count / maxEnroll) * 100}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {}
                    <Card className={`border border-border/60 shadow-sm rounded-3xl bg-card overflow-hidden animate-fade-up ${chartCourses.length === 0 ? 'lg:col-span-3' : ''}`} style={{ animationDelay: '500ms' }}>
                        <div className="px-6 py-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                            <h2 className="font-black text-lg flex items-center gap-2 text-foreground">
                                <BookOpen size={20} className="text-primary" />Top Courses
                            </h2>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/instructor/course")} className="font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                                View All
                            </Button>
                        </div>
                        <CardContent className="p-0">
                            {courses.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground px-6">
                                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                                        <BookOpen size={28} className="text-muted-foreground/50" />
                                    </div>
                                    <p className="font-black text-xl text-foreground mb-2">No courses yet</p>
                                    <p className="text-sm font-medium mb-6">Create your first course to start earning!</p>
                                    <Button className="h-11 rounded-xl btn-primary-gradient text-white font-bold border-0" onClick={() => navigate("/instructor/course/create")}>
                                        <Plus size={16} className="mr-2" />Create Course
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {courses.slice(0, 5).map(course => (
                                        <div
                                            key={course._id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/30 cursor-pointer transition-colors group"
                                            onClick={() => navigate(`/instructor/course/${course._id}`)}
                                        >
                                            <div className="w-full sm:w-24 aspect-video sm:h-16 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 overflow-hidden flex-shrink-0 relative">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen size={20} className="text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{course.title}</p>
                                                <p className="text-xs font-medium text-muted-foreground mt-1">{course.category}</p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${course.isPublished ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/60"}`}>
                                                    {course.isPublished ? "Published" : "Draft"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
