import { useParams, useNavigate } from "react-router-dom"
import { useGetCourseProgressQuery, useUpdateLectureProgressMutation, useMarkAsCompletedMutation, useMarkAsInCompletedMutation } from "@/features/api/courseProgressApi"
import { useState, useRef } from "react"
import ReactPlayer from 'react-player'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, CirclePlay, PlayCircle, Trophy, RotateCcw, Menu, X, BookOpen, MessageCircle, BrainCircuit, Star } from "lucide-react"
import { toast } from "sonner"
import CourseQA from "./CourseQA"
import CourseQuiz from "./CourseQuiz"
import CourseNotes from "./CourseNotes"
import CourseReviewModal from "@/components/CourseReviewModal"

const CourseProgress = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetCourseProgressQuery(courseId);
    const [updateProgress] = useUpdateLectureProgressMutation();
    const [markComplete] = useMarkAsCompletedMutation();
    const [markIncomplete] = useMarkAsInCompletedMutation();

    const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const videoRef = useRef(null);

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-background">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground font-medium text-sm">Loading your course...</p>
            </div>
        </div>
    );

    const { courseDetails, progress, completed } = data?.data || {};
    const lectures = courseDetails?.lectures || [];
    const currentLecture = lectures[currentLectureIndex];

    const isViewed = (lectureId) => progress?.some(p => p.lectureId === lectureId && p.viewed);

    const progressPercent = lectures.length > 0
        ? Math.round(((progress || []).filter(p => p.viewed).length / lectures.length) * 100)
        : 0;

    const completedCount = (progress || []).filter(p => p.viewed).length || 0;

    const handleVideoEnd = async () => {
        if (currentLecture) {
            await updateProgress({ courseId, lectureId: currentLecture._id, viewed: true });
            refetch();
        }
    };

    const handleLectureSelect = (index) => {
        setCurrentLectureIndex(index);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    const handleMarkComplete = async () => {
        if (!currentLecture) return;
        await updateProgress({ courseId, lectureId: currentLecture._id, viewed: true });
        refetch();
        toast.success("Lecture marked as complete!");
    };

    const handleMarkIncomplete = async () => {
        await markIncomplete(courseId);
        refetch();
        toast.info("Course marked as in progress");
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <div className="relative bg-black flex-shrink-0" style={{ maxHeight: '65vh' }}>
                    {currentLecture?.videoUrl ? (
                        <div onContextMenu={(e) => e.preventDefault()} className="w-full h-full aspect-video max-h-[65vh]">
                            <ReactPlayer
                                ref={videoRef}
                                url={currentLecture.videoUrl}
                                controls
                                width="100%"
                                height="100%"
                                onEnded={handleVideoEnd}
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: "nodownload"
                                        },
                                        tracks: currentLecture?.subtitleUrl ? [
                                            {
                                                kind: 'subtitles',
                                                src: currentLecture.subtitleUrl,
                                                srcLang: 'en',
                                                label: 'English',
                                                default: true
                                            }
                                        ] : []
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-video max-h-[65vh] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                    <CirclePlay size={36} className="text-white/30" />
                                </div>
                                <div>
                                    <p className="text-white/50 font-semibold">No video for this lecture</p>
                                    <p className="text-white/30 text-sm mt-1">Content may be text-based or coming soon</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden absolute top-3 right-3 w-9 h-9 bg-black/60 backdrop-blur rounded-xl border border-white/15 flex items-center justify-center text-white"
                    >
                        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start h-14 bg-transparent border-b border-border/60 rounded-none p-0 space-x-6 mb-6">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full gap-2 font-bold text-muted-foreground data-[state=active]:text-primary transition-all">
                                    <BookOpen size={16} /> Overview
                                </TabsTrigger>
                                <TabsTrigger value="qa" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full gap-2 font-bold text-muted-foreground data-[state=active]:text-primary transition-all">
                                    <MessageCircle size={16} /> Q&A
                                </TabsTrigger>
                                <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full gap-2 font-bold text-muted-foreground data-[state=active]:text-primary transition-all">
                                    <BookOpen size={16} /> Notes
                                </TabsTrigger>
                                <TabsTrigger value="quiz" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full gap-2 font-bold text-muted-foreground data-[state=active]:text-primary transition-all">
                                    <BrainCircuit size={16} /> Interactive Quiz
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-0 outline-none">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Lecture {currentLectureIndex + 1} of {lectures.length}
                                            </span>
                                            {isViewed(currentLecture?._id) && (
                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <CheckCircle size={10} /> Watched
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-black text-foreground">{currentLecture?.lectureTitle}</h1>
                                        <p className="text-base text-muted-foreground mt-2 font-medium">{courseDetails?.title}</p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap sm:flex-nowrap shrink-0">
                                        <Button
                                            size="sm"
                                            onClick={() => setIsReviewModalOpen(true)}
                                            variant="outline"
                                            className="gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10 rounded-xl font-bold h-10 px-4"
                                        >
                                            <Star size={16} className="fill-amber-500 text-amber-500" /> Review
                                        </Button>
                                        
                                        {completed ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => navigate(`/certificate/${courseId}`)}
                                                    className="gap-1.5 btn-primary-gradient text-white border-0 rounded-xl font-bold h-10 px-4"
                                                >
                                                    <Trophy size={16} /> Certificate
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleMarkIncomplete}
                                                    variant="outline"
                                                    className="gap-1.5 text-muted-foreground rounded-xl font-semibold h-10 px-4 hover:bg-muted"
                                                >
                                                    <RotateCcw size={16} /> Reset
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={handleMarkComplete}
                                                disabled={isViewed(currentLecture?._id)}
                                                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 px-4 border-0 disabled:opacity-50"
                                            >
                                                <CheckCircle size={16} />
                                                {isViewed(currentLecture?._id) ? "Completed" : "Mark Complete"}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-muted/20 border border-border/60 rounded-2xl mb-8">
                                    <h3 className="font-bold text-foreground mb-2">About this lecture</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {currentLecture?.description || `Watch the full video for "${currentLecture?.lectureTitle}" and feel free to ask questions in the Q&A tab if you get stuck. After finishing, test your knowledge in the Interactive Quiz tab.`}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        disabled={currentLectureIndex === 0}
                                        onClick={() => handleLectureSelect(currentLectureIndex - 1)}
                                        className="gap-2 rounded-xl h-11 px-6 font-semibold border-border/70 hover:bg-primary/10 hover:text-primary hover:border-primary/30 disabled:opacity-40 transition-all"
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={currentLectureIndex === lectures.length - 1}
                                        onClick={() => handleLectureSelect(currentLectureIndex + 1)}
                                        className="gap-2 rounded-xl h-11 px-6 font-semibold border-border/70 hover:bg-primary/10 hover:text-primary hover:border-primary/30 disabled:opacity-40 transition-all"
                                    >
                                        Next <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="qa" className="mt-0 outline-none">
                                {currentLecture && <CourseQA courseId={courseId} lectureId={currentLecture._id} />}
                            </TabsContent>

                            <TabsContent value="notes" className="mt-0 outline-none">
                                {currentLecture && <CourseNotes courseId={courseId} lectureId={currentLecture._id} videoRef={videoRef} />}
                            </TabsContent>

                            <TabsContent value="quiz" className="mt-0 outline-none">
                                {currentLecture && <CourseQuiz courseId={courseId} lectureId={currentLecture._id} />}
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>

            <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-80 lg:w-96 border-l border-border/60 flex-col overflow-hidden bg-card`}>
                <div className="p-5 border-b border-border/60 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-black text-sm text-foreground">Course Progress</h2>
                        <span className="text-sm font-black text-primary">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2.5 rounded-full" />
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">
                        {completedCount} / {lectures.length} lectures completed
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {lectures.map((lecture, idx) => {
                        const viewed = isViewed(lecture._id);
                        const isCurrent = idx === currentLectureIndex;
                        return (
                            <button
                                key={lecture._id}
                                onClick={() => handleLectureSelect(idx)}
                                className={`w-full text-left px-5 py-4 flex items-start gap-3.5 border-b border-border/40 transition-all duration-200 ${
                                    isCurrent
                                        ? 'bg-primary/8 border-l-2 border-l-primary'
                                        : 'hover:bg-muted/50'
                                }`}
                            >
                                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    viewed
                                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                                        : isCurrent
                                            ? 'bg-primary shadow-sm shadow-primary/30'
                                            : 'bg-muted border border-border'
                                }`}>
                                    {viewed ? (
                                        <CheckCircle size={13} className="text-white" />
                                    ) : (
                                        <PlayCircle size={13} className={isCurrent ? 'text-white' : 'text-muted-foreground'} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-snug font-semibold ${
                                        isCurrent ? 'text-primary' : viewed ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                        {idx + 1}. {lecture.lectureTitle}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {completed && (
                    <div className="p-5 border-t border-border/60 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-3">
                            <Trophy size={18} />
                            <span className="font-black text-sm">Course Completed! 🎉</span>
                        </div>
                        <Button
                            onClick={() => navigate(`/certificate/${courseId}`)}
                            className="w-full gap-2 btn-primary-gradient text-white font-bold rounded-xl border-0"
                        >
                            <Award size={16} /> View Certificate
                        </Button>
                    </div>
                )}
            </div>

            <CourseReviewModal 
                courseId={courseId} 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
            />
        </div>
    )
}

export default CourseProgress;
