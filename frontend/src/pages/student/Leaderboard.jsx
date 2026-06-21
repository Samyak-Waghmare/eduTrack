import React from 'react';
import { useGetLeaderboardQuery } from '@/features/api/authApi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy, Medal, Star, Flame, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const { data, isLoading } = useGetLeaderboardQuery();
    const leaderboard = data?.leaderboard || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-background py-12 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 mb-6">
                        <Trophy className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                        Global Leaderboard
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        The most dedicated learners on EduTrack. Earn XP by completing courses and helping others!
                    </p>
                </div>

                {topThree.length > 0 && (
                    <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 mt-8">
                        {topThree[1] && (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="w-full md:w-64 flex flex-col items-center order-2 md:order-1"
                            >
                                <div className="relative mb-4">
                                    <Avatar className="w-24 h-24 ring-4 ring-slate-300 shadow-xl shadow-slate-300/20">
                                        <AvatarImage src={topThree[1].photoUrl} />
                                        <AvatarFallback className="bg-slate-100 text-slate-700 text-3xl font-black">
                                            {topThree[1].name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-700 text-xs font-black px-3 py-1 rounded-full border-2 border-background">
                                        2ND
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 w-full pt-8 pb-6 px-4 rounded-t-3xl border border-border/50 text-center flex-1">
                                    <h3 className="font-black text-foreground truncate">{topThree[1].name}</h3>
                                    <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2 font-bold">
                                        <Flame size={16} /> {topThree[1].xp} XP
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {topThree[0] && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0 }}
                                className="w-full md:w-72 flex flex-col items-center order-1 md:order-2 z-10"
                            >
                                <div className="relative mb-6">
                                    <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 text-amber-400 drop-shadow-md" />
                                    <Avatar className="w-32 h-32 ring-4 ring-amber-400 shadow-2xl shadow-amber-500/30">
                                        <AvatarImage src={topThree[0].photoUrl} />
                                        <AvatarFallback className="bg-amber-100 text-amber-700 text-4xl font-black">
                                            {topThree[0].name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-black px-4 py-1.5 rounded-full border-4 border-background shadow-lg">
                                        1ST
                                    </div>
                                </div>
                                <div className="bg-gradient-to-b from-amber-500/10 to-transparent w-full pt-10 pb-8 px-4 rounded-t-3xl border border-amber-500/20 text-center flex-1">
                                    <h3 className="text-xl font-black text-foreground truncate">{topThree[0].name}</h3>
                                    <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 mt-2 font-black text-lg">
                                        <Flame size={18} /> {topThree[0].xp} XP
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {topThree[2] && (
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="w-full md:w-64 flex flex-col items-center order-3 md:order-3"
                            >
                                <div className="relative mb-4">
                                    <Avatar className="w-20 h-20 ring-4 ring-orange-300 shadow-xl shadow-orange-300/20">
                                        <AvatarImage src={topThree[2].photoUrl} />
                                        <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl font-black">
                                            {topThree[2].name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-800 text-xs font-black px-3 py-1 rounded-full border-2 border-background">
                                        3RD
                                    </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 w-full pt-8 pb-6 px-4 rounded-t-3xl border border-border/50 text-center flex-1">
                                    <h3 className="font-bold text-foreground truncate">{topThree[2].name}</h3>
                                    <div className="flex items-center justify-center gap-1.5 text-orange-500 dark:text-orange-400 mt-2 font-bold">
                                        <Flame size={14} /> {topThree[2].xp} XP
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {others.length > 0 && (
                    <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-muted/30 border-b border-border/60 flex items-center justify-between">
                            <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Rank</span>
                            <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Student</span>
                            <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Experience</span>
                        </div>
                        <div className="divide-y divide-border/40">
                            {others.map((user, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                    key={user._id} 
                                    className="flex items-center p-4 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="w-16 text-center font-black text-xl text-muted-foreground/50">
                                        {index + 4}
                                    </div>
                                    <div className="flex-1 flex items-center gap-4">
                                        <Avatar className="w-10 h-10 ring-2 ring-primary/10">
                                            <AvatarImage src={user.photoUrl} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {user.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-bold text-foreground">{user.name}</span>
                                    </div>
                                    <div className="w-32 text-right">
                                        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-bold">
                                            <Star size={14} />
                                            {user.xp}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                
                {leaderboard.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground font-medium text-lg">No one has earned XP yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
