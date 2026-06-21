import { Zap, Shield, Trophy, BarChart3, BookOpen, Users, Clock, Star, CheckCircle } from "lucide-react"

const features = [
    {
        icon: BookOpen,
        title: "Expert-Led Courses",
        description: "Learn from industry professionals with real-world experience across 50+ categories.",
        gradient: "from-blue-500 to-cyan-500",
        bg: "from-blue-500/10 to-cyan-500/5",
    },
    {
        icon: Trophy,
        title: "Verified Certificates",
        description: "Earn certificates that are recognized by top employers worldwide to boost your career.",
        gradient: "from-amber-400 to-orange-500",
        bg: "from-amber-500/10 to-orange-500/5",
    },
    {
        icon: Zap,
        title: "Learn at Your Pace",
        description: "Lifetime access to all course materials. Learn anytime, anywhere, on any device.",
        gradient: "from-violet-500 to-purple-600",
        bg: "from-violet-500/10 to-purple-600/5",
    },
    {
        icon: BarChart3,
        title: "Track Your Progress",
        description: "Real-time progress tracking, quizzes, and XP system to keep you motivated.",
        gradient: "from-emerald-500 to-teal-500",
        bg: "from-emerald-500/10 to-teal-500/5",
    },
    {
        icon: Users,
        title: "Community Q&A",
        description: "Ask questions, get answers from instructors and peers in every lecture.",
        gradient: "from-rose-500 to-pink-600",
        bg: "from-rose-500/10 to-pink-500/5",
    },
    {
        icon: Shield,
        title: "Quality Guaranteed",
        description: "Every course is reviewed for quality. Learn with confidence backed by our standards.",
        gradient: "from-sky-500 to-indigo-500",
        bg: "from-sky-500/10 to-indigo-500/5",
    },
]

const FeaturesSection = () => (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
                    <Zap size={13} className="fill-primary" /> Why EduTrack?
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                    Everything you need to
                    <span className="gradient-text"> level up</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    A modern learning platform designed to help you master new skills and advance your career — all in one place.
                </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(({ icon: Icon, title, description, gradient, bg }) => (
                    <div
                        key={title}
                        className={`group relative p-6 rounded-2xl bg-gradient-to-br ${bg} border border-border/60 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300`}
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">{description}</p>
                    </div>
                ))}
            </div>

            {/* Bottom CTA row */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary/8 to-purple-600/8 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-foreground mb-1">Start learning for free today</h3>
                    <p className="text-muted-foreground font-medium">No credit card required. Cancel anytime.</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                    {["500+ courses", "50K+ students", "4.8★ rating", "Certificates"].map(item => (
                        <span key={item} className="flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-emerald-500" /> {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </section>
)

export default FeaturesSection
