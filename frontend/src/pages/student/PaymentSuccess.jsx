import { useEffect, useRef, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { useVerifyPaymentMutation } from "@/features/api/purchaseApi"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, XCircle, Sparkles, ArrowRight, Play } from "lucide-react"

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [status, setStatus] = useState("verifying");
    const [courseId, setCourseId] = useState(null);
    const ranRef = useRef(false);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;
        if (!sessionId) { setStatus("error"); return; }
        (async () => {
            try {
                const res = await verifyPayment(sessionId).unwrap();
                setCourseId(res.courseId);
                setStatus("success");
                setTimeout(() => navigate(`/course-progress/${res.courseId}`), 3000);
            } catch {
                setStatus("error");
            }
        })();
    }, [sessionId, verifyPayment, navigate]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-background">
            <div className="max-w-md w-full text-center">
                {status === "verifying" && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-foreground mb-2">Confirming payment…</h1>
                            <p className="text-muted-foreground font-medium">Hang tight, this only takes a moment.</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 animate-fade-up">
                        {}
                        <div className="relative mx-auto w-24 h-24">
                            <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 animate-ping opacity-30" />
                            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                <CheckCircle2 className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
                                <Sparkles size={12} /> Payment Confirmed
                            </div>
                            <h1 className="text-3xl font-black text-foreground mb-3">You're all set! 🎉</h1>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                You're now enrolled! Redirecting you to your course in a moment…
                            </p>
                        </div>
                        
                        <Button
                            onClick={() => navigate(`/course-progress/${courseId}`)}
                            className="btn-primary-gradient text-white font-bold rounded-xl h-12 px-8 border-0 gap-2"
                        >
                            <Play size={16} className="fill-white" />
                            Start Learning Now
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 animate-fade-up">
                        <div className="w-24 h-24 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                            <XCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-foreground mb-3">Couldn't verify payment</h1>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                If you were charged, the course will appear in My Learning shortly. Otherwise, please try again.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" asChild className="rounded-xl h-11 font-bold border-border/70 hover:border-primary/40 hover:text-primary">
                                <Link to="/my-learning">My Learning</Link>
                            </Button>
                            <Button asChild className="rounded-xl h-11 font-bold btn-primary-gradient border-0 text-white">
                                <Link to="/course/search">Browse Courses</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
