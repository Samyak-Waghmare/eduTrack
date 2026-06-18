import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, BookOpen, Users, Star, Play, ArrowRight, Sparkles, Zap, Trophy } from "lucide-react"

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const stats = [
        { icon: BookOpen, value: "500+", label: "Courses", color: "from-blue-500 to-cyan-500" },
        { icon: Users, value: "50K+", label: "Students", color: "from-violet-500 to-purple-600" },
        { icon: Star, value: "4.8", label: "Rating", color: "from-amber-400 to-orange-500" },
        { icon: Trophy, value: "10K+", label: "Certificates", color: "from-emerald-500 to-teal-500" },
    ];

    const categories = [
        { name: "Web Dev", icon: "💻" },
        { name: "Python", icon: "🐍" },
        { name: "UI/UX", icon: "🎨" },
        { name: "Data Science", icon: "📊" },
        { name: "Mobile Dev", icon: "📱" },
        { name: "Machine Learning", icon: "🤖" },
    ];

    return (
        <section className="relative overflow-hidden min-h-[88vh] flex items-center">
            {}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-purple-600/[0.07]" />
            </div>

            {}
            <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px] animate-blob pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[120px] animate-blob [animation-delay:3s] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] animate-blob [animation-delay:6s] pointer-events-none" />

            {}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(120,80,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,80,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {}
            <div className="relative w-full max-w-[1100px] mx-auto px-6 py-24 flex flex-col items-center text-center z-10">
                
                {}
                <div className="animate-fade-up mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm hover:bg-primary/15 transition-colors cursor-default">
                        <Sparkles size={14} className="animate-pulse" />
                        New courses added every week
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                {}
                <div className="animate-fade-up [animation-delay:100ms] space-y-4 max-w-[900px]">
                    <h1 className="text-[clamp(2.8rem,7.5vw,5.5rem)] font-black tracking-tight leading-[1.05] text-foreground">
                        Learn Skills That
                        <span className="block gradient-text pb-3 mt-1">
                            Shape Your Future
                        </span>
                    </h1>
                    <p className="text-[clamp(1rem,2vw,1.25rem)] text-muted-foreground max-w-[600px] mx-auto leading-relaxed font-medium">
                        Master in-demand skills with expert-led courses. Join 50,000+ learners already transforming their careers.
                    </p>
                </div>

                {}
                <form
                    onSubmit={handleSearch}
                    className="animate-fade-up [animation-delay:200ms] w-full max-w-[680px] mt-10"
                >
                    <div className="flex gap-3 p-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:border-primary/30 transition-all duration-300">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What do you want to learn?"
                                className="w-full h-12 pl-12 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none text-[15px] font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-12 px-7 rounded-xl btn-primary-gradient text-white font-bold text-[15px] border-0 shrink-0 flex items-center gap-2"
                        >
                            Search
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>

                {}
                <div className="animate-fade-up [animation-delay:300ms] flex flex-wrap justify-center gap-2.5 mt-7">
                    <span className="text-sm text-muted-foreground font-medium mr-1">Popular:</span>
                    {categories.map((cat, index) => (
                        <button
                            key={cat.name}
                            onClick={() => navigate(`/course/search?query=${cat.name}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border/60 text-foreground/80 text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:-translate-y-0.5 shadow-sm"
                            style={{ animationDelay: `${350 + index * 60}ms` }}
                        >
                            <span className="text-base">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {}
                <div className="animate-fade-up [animation-delay:500ms] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[820px] w-full mt-16">
                    {stats.map(({ icon: Icon, value, label, color }, index) => (
                        <div
                            key={label}
                            className="group relative bg-card/60 backdrop-blur-xl border border-border/60 rounded-2xl p-5 text-center hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-all duration-400 card-hover"
                            style={{ animationDelay: `${550 + index * 80}ms` }}
                        >
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-[2.2rem] font-black leading-none text-foreground tracking-tight">{value}</div>
                            <div className="text-[12px] text-muted-foreground mt-1.5 font-semibold uppercase tracking-widest">{label}</div>
                        </div>
                    ))}
                </div>

                {}
                <div className="animate-fade-up [animation-delay:700ms] mt-10 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {['🧑‍💻', '👩‍🎨', '🧑‍🔬', '👩‍💼', '🧑‍🏫'].map((emoji, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-background flex items-center justify-center text-sm">
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        <span className="font-bold text-foreground">2,400+</span> learners joined this week
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
