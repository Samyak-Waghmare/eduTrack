import { GraduationCap, Target, Heart, Globe } from "lucide-react"

const milestones = [
    { year: "2022", title: "EduTrack Founded", desc: "Started with a mission to democratize quality education worldwide." },
    { year: "2023", title: "10,000 Students", desc: "Reached our first major milestone with learners across 30+ countries." },
    { year: "2024", title: "500+ Courses", desc: "Expanded our catalog with expert instructors from top companies." },
    { year: "2025", title: "50K+ Graduates", desc: "Celebrating 50,000+ learners who transformed their careers." },
]

const values = [
    { icon: Target, title: "Mission-Driven", desc: "Every feature we build is focused on student outcomes, not vanity metrics.", color: "text-violet-500" },
    { icon: Heart, title: "Student First", desc: "We listen to our learners. Our roadmap is shaped by real student feedback.", color: "text-rose-500" },
    { icon: Globe, title: "Accessible", desc: "Quality education should have no barriers — of geography, cost, or background.", color: "text-sky-500" },
    { icon: GraduationCap, title: "Excellence", desc: "We partner only with instructors who can demonstrate mastery and teaching skill.", color: "text-amber-500" },
]

const AboutSection = () => (
    <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
                    <GraduationCap size={13} /> Our Story
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                    Built by learners,
                    <span className="gradient-text"> for learners</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    EduTrack was born from a simple frustration — online learning felt disconnected and unmotivating. We set out to build something better.
                </p>
            </div>

            {/* Two-col: story + values */}
            <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
                {/* Story */}
                <div>
                    <h3 className="text-2xl font-black text-foreground mb-4">What we stand for</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 font-medium">
                        EduTrack is a modern learning management system designed to help students master skills that matter. We believe the best learning happens when content is engaging, progress is visible, and community is at the center.
                    </p>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        From interactive quizzes and Q&A sections to gamified XP leaderboards and verified certificates, every feature is designed to keep you motivated from first lesson to graduation.
                    </p>

                    {/* Values grid */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {values.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-colors">
                                <Icon className={`w-5 h-5 ${color} mb-2`} />
                                <p className="font-bold text-sm text-foreground mb-1">{title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
                    <div className="space-y-8">
                        {milestones.map(({ year, title, desc }, i) => (
                            <div key={year} className="flex gap-6 group">
                                <div className="relative flex-shrink-0 w-12 flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all mt-1 z-10" />
                                </div>
                                <div className="pb-2">
                                    <span className="text-xs font-black text-primary uppercase tracking-widest">{year}</span>
                                    <h4 className="font-bold text-foreground mt-0.5">{title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { value: "50K+", label: "Active Students" },
                    { value: "500+", label: "Expert Courses" },
                    { value: "200+", label: "Instructors" },
                    { value: "30+", label: "Countries" },
                ].map(({ value, label }) => (
                    <div key={label} className="p-6 rounded-2xl bg-gradient-to-br from-primary/8 to-purple-600/5 border border-primary/20 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-3xl font-black text-foreground mb-1">{value}</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

export default AboutSection
