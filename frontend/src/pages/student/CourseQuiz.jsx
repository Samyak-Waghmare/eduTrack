import React, { useState } from 'react';
import { useGetQuizForLectureQuery } from '@/features/api/engagementApi';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, BrainCircuit, Loader2 } from 'lucide-react';

const CourseQuiz = ({ courseId, lectureId }) => {
    const { data, isLoading } = useGetQuizForLectureQuery({ courseId, lectureId });
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    if (isLoading) return <div className="py-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading quiz...</div>;

    const quiz = data?.quiz;
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-3xl border border-border/60 mt-6">
                <BrainCircuit className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-semibold text-foreground">No Quiz Available</p>
                <p className="text-sm text-muted-foreground mt-1">There is no quiz for this lecture yet.</p>
            </div>
        );
    }

    const question = quiz.questions[currentQuestionIdx];

    const handleOptionSelect = (idx) => {
        if (showResult) return;
        setSelectedOption(idx);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;
        setShowResult(true);
        if (selectedOption === question.correctAnswerIndex) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        setShowResult(false);
        setSelectedOption(null);
        setCurrentQuestionIdx(currentQuestionIdx + 1);
    };

    const isQuizFinished = currentQuestionIdx >= quiz.questions.length;

    if (isQuizFinished) {
        return (
            <div className="text-center py-16 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl border border-border/60 mt-6 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center mx-auto mb-6 shadow-md">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        {Math.round((score / quiz.questions.length) * 100)}%
                    </span>
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">Quiz Completed!</h3>
                <p className="font-semibold text-muted-foreground mb-8">You scored {score} out of {quiz.questions.length}</p>
                <Button onClick={() => { setCurrentQuestionIdx(0); setScore(0); setShowResult(false); setSelectedOption(null); }} className="rounded-xl h-11 font-bold">
                    Retake Quiz
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border/60 rounded-3xl p-8 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
                <span className="text-sm font-semibold text-muted-foreground">Score: {score}</span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-6 leading-relaxed">{question.questionText}</h3>
            
            <div className="space-y-3 mb-8">
                {question.options.map((opt, idx) => {
                    let btnClass = "border-border/60 hover:bg-muted text-foreground";
                    let Icon = null;
                    
                    if (showResult) {
                        if (idx === question.correctAnswerIndex) {
                            btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                            Icon = CheckCircle2;
                        } else if (idx === selectedOption) {
                            btnClass = "border-destructive bg-destructive/10 text-destructive";
                            Icon = XCircle;
                        } else {
                            btnClass = "opacity-50 border-border/40";
                        }
                    } else if (selectedOption === idx) {
                        btnClass = "border-primary bg-primary/10 text-primary";
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showResult}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-medium text-left ${btnClass}`}
                        >
                            <span>{opt}</span>
                            {Icon && <Icon size={20} />}
                        </button>
                    )
                })}
            </div>

            <div className="flex justify-end">
                {!showResult ? (
                    <Button disabled={selectedOption === null} onClick={handleCheckAnswer} className="rounded-xl font-bold h-11 px-8 btn-primary-gradient border-0 text-white shadow-md">
                        Check Answer
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="rounded-xl font-bold h-11 px-8">
                        {currentQuestionIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CourseQuiz;
