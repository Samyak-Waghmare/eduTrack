import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save, Eye, EyeOff, BookOpen, List, Upload, X, CheckCircle, Sparkles } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES = [
    "Web Development", "Python", "Machine Learning", "Data Science",
    "UI/UX Design", "Mobile Development", "DevOps", "JavaScript",
    "React", "Node.js", "Database", "Cybersecurity", "Cloud Computing", "Other"
];

const LEVELS = ["Beginner", "Medium", "Advance"];

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: fetching } = useGetCourseByIdQuery(courseId);
    const [editCourse, { isLoading: saving }] = useEditCourseMutation();
    const [publishCourse, { isLoading: publishing }] = usePublishCourseMutation();

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const fileRef = useRef(null);

    const course = data?.course;

    useEffect(() => {
        if (course) {
            setTitle(course.title || "");
            setSubTitle(course.subTitle || "");
            setDescription(course.description || "");
            setCategory(course.category || "");
            setLevel(course.level || "Beginner");
            setPrice(course.price || "");
            setThumbnailPreview(course.thumbnail || "");
        }
    }, [course]);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("subTitle", subTitle);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("level", level);
        formData.append("price", price ? Number(price) : 0);
        if (thumbnail) formData.append("courseThumbnail", thumbnail);

        try {
            await editCourse({ formData, courseId }).unwrap();
            toast.success("Course saved successfully!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to save course");
        }
    };

    const handlePublishToggle = async () => {
        try {
            await publishCourse({ courseId, query: course?.isPublished ? "false" : "true" }).unwrap();
            toast.success(course?.isPublished ? "Course unpublished" : "Course published!");
        } catch {
            toast.error("Failed to toggle publish status");
        }
    };

    if (fetching) return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-bold tracking-wide">Loading course details...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background pb-16">
            {}
            <div className="bg-gradient-to-br from-primary/10 via-background to-purple-600/5 border-b border-border/60 mb-10 pt-10 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
                    <div>
                        <Button variant="ghost" onClick={() => navigate("/instructor/course")} className="mb-4 gap-2 text-muted-foreground hover:bg-muted/50 rounded-xl">
                            <ArrowLeft size={16} />Back to Dashboard
                        </Button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Edit Course</h1>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${course?.isPublished ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/60"}`}>
                                {course?.isPublished ? <><CheckCircle size={12} /> Published</> : "Draft"}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" onClick={() => navigate(`/instructor/course/${courseId}/lecture`)} className="gap-2 h-11 rounded-xl font-bold bg-background/50 backdrop-blur-sm border-border/60">
                            <List size={16} className="text-primary" />Lectures
                        </Button>
                        <Button variant="outline" disabled={publishing} onClick={handlePublishToggle} className={`gap-2 h-11 rounded-xl font-bold backdrop-blur-sm border-border/60 ${course?.isPublished ? "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" : "hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30"}`}>
                            {publishing ? <Loader2 size={16} className="animate-spin" /> : course?.isPublished ? <><EyeOff size={16} />Unpublish</> : <><Eye size={16} />Publish</>}
                        </Button>
                        <Button disabled={saving} onClick={handleSave} className="gap-2 h-11 px-6 rounded-xl btn-primary-gradient text-white font-bold border-0 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                            {saving ? <><Loader2 size={16} className="animate-spin" />Saving...</> : <><Save size={16} />Save Changes</>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                {}
                <div className="md:col-span-2 space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                    <Card className="border border-border/60 shadow-xl rounded-3xl bg-card/60 backdrop-blur-xl overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        <CardHeader className="pb-4 pt-6 px-8 border-b border-border/40">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <Sparkles size={20} className="text-primary" /> Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8">
                            <div className="space-y-3 group">
                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Course Title *</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" className="h-12 px-4 rounded-xl bg-background border-border/60 focus-visible:ring-primary focus-visible:border-primary shadow-sm" />
                            </div>
                            <div className="space-y-3 group">
                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Subtitle</Label>
                                <Input value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="A catchy short description" className="h-12 px-4 rounded-xl bg-background border-border/60 focus-visible:ring-primary focus-visible:border-primary shadow-sm" />
                            </div>
                            <div className="space-y-3 group">
                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Description</Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Detailed course description..."
                                    rows={6}
                                    className="w-full px-4 py-4 rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none shadow-sm transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3 group">
                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Category *</Label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer shadow-sm"
                                        >
                                            <option value="" disabled>Select category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 group">
                                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Level</Label>
                                    <div className="relative">
                                        <select
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer shadow-sm"
                                        >
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 group">
                                <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider group-focus-within:text-primary transition-colors">Price (₹)</Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</div>
                                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" className="h-12 pl-8 rounded-xl bg-background border-border/60 focus-visible:ring-primary focus-visible:border-primary shadow-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {}
                <div className="space-y-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
                    <Card className="border border-border/60 shadow-xl rounded-3xl bg-card overflow-hidden">
                        <CardHeader className="pb-4 pt-6 px-6 border-b border-border/40">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Upload size={18} className="text-primary" /> Thumbnail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div
                                className="aspect-[16/10] rounded-2xl overflow-hidden bg-muted/30 border-2 border-dashed border-border/60 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all relative group flex flex-col items-center justify-center"
                                onClick={() => fileRef.current?.click()}
                            >
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                            <Upload size={24} className="mb-2" />
                                            <span className="font-bold">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-background border border-border/60 flex items-center justify-center shadow-sm">
                                            <Upload size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-foreground">Click to upload</p>
                                            <p className="text-xs mt-1">Recommended: 16:9 ratio</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                            {thumbnail && (
                                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 w-full rounded-xl font-bold" onClick={() => { setThumbnail(null); setThumbnailPreview(course?.thumbnail || ""); }}>
                                    <X size={14} />Remove Custom Image
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border border-border/60 shadow-xl rounded-3xl bg-card overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <List size={18} className="text-primary" />
                                    </div>
                                    <span className="font-bold text-foreground">Lectures</span>
                                </div>
                                <span className="font-black text-xl">{course?.lectures?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <BookOpen size={18} className="text-purple-600" />
                                    </div>
                                    <span className="font-bold text-foreground">Students</span>
                                </div>
                                <span className="font-black text-xl">{course?.enrolledStudents?.length || 0}</span>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline" className="w-full gap-2 h-12 rounded-xl font-bold border-border/60 hover:bg-muted" onClick={() => navigate(`/instructor/course/${courseId}/lecture`)}>
                                    Manage Curriculum
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EditCourse;
