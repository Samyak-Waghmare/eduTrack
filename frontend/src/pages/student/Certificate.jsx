import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi"
import { Button } from "@/components/ui/button"
import { Award, ArrowLeft, Download, Loader2, Lock, Sparkles } from "lucide-react"
import { useState } from "react"
import jsPDF from "jspdf"
import { toast } from "sonner"

// Draws the certificate directly onto a jsPDF canvas — zero DOM/CSS reads,
// zero oklch, works 100% reliably.
const drawCertificate = (doc, { studentName, courseTitle, instructor, date, certId }) => {
    const W = 297, H = 210; // A4 landscape mm

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Corner accent — top-left purple
    doc.setFillColor(240, 235, 255);
    doc.circle(-10, -10, 55, "F");

    // Corner accent — bottom-right blue
    doc.setFillColor(230, 245, 255);
    doc.circle(W + 10, H + 10, 55, "F");

    // Outer border
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1.2);
    doc.rect(8, 8, W - 16, H - 16);
    // Inner border (double effect)
    doc.setLineWidth(0.4);
    doc.rect(11, 11, W - 22, H - 22);

    // ── Logo box ──────────────────────────────────────────────
    const cx = W / 2;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(cx - 9, 18, 18, 18, 3, 3, "F");
    // Award icon "★" inside box
    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("✦", cx, 30, { align: "center" });

    // Brand name
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("EduTrack", cx, 43, { align: "center" });

    // ── Certificate of completion ──────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setCharSpace(3.5);
    doc.text("CERTIFICATE OF COMPLETION", cx, 52, { align: "center" });
    doc.setCharSpace(0);

    // ── Presented to ──────────────────────────────────────────
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("This is proudly presented to", cx, 62, { align: "center" });

    // ── Student name ──────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(34);
    doc.setTextColor(15, 23, 42);
    doc.text(studentName, cx, 82, { align: "center" });

    // ── Body text ─────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
        "for successfully demonstrating exceptional skill and completing the online course",
        cx, 93, { align: "center" }
    );

    // ── Course title ──────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(124, 58, 237);
    doc.text(courseTitle, cx, 105, { align: "center", maxWidth: 200 });

    // ── Divider ───────────────────────────────────────────────
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.6);
    doc.line(30, 120, W - 30, 120);

    // ── Footer: Issue Date ────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(date, 65, 134, { align: "center" });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(35, 137, 95, 137);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setCharSpace(2);
    doc.text("ISSUE DATE", 65, 142, { align: "center" });
    doc.setCharSpace(0);

    // ── Footer: Cert ID (center) ──────────────────────────────
    // Seal circle
    doc.setFillColor(254, 243, 199);
    doc.circle(cx, 132, 7, "F");
    doc.setDrawColor(253, 230, 138);
    doc.setLineWidth(0.4);
    doc.circle(cx, 132, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(245, 158, 11);
    doc.text("★", cx, 134.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(certId, cx, 143, { align: "center" });

    // ── Footer: Instructor ────────────────────────────────────
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(instructor, W - 65, 134, { align: "center" });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(W - 95, 137, W - 35, 137);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setCharSpace(2);
    doc.text("LEAD INSTRUCTOR", W - 65, 142, { align: "center" });
    doc.setCharSpace(0);
};

// ─── Main page component ─────────────────────────────────────────────────────
const Certificate = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetCourseProgressQuery(courseId);
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

    const handleDownload = () => {
        setDownloading(true);
        try {
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
            drawCertificate(doc, { studentName, courseTitle, instructor, date, certId });
            doc.save(`${studentName.replace(/\s+/g, "_")}_Certificate.pdf`);
        } catch (e) {
            toast.error("Failed to generate PDF. Please try again.");
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
                    {downloading ? "Generating..." : "Download PDF"}
                </Button>
            </div>

            {/* Visual preview (screen only — pure inline styles, no Tailwind) */}
            <div className="max-w-[900px] mx-auto">
                <div style={{
                    position: "relative", backgroundColor: "#ffffff", color: "#1e293b",
                    overflow: "hidden", aspectRatio: "1.414/1", display: "flex",
                    flexDirection: "column", justifyContent: "center",
                    border: "12px double #0f172a", boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                }}>
                    <div style={{ position:"absolute", top:0, left:0, width:192, height:192, background:"radial-gradient(circle at top left, rgba(124,58,237,0.08), transparent 70%)", pointerEvents:"none" }} />
                    <div style={{ position:"absolute", bottom:0, right:0, width:192, height:192, background:"radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 70%)", pointerEvents:"none" }} />

                    <div style={{ position:"relative", padding:"40px 80px", textAlign:"center" }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginBottom:24 }}>
                            <div style={{ width:64, height:64, borderRadius:16, background:"linear-gradient(135deg, #0f172a, #334155)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.2)", transform:"rotate(3deg)" }}>
                                <Award size={32} color="#f8fafc" />
                            </div>
                            <span style={{ fontWeight:900, fontSize:22, letterSpacing:"-0.05em", color:"#0f172a" }}>EduTrack</span>
                        </div>
                        <p style={{ textTransform:"uppercase", letterSpacing:"0.4em", fontSize:13, color:"#64748b", fontWeight:700, marginBottom:24 }}>Certificate of Completion</p>
                        <p style={{ color:"#475569", fontSize:15, fontStyle:"italic", fontWeight:500 }}>This is proudly presented to</p>
                        <h1 style={{ fontSize:52, fontWeight:900, margin:"16px 0", color:"#0f172a", letterSpacing:"-0.03em", fontFamily:"Georgia, serif" }}>{studentName}</h1>
                        <p style={{ color:"#475569", fontSize:15, maxWidth:560, margin:"12px auto 0", fontWeight:500, lineHeight:1.6 }}>
                            for successfully demonstrating exceptional skill and completing the online course
                        </p>
                        <h2 style={{ fontSize:24, fontWeight:700, marginTop:12, color:"#7c3aed", lineHeight:1.4 }}>{courseTitle}</h2>

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
