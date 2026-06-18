import React, { useState, useEffect } from 'react';
import { useGetQuestionsForLectureQuery, useAskQuestionMutation, useReplyToQuestionMutation, engagementApi } from '@/features/api/engagementApi';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/useSocket';

const CourseQA = ({ courseId, lectureId }) => {
    const { data, isLoading, refetch } = useGetQuestionsForLectureQuery({ courseId, lectureId });
    const [askQuestion, { isLoading: isAsking }] = useAskQuestionMutation();
    const [replyToQuestion, { isLoading: isReplying }] = useReplyToQuestionMutation();
    const dispatch = useDispatch();
    
    const socket = useSocket(lectureId);

    useEffect(() => {
        if (!socket) return;

        socket.on("new_question", () => {
            refetch(); 
        });

        socket.on("new_reply", () => {
            refetch();
        });

        return () => {
            socket.off("new_question");
            socket.off("new_reply");
        };
    }, [socket, refetch]);
    
    const [newQuestion, setNewQuestion] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [activeReplyBox, setActiveReplyBox] = useState(null);

    const handleAsk = async () => {
        if (!newQuestion.trim()) return;
        try {
            await askQuestion({ courseId, lectureId, content: newQuestion }).unwrap();
            setNewQuestion("");
            toast.success("Question posted!");
        } catch (error) {
            toast.error("Failed to post question");
        }
    };

    const handleReply = async (questionId) => {
        const content = replyContent[questionId];
        if (!content?.trim()) return;
        try {
            await replyToQuestion({ questionId, content }).unwrap();
            setReplyContent(prev => ({ ...prev, [questionId]: "" }));
            setActiveReplyBox(null);
            toast.success("Reply posted!");
        } catch (error) {
            toast.error("Failed to post reply");
        }
    };

    if (isLoading) return <div className="py-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading discussions...</div>;

    const questions = data?.questions || [];

    return (
        <div className="space-y-8 mt-6">
            <div className="flex gap-4 items-start">
                <Avatar className="w-10 h-10 border border-border/60">
                    <AvatarFallback className="bg-primary/10 text-primary">ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    <Input 
                        value={newQuestion} 
                        onChange={e => setNewQuestion(e.target.value)} 
                        placeholder="Ask a question about this lecture..." 
                        className="h-12 rounded-xl border-border/60 focus-visible:ring-primary shadow-sm"
                    />
                    <Button 
                        disabled={isAsking || !newQuestion.trim()} 
                        onClick={handleAsk}
                        className="rounded-xl font-bold gap-2 btn-primary-gradient"
                    >
                        {isAsking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Post Question
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {questions.length === 0 ? (
                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-border/60">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="font-semibold text-foreground">No questions yet</p>
                        <p className="text-sm text-muted-foreground">Be the first to start a discussion!</p>
                    </div>
                ) : (
                    questions.map(q => (
                        <div key={q._id} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={q.user?.photoUrl} />
                                    <AvatarFallback className="bg-purple-500/10 text-purple-600">{q.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm text-foreground">{q.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/90 pl-13">{q.content}</p>
                            
                            <div className="pl-13 space-y-4 pt-2">
                                {q.replies?.map(r => (
                                    <div key={r._id} className="flex gap-3 bg-muted/30 p-3 rounded-xl">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={r.user?.photoUrl} />
                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-600">{r.user?.name?.charAt(0) || 'R'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-xs text-foreground">{r.user?.name} <span className="text-muted-foreground font-normal ml-2">{new Date(r.createdAt).toLocaleDateString()}</span></p>
                                            <p className="text-sm text-foreground/80 mt-1">{r.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {activeReplyBox === q._id ? (
                                    <div className="flex gap-2 items-start pt-2">
                                        <Input 
                                            value={replyContent[q._id] || ""}
                                            onChange={e => setReplyContent({...replyContent, [q._id]: e.target.value})}
                                            placeholder="Write a reply..."
                                            className="h-10 text-sm rounded-lg"
                                        />
                                        <Button disabled={isReplying} onClick={() => handleReply(q._id)} size="sm" className="h-10 rounded-lg">Reply</Button>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveReplyBox(null)} className="h-10 rounded-lg">Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="sm" onClick={() => setActiveReplyBox(q._id)} className="text-xs font-semibold text-muted-foreground hover:text-primary">
                                        Reply to thread
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseQA;
