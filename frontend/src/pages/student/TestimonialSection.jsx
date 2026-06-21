import { Star, Quote } from "lucide-react"

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Frontend Developer",
        company: "TechFlow",
        image: "https://i.pravatar.cc/150?u=sarah",
        text: "The web development bootcamp completely transformed my career. Within 3 months of completing the course, I landed my first junior developer role. The instructors explain complex topics incredibly well.",
        rating: 5,
    },
    {
        name: "Michael Chen",
        role: "Data Analyst",
        company: "DataCorp",
        image: "https://i.pravatar.cc/150?u=michael",
        text: "I've tried many learning platforms, but EduTrack's project-based approach is what finally made Python click for me. The community support and Q&A sections are invaluable when you're stuck.",
        rating: 5,
    },
    {
        name: "Elena Rodriguez",
        role: "UX Designer",
        company: "Creative Solutions",
        image: "https://i.pravatar.cc/150?u=elena",
        text: "The UI/UX design masterclass is top-tier. I loved how it didn't just teach Figma, but focused heavily on design thinking and user research. My portfolio looks 10x better now.",
        rating: 5,
    },
]

const TestimonialSection = () => {
    return (
        <section className="py-24 px-6 bg-muted/30 border-y border-border/60">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
                        Trusted by thousands of <span className="text-primary">developers</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                        Don't just take our word for it. Here's what our students have to say about their learning experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                            
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed mb-6 font-medium text-[15px]">
                                "{testimonial.text}"
                            </p>
                            
                            <div className="flex items-center gap-3">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="w-10 h-10 rounded-full object-cover border border-border"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">{testimonial.name}</h4>
                                    <p className="text-xs text-muted-foreground font-medium">{testimonial.role} at {testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialSection
