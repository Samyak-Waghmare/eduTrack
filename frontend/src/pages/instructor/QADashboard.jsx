import React, { useState } from 'react';
import { useGetInstructorQAQuery, useReplyToQuestionMutation } from '@/features/api/engagementApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MessageCircle, Send, CheckCircle2, Search, BookOpen, Clock, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const QADashboard = () => {
    const { data, isLoading } = useGetInstructorQAQuery();
    const [replyToQuestion, { isLoading: isReplying }] = useReplyToQuestionMutation();
    const [replyText, setReplyText] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("unanswered"); 

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const questions = data?.questions || [];

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = 
            (q.content?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (q.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (q.courseId?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase());
            
        const isAnswered = q.replies && q.replies.some(r => r.user?.role === "Instructor" || r.user?.role === "Admin");
        
        if (filter === "unanswered") return matchesSearch && !isAnswered;
        if (filter === "answered") return matchesSearch && isAnswered;
        return matchesSearch;
    });

    const handleReply = async (questionId) => {
        const text = replyText[questionId];
        if (!text || !text.trim()) return;

        try {
            await replyToQuestion({ questionId, content: text }).unwrap();
            toast.success("Reply posted successfully!");
            setReplyText(prev => ({ ...prev, [questionId]: "" }));
        } catch (error) {
            toast.error(error?.data?.message || "Failed to post reply");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MessageCircle size={22} />
                        </div>
                        Q&A Inbox
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Answer student questions across all your courses.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search questions..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-11 bg-card border-border/60"
                        />
                    </div>
                    <div className="flex p-1 bg-card border border-border/60 rounded-lg">
                        <button 
                            onClick={() => setFilter("unanswered")}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${filter === 'unanswered' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setFilter("answered")}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${filter === 'answered' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            Answered
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredQuestions.length === 0 ? (
                    <Card className="border-dashed border-2 border-border/60 bg-transparent shadow-none">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} className="text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Inbox Zero!</h3>
                            <p className="text-muted-foreground mt-2">You have no {filter === 'unanswered' ? 'pending' : ''} questions matching your criteria.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredQuestions.map((q) => {
                        const isAnswered = q.replies && q.replies.some(r => r.user?.role === "Instructor" || r.user?.role === "Admin");
                        
                        return (
                            <Card key={q._id} className={`border-l-4 overflow-hidden transition-all duration-300 hover:shadow-md ${isAnswered ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                                <CardHeader className="pb-3 border-b border-border/40 bg-muted/5">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                                <AvatarImage src={q.user?.photoUrl} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                                    {q.user?.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-foreground">{q.user?.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mt-1">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</span>
                                                    <span className="flex items-center gap-1.5"><BookOpen size={12} /> {q.courseId?.title}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isAnswered ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                                {isAnswered ? 'Answered' : 'Needs Reply'}
                                            </span>
                                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                Lecture: {q.lectureId?.lectureTitle}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="bg-background border border-border/60 rounded-xl p-5 shadow-sm">
                                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{q.content}</p>
                                    </div>

                                    {q.replies && q.replies.length > 0 && (
                                        <div className="space-y-4 pl-8 border-l-2 border-border/60 ml-4">
                                            {q.replies.map((reply, idx) => {
                                                const isInstructor = reply.user?.role === "Instructor" || reply.user?.role === "Admin";
                                                return (
                                                    <div key={idx} className={`p-4 rounded-xl border ${isInstructor ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border/40'}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={reply.user?.photoUrl} />
                                                                    <AvatarFallback className="text-[10px] bg-primary/20">{reply.user?.name?.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                                                    {reply.user?.name}
                                                                    {isInstructor && <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-black uppercase">Instructor</span>}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <Input 
                                            placeholder="Write your answer..."
                                            value={replyText[q._id] || ""}
                                            onChange={(e) => setReplyText({ ...replyText, [q._id]: e.target.value })}
                                            className="bg-card flex-1 h-11 border-border/60 focus-visible:ring-primary/50"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleReply(q._id);
                                            }}
                                        />
                                        <Button 
                                            onClick={() => handleReply(q._id)} 
                                            disabled={isReplying || !replyText[q._id]?.trim()}
                                            className="h-11 px-6 font-bold gap-2 shrink-0 btn-primary-gradient border-0 text-white"
                                        >
                                            {isReplying ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                            Reply
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default QADashboard;
