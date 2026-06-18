import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserPortfolioQuery } from '@/features/api/authApi';
import { Loader2, Award, GraduationCap, Flame, ArrowLeft, Trophy, CalendarDays, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Portfolio = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetUserPortfolioQuery(userId);

    if (isLoading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-semibold">Loading portfolio...</p>
        </div>
    );

    if (error || !data?.success) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
                <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                <h1 className="text-2xl font-black text-foreground">Portfolio Not Found</h1>
                <p className="text-muted-foreground">The requested user profile does not exist or is private.</p>
                <Button onClick={() => navigate('/')} variant="outline" className="mt-4 rounded-xl font-bold border-border/60">
                    <ArrowLeft size={16} className="mr-2" /> Return Home
                </Button>
            </div>
        </div>
    );

    const { user, completedCourses } = data.portfolio;
    const joinedDate = new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-background pb-20">
            {}
            <div className="h-64 sm:h-80 w-full relative bg-gradient-to-br from-indigo-600 via-purple-600 to-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                {}
                <div className="absolute top-6 left-6 z-10">
                    <Button onClick={() => navigate(-1)} variant="ghost" className="bg-black/20 hover:bg-black/40 text-white backdrop-blur rounded-xl h-10 px-4 font-bold border border-white/10">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 sm:px-10 -mt-24 sm:-mt-32 relative z-10">
                <div className="flex flex-col sm:flex-row gap-6 sm:items-end mb-8 sm:mb-12">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 sm:w-48 sm:h-48 border-[6px] sm:border-[8px] border-background shadow-2xl rounded-[2.5rem] bg-card">
                            <AvatarImage src={user.photoUrl || ""} alt={user.name} className="object-cover" />
                            <AvatarFallback className="text-4xl sm:text-6xl font-black bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {user.xp > 500 && (
                            <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center border-4 border-background shadow-lg transform rotate-6">
                                <Award className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 pb-2 sm:pb-6">
                        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight mb-2 sm:mb-3 flex items-center gap-3">
                            {user.name}
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg max-w-2xl leading-relaxed mb-4">
                            {user.bio || "Enthusiastic lifelong learner. Constantly upgrading skills and exploring new horizons."}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                <GraduationCap size={16} /> {completedCourses.length} Courses Completed
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                                <Flame size={16} /> {user.xp || 0} XP Earned
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                                <CalendarDays size={16} /> Joined {joinedDate}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-2 text-foreground">
                        <Award size={24} className="text-primary" /> Certificates & Achievements
                    </h2>
                    
                    {completedCourses.length === 0 ? (
                        <div className="text-center py-20 bg-card border border-border/60 rounded-3xl shadow-sm">
                            <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-foreground">No completed courses yet</h3>
                            <p className="text-muted-foreground mt-2 font-medium">This student is currently learning but hasn't earned any certificates.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedCourses.map((course, idx) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                >
                                    <Card className="group border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 rounded-3xl overflow-hidden bg-card flex flex-col h-full cursor-pointer" onClick={() => navigate(`/course-detail/${course._id}`)}>
                                        <div className="aspect-video w-full bg-muted relative overflow-hidden flex-shrink-0">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-600/10">
                                                    <GraduationCap size={32} className="text-primary/40" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                    <ExternalLink size={16} /> View Course
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                    {course.category}
                                                </span>
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                                                    {course.level || "All Levels"}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                                                {course.title}
                                            </h3>
                                            <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                                    <Award size={18} /> Verified Certificate
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
