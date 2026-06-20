import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi"
import { Button } from "@/components/ui/button"
import { Award, ArrowLeft, Download, Loader2, Lock, Sparkles } from "lucide-react"

const Certificate = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetCourseProgressQuery(courseId);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    const { courseDetails, completed } = data?.data || {};

    if (!completed) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-background">
                <div className="max-w-md w-full text-center bg-card border border-border/60 rounded-3xl p-10 shadow-sm">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-10 w-10 text-muted-foreground/60" />
                    </div>
                    <h1 className="text-2xl font-black text-foreground mb-3">Certificate Locked</h1>
                    <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                        Finish all lectures in <span className="font-bold text-foreground">{courseDetails?.title}</span> to unlock your certificate of completion.
                    </p>
                    <Button onClick={() => navigate(`/course-progress/${courseId}`)} className="w-full btn-primary-gradient text-white font-bold h-12 rounded-xl border-0">
                        Continue Learning
                    </Button>
                </div>
            </div>
        );
    }

    const studentName = user?.name || "Student";
    const courseTitle = courseDetails?.title || "Course";
    const instructor = courseDetails?.creator?.name || "EduTrack Instructor";
    const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    const certId = `EDU-${(courseId || "").slice(-6).toUpperCase()}-${(user?._id || "").slice(-6).toUpperCase()}`;

    return (
        <>
            <style>{`
                @media print {
                    @page { size: A4 landscape; margin: 0; }
                    html, body { margin: 0; padding: 0; }
                    .no-print { display: none !important; }
                    nav, header { display: none !important; }
                }
            `}</style>
            <div className="min-h-[calc(100vh-64px)] bg-background py-10 px-4 print:bg-white print:p-0 print:min-h-0">
                {}
                <div className="no-print max-w-[900px] mx-auto flex items-center justify-between mb-8">
                    <Button variant="outline" onClick={() => navigate(`/course-progress/${courseId}`)} className="gap-2 rounded-xl h-11 font-bold border-border/70 hover:bg-muted/50">
                        <ArrowLeft size={16} /> Back to course
                    </Button>
                    <Button onClick={() => window.print()} className="gap-2 rounded-xl h-11 font-bold btn-primary-gradient text-white border-0 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all">
                        <Download size={16} /> Download PDF
                    </Button>
                </div>

                {}
                <div className="max-w-[900px] mx-auto print:max-w-none print:w-screen print:h-screen print:flex print:items-center print:justify-center">
                    <div className="relative bg-[#ffffff] text-[#1e293b] rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.12)] print:shadow-none overflow-hidden border-[12px] border-double border-[#0f172a] aspect-[1.414/1] flex flex-col justify-center print:border-[16px] print:w-full print:h-full print:aspect-auto">
                        {}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

                        {}
                        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-[#7c3aed]/10 to-transparent rounded-br-[100%]" />
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#0ea5e9]/10 to-transparent rounded-tl-[100%]" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1e293b]/5 to-transparent rounded-bl-[100%]" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1e293b]/5 to-transparent rounded-tr-[100%]" />

                        <div className="relative px-12 py-10 sm:px-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-3 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#334155] flex items-center justify-center shadow-lg transform rotate-3">
                                    <Award size={32} className="text-[#f8fafc]" />
                                </div>
                                <span className="font-black text-2xl tracking-tighter text-[#0f172a]">EduTrack</span>
                            </div>

                            <p className="uppercase tracking-[0.4em] text-sm text-[#64748b] font-bold mb-6">Certificate of Completion</p>

                            <p className="text-[#475569] text-base font-medium italic">This is proudly presented to</p>
                            <h1 className="text-4xl sm:text-6xl font-black my-4 text-[#0f172a] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                                {studentName}
                            </h1>

                            <p className="text-[#475569] text-base max-w-2xl mx-auto font-medium leading-relaxed mt-4">
                                for successfully demonstrating exceptional skill and completing the online course
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-[#7c3aed] leading-tight max-w-3xl mx-auto">
                                {courseTitle}
                            </h2>

                            <div className="flex items-end justify-between mt-12 pt-6 border-t-2 border-[#e2e8f0]">
                                <div className="text-center w-40">
                                    <p className="font-bold text-[#0f172a] text-lg border-b border-[#cbd5e1] pb-2 mb-2">{date}</p>
                                    <p className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">Issue Date</p>
                                </div>

                                <div className="text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2 border border-amber-200">
                                        <Sparkles size={20} className="text-amber-500" />
                                    </div>
                                    <p className="font-mono text-xs text-[#94a3b8] tracking-widest">{certId}</p>
                                </div>

                                <div className="text-center w-40">
                                    <p className="font-[cursive] text-3xl text-[#0f172a] border-b border-[#cbd5e1] pb-2 mb-2 italic" style={{ fontFamily: "'Brush Script MT', cursive" }}>{instructor}</p>
                                    <p className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">Lead Instructor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Certificate;
