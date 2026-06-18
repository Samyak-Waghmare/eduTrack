import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Play, Clock, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const levelConfig = {
        "Beginner": { cls: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/25", dot: "bg-emerald-500" },
        "Medium": { cls: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/25", dot: "bg-amber-500" },
        "Advance": { cls: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/25", dot: "bg-rose-500" },
    };

    const lvl = levelConfig[course.level] || levelConfig["Beginner"];

    return (
        <Card
            className="group overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/30 shadow-sm hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all duration-400 cursor-pointer hover:-translate-y-1.5 flex flex-col"
            onClick={() => navigate(`/course-detail/${course._id}`)}
        >
            {}
            <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-primary/20 via-purple-500/15 to-pink-500/10 flex-shrink-0">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                            <BookOpen size={28} className="text-primary/50" />
                        </div>
                    </div>
                )}

                {}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={22} className="text-white fill-white ml-1" />
                    </div>
                </div>

                {}
                <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${lvl.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lvl.dot}`} />
                        {course.level || "Beginner"}
                    </span>
                </div>

                {}
                {(!course.price || course.price === 0) && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                            FREE
                        </span>
                    </div>
                )}
            </div>

            <CardContent className="p-5 flex flex-col flex-grow gap-3">
                <div className="flex-grow">
                    <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
                        {course.title}
                    </h3>
                    {course.subTitle && (
                        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {course.subTitle}
                        </p>
                    )}
                </div>

                {}
                <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 ring-2 ring-background shadow-sm">
                        <AvatarImage src={course.creator?.photoUrl} />
                        <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                            {course.creator?.name?.charAt(0) || "I"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] text-muted-foreground font-semibold truncate">{course.creator?.name || "Instructor"}</span>
                </div>

                {}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                            <Users size={13} className="text-primary/60" />
                            <span>{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        {course.rating > 0 && (
                            <div className="flex items-center gap-1 text-[13px] font-bold text-amber-500">
                                <Star size={12} className="fill-amber-500" />
                                {course.rating.toFixed(1)}
                            </div>
                        )}
                    </div>
                    <span className={`font-extrabold text-[15px] ${course.price === 0 || !course.price ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}`}>
                        {course.price === 0 || !course.price ? "Free" : `₹${course.price}`}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseCard;
