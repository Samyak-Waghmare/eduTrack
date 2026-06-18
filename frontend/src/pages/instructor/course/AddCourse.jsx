import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateCourseMutation } from "@/features/api/courseApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles, BookOpen } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES = [
    "Web Development", "Python", "Machine Learning", "Data Science",
    "UI/UX Design", "Mobile Development", "DevOps", "JavaScript",
    "React", "Node.js", "Database", "Cybersecurity", "Cloud Computing", "Other"
];

const AddCourse = () => {
    const navigate = useNavigate();
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    const handleCreate = async () => {
        if (!title.trim() || !category) {
            toast.error("Title and category are required");
            return;
        }
        try {
            const result = await createCourse({ title, category }).unwrap();
            toast.success("Course created! Now add details.");
            navigate(`/instructor/course/${result.course._id}`);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create course");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background relative overflow-hidden flex flex-col justify-center py-10">
            {}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            
            <div className="max-w-2xl w-full mx-auto px-6 relative z-10 animate-fade-up">
                <Button variant="ghost" onClick={() => navigate("/instructor/course")} className="mb-6 gap-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl">
                    <ArrowLeft size={16} />Back to Dashboard
                </Button>

                <Card className="border border-border/60 shadow-2xl rounded-[2rem] bg-card/60 backdrop-blur-xl overflow-hidden">
                    <div className="h-2 w-full bg-gradient-to-r from-primary to-purple-500" />
                    <CardHeader className="pb-6 pt-8 px-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <BookOpen size={28} className="text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black text-foreground tracking-tight">Create New Course</CardTitle>
                        <CardDescription className="text-base font-medium mt-2">Start by giving your course a title and category. You can add full details, curriculum, and pricing on the next screen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8">
                        <div className="space-y-3 group">
                            <Label htmlFor="course-title" className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Course Title *</Label>
                            <Input
                                id="course-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. The Complete 2026 Web Development Bootcamp"
                                className="h-14 px-4 text-base rounded-xl bg-background border-border/60 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-3 group">
                            <Label htmlFor="course-category" className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Category *</Label>
                            <div className="relative">
                                <select
                                    id="course-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-14 px-4 rounded-xl border border-border/60 bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-4 gap-4 flex-col sm:flex-row">
                        <Button variant="outline" className="w-full sm:w-1/3 h-14 rounded-xl font-bold border-border/60 hover:bg-muted" onClick={() => navigate("/instructor/course")}>Cancel</Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleCreate}
                            className="w-full sm:w-2/3 h-14 rounded-xl btn-primary-gradient text-white font-bold text-base shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating Sandbox...</>
                            ) : (
                                <><Sparkles className="mr-2 h-5 w-5" />Start Building</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default AddCourse;
