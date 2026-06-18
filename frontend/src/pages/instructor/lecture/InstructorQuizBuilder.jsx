import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Plus, Trash2, CheckCircle2, Loader2, Save, X } from "lucide-react";
import { useGetQuizForLectureQuery, useCreateOrUpdateQuizMutation } from '@/features/api/engagementApi';
import { toast } from 'sonner';

const InstructorQuizBuilder = ({ courseId, lectureId }) => {
    const { data: quizData, isLoading: fetchingQuiz } = useGetQuizForLectureQuery({ courseId, lectureId });
    const [createOrUpdateQuiz, { isLoading: savingQuiz }] = useCreateOrUpdateQuizMutation();
    
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (quizData?.quiz?.questions) {
            setQuestions(quizData.quiz.questions);
        }
    }, [quizData]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: '', options: ['', ''], correctAnswerIndex: 0 }
        ]);
    };

    const handleRemoveQuestion = (idx) => {
        const newQ = [...questions];
        newQ.splice(idx, 1);
        setQuestions(newQ);
    };

    const handleQuestionTextChange = (idx, text) => {
        const newQ = [...questions];
        newQ[idx].questionText = text;
        setQuestions(newQ);
    };

    const handleOptionChange = (qIdx, optIdx, text) => {
        const newQ = [...questions];
        newQ[qIdx].options[optIdx] = text;
        setQuestions(newQ);
    };

    const handleAddOption = (qIdx) => {
        const newQ = [...questions];
        newQ[qIdx].options.push('');
        setQuestions(newQ);
    };

    const handleRemoveOption = (qIdx, optIdx) => {
        const newQ = [...questions];
        // Ensure at least 2 options remain
        if (newQ[qIdx].options.length <= 2) {
            toast.error("A question must have at least 2 options.");
            return;
        }
        newQ[qIdx].options.splice(optIdx, 1);
        
        // Adjust correct answer index if needed
        if (newQ[qIdx].correctAnswerIndex === optIdx) {
            newQ[qIdx].correctAnswerIndex = 0;
        } else if (newQ[qIdx].correctAnswerIndex > optIdx) {
            newQ[qIdx].correctAnswerIndex -= 1;
        }
        
        setQuestions(newQ);
    };

    const handleSetCorrectAnswer = (qIdx, optIdx) => {
        const newQ = [...questions];
        newQ[qIdx].correctAnswerIndex = optIdx;
        setQuestions(newQ);
    };

    const handleSaveQuiz = async () => {
        // Validation
        if (questions.length === 0) {
            toast.error("Please add at least one question.");
            return;
        }
        
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) {
                toast.error(`Question ${i + 1} is missing text.`);
                return;
            }
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].trim()) {
                    toast.error(`Option ${j + 1} in Question ${i + 1} is empty.`);
                    return;
                }
            }
        }

        try {
            await createOrUpdateQuiz({
                courseId,
                lectureId,
                questions
            }).unwrap();
            toast.success("Quiz saved successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to save quiz");
        }
    };

    if (fetchingQuiz) {
        return (
            <Card className="border-0 shadow-md">
                <CardContent className="py-10 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <BrainCircuit size={16} className="text-purple-500" />
                    Interactive Quiz Builder
                </CardTitle>
                <Button 
                    onClick={handleSaveQuiz} 
                    disabled={savingQuiz}
                    size="sm"
                    className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
                >
                    {savingQuiz ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Quiz
                </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {questions.length === 0 ? (
                    <div className="text-center py-8 bg-muted/20 rounded-2xl border border-dashed border-border/60">
                        <BrainCircuit className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="font-semibold text-foreground text-sm">No questions added yet.</p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">Add interactive questions to test student knowledge.</p>
                        <Button onClick={handleAddQuestion} variant="outline" size="sm" className="rounded-xl gap-1">
                            <Plus size={14} /> Add First Question
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, qIdx) => (
                            <div key={qIdx} className="p-5 rounded-2xl border border-border/50 bg-muted/10 relative group">
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    onClick={() => handleRemoveQuestion(qIdx)}
                                >
                                    <Trash2 size={12} />
                                </Button>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Question {qIdx + 1}</label>
                                        <Input 
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                                            placeholder="E.g., What is the main purpose of React?"
                                            className="h-11 font-medium bg-background"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Options (Select Correct Answer)</label>
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleSetCorrectAnswer(qIdx, optIdx)}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                                                        q.correctAnswerIndex === optIdx 
                                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                        : 'border-border/60 hover:border-primary/50 text-transparent'
                                                    }`}
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                                <Input 
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                                    placeholder={`Option ${optIdx + 1}`}
                                                    className={`h-9 bg-background ${q.correctAnswerIndex === optIdx ? 'border-emerald-500/50 focus-visible:ring-emerald-500' : ''}`}
                                                />
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                                    onClick={() => handleRemoveOption(qIdx, optIdx)}
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                        
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleAddOption(qIdx)}
                                            className="text-xs text-primary mt-2 gap-1"
                                        >
                                            <Plus size={12} /> Add Option
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <Button onClick={handleAddQuestion} variant="outline" className="w-full border-dashed gap-2 h-12 rounded-xl text-muted-foreground hover:text-primary">
                            <Plus size={16} /> Add Another Question
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default InstructorQuizBuilder;
