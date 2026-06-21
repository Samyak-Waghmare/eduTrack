import { useState } from "react"
import { Mail, MessageSquare, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const ContactSection = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app, this would POST to the backend
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
        setForm({ name: "", email: "", subject: "", message: "" })
    }

    return (
        <section id="contact" className="py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/[0.03] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
                        <Mail size={13} /> Get in Touch
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                        We'd love to
                        <span className="gradient-text"> hear from you</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        Have a question, feedback, or want to partner with us? Send us a message and we'll get back to you within 24 hours.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Contact info */}
                    <div className="lg:col-span-2 space-y-6">
                        {[
                            { icon: Mail, title: "Email Us", value: "hello@edutrack.app", sub: "We reply within 24 hours", color: "text-violet-500", bg: "bg-violet-500/10" },
                            { icon: MessageSquare, title: "Live Chat", value: "Available 9am – 6pm IST", sub: "Mon – Fri (weekdays)", color: "text-sky-500", bg: "bg-sky-500/10" },
                            { icon: MapPin, title: "Location", value: "Pune, Maharashtra", sub: "India 🇮🇳", color: "text-rose-500", bg: "bg-rose-500/10" },
                            { icon: Phone, title: "Phone", value: "+91 98765 43210", sub: "Call or WhatsApp", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        ].map(({ icon: Icon, title, value, sub, color, bg }) => (
                            <div key={title} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-colors group">
                                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{title}</p>
                                    <p className="font-bold text-foreground text-sm">{value}</p>
                                    <p className="text-xs text-muted-foreground">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-foreground">Message sent!</h3>
                                <p className="text-muted-foreground font-medium">Thanks for reaching out. We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-black text-foreground mb-6">Send a message</h3>
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Name</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder="Your full name"
                                            className="w-full h-11 px-4 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            placeholder="you@example.com"
                                            className="w-full h-11 px-4 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Subject</label>
                                    <input
                                        required
                                        value={form.subject}
                                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                        placeholder="How can we help?"
                                        className="w-full h-11 px-4 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        placeholder="Tell us more about your question or feedback..."
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 btn-primary-gradient text-white font-bold rounded-xl border-0 gap-2 text-[15px]">
                                    <Send size={16} /> Send Message
                                </Button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ContactSection
