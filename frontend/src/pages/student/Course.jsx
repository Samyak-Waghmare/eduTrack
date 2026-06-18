import { useNavigate } from "react-router-dom"
import { BookOpen, Play } from "lucide-react"

const Course = ({ course }) => {
    const navigate = useNavigate();
    return (
        <div
            className="group flex items-center gap-4 p-3.5 rounded-2xl hover:bg-muted/50 cursor-pointer transition-all duration-300 border border-transparent hover:border-border/60 hover:shadow-sm"
            onClick={() => navigate(`/course-progress/${course._id}`)}
        >
            <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20 flex-shrink-0">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={18} className="text-primary/50" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur flex items-center justify-center border border-white/40">
                        <Play size={10} className="fill-white text-white ml-0.5" />
                    </div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{course.title}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{course.category}</p>
            </div>
            <div className="flex-shrink-0">
                <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <Play size={10} className="fill-primary" />
                    Continue
                </div>
            </div>
        </div>
    )
}

export default Course;
