import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi"
import { Button } from "@/components/ui/button"
import { Award, ArrowLeft, Download, Loader2, Lock, Sparkles } from "lucide-react"
import { useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const Certificate = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetCourseProgressQuery(courseId);
    const certRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

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
    const date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    const certId = `EDU-${(courseId || "").slice(-6).toUpperCase()}-${(user?._id || "").slice(-6).toUpperCase()}`;

    const handleDownload = async () => {
        if (!certRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    // Strip all stylesheets — Tailwind uses oklch which html2canvas can't parse.
                    // The certificate uses only inline styles so removing global CSS has no effect.
                    clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove());
                    clonedDoc.documentElement.style.background = "#ffffff";
                    clonedDoc.body.style.background = "#ffffff";
                },
            });

            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            // A4 landscape dimensions in mm
            const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
            pdf.save(`${studentName.replace(/\s+/g, "_")}_Certificate.pdf`);
        } catch (e) {
            console.error("PDF generation failed", e);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background py-10 px-4">
            {/* Controls */}
            <div className="max-w-[900px] mx-auto flex items-center justify-between mb-8">
                <Button variant="outline" onClick={() => navigate(`/course-progress/${courseId}`)} className="gap-2 rounded-xl h-11 font-bold border-border/70 hover:bg-muted/50">
                    <ArrowLeft size={16} /> Back to course
                </Button>
                <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="gap-2 rounded-xl h-11 font-bold btn-primary-gradient text-white border-0 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {downloading ? "Generating PDF..." : "Download PDF"}
                </Button>
            </div>

            {/* Certificate — this div is captured as image */}
            <div className="max-w-[900px] mx-auto">
                <div
                    ref={certRef}
                    style={{
                        position: "relative",
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        overflow: "hidden",
                        aspectRatio: "1.414/1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        border: "12px double #0f172a",
                    }}
                >
                    {/* Corner accents using inline rgba to avoid oklch */}
                    <div style={{ position:"absolute", top:0, left:0, width:192, height:192, background:"radial-gradient(circle at top left, rgba(124,58,237,0.08), transparent 70%)", pointerEvents:"none" }} />
                    <div style={{ position:"absolute", bottom:0, right:0, width:192, height:192, background:"radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 70%)", pointerEvents:"none" }} />

                    <div style={{ position:"relative", padding:"40px 80px", textAlign:"center" }}>
                        {/* Logo */}
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginBottom:24 }}>
                            <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg, #0f172a, #334155)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.2)", transform:"rotate(3deg)" }}>
                                <Award size={32} color="#f8fafc" />
                            </div>
                            <span style={{ fontWeight:900, fontSize:22, letterSpacing:"-0.05em", color:"#0f172a" }}>EduTrack</span>
                        </div>

                        <p style={{ textTransform:"uppercase", letterSpacing:"0.4em", fontSize:13, color:"#64748b", fontWeight:700, marginBottom:24 }}>Certificate of Completion</p>

                        <p style={{ color:"#475569", fontSize:15, fontStyle:"italic", fontWeight:500 }}>This is proudly presented to</p>
                        <h1 style={{ fontSize:52, fontWeight:900, margin:"16px 0", color:"#0f172a", letterSpacing:"-0.03em", fontFamily:"Georgia, serif" }}>
                            {studentName}
                        </h1>

                        <p style={{ color:"#475569", fontSize:15, maxWidth:560, margin:"12px auto 0", fontWeight:500, lineHeight:1.6 }}>
                            for successfully demonstrating exceptional skill and completing the online course
                        </p>
                        <h2 style={{ fontSize:24, fontWeight:700, marginTop:12, color:"#7c3aed", lineHeight:1.4 }}>
                            {courseTitle}
                        </h2>

                        {/* Footer */}
                        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:40, paddingTop:24, borderTop:"2px solid #e2e8f0" }}>
                            <div style={{ textAlign:"center", width:160 }}>
                                <p style={{ fontWeight:700, color:"#0f172a", fontSize:17, borderBottom:"1px solid #cbd5e1", paddingBottom:8, marginBottom:8 }}>{date}</p>
                                <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:700 }}>Issue Date</p>
                            </div>

                            <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
                                <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8, border:"1px solid #fde68a" }}>
                                    <Sparkles size={20} color="#f59e0b" />
                                </div>
                                <p style={{ fontFamily:"monospace", fontSize:11, color:"#94a3b8", letterSpacing:"0.1em" }}>{certId}</p>
                            </div>

                            <div style={{ textAlign:"center", width:160 }}>
                                <p style={{ fontSize:30, color:"#0f172a", borderBottom:"1px solid #cbd5e1", paddingBottom:8, marginBottom:8, fontStyle:"italic", fontFamily:"'Brush Script MT', cursive" }}>{instructor}</p>
                                <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:700 }}>Lead Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
