import { useNavigate } from "react-router-dom"
import { GraduationCap, Twitter, Github, Linkedin, Instagram, Mail } from "lucide-react"

const Footer = () => {
    const navigate = useNavigate()

    const links = {
        Platform: [
            { label: "Browse Courses", path: "/course/search" },
            { label: "My Learning", path: "/my-learning" },
            { label: "Leaderboard", path: "/leaderboard" },
            { label: "Become an Instructor", path: "/instructor" },
        ],
        Company: [
            { label: "About Us", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Features", action: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }) },
            { label: "Contact", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
        ],
        Legal: [
            { label: "Privacy Policy" },
            { label: "Terms of Service" },
            { label: "Cookie Policy" },
        ],
    }

    const socials = [
        { icon: Twitter, label: "Twitter", href: "#" },
        { icon: Github, label: "GitHub", href: "https://github.com/Samyak-Waghmare/eduTrack" },
        { icon: Linkedin, label: "LinkedIn", href: "#" },
        { icon: Instagram, label: "Instagram", href: "#" },
    ]

    return (
        <footer className="border-t border-border/60 bg-card/40">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 mb-4 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-primary/30 group-hover:scale-105 transition-all">
                                <GraduationCap size={18} className="text-white" />
                            </div>
                            <span className="font-black text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">EduTrack</span>
                        </button>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xs mb-6">
                            Empowering learners worldwide with expert-led courses, verified certificates, and a vibrant community.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/30 flex items-center justify-center text-muted-foreground transition-all duration-200"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 className="text-xs font-black text-foreground uppercase tracking-widest mb-4">{section}</h4>
                            <ul className="space-y-2.5">
                                {items.map(({ label, path, action }) => (
                                    <li key={label}>
                                        <button
                                            onClick={action || (path ? () => navigate(path) : undefined)}
                                            className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        © {new Date().getFullYear()} EduTrack. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail size={13} />
                        <a href="mailto:hello@edutrack.app" className="hover:text-primary transition-colors font-medium">hello@edutrack.app</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
