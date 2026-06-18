import React, { useState } from 'react';
import { useGetNotesByLectureQuery, useCreateNoteMutation, useDeleteNoteMutation } from '@/features/api/noteApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayCircle, Trash2, Clock, PlusCircle, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const CourseNotes = ({ courseId, lectureId, videoRef }) => {
    const { data, isLoading } = useGetNotesByLectureQuery(lectureId);
    const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [noteContent, setNoteContent] = useState('');

    const notes = data?.notes || [];

    const handleAddNoteClick = () => {
        if (!videoRef?.current) {
            toast.error("Video player not ready");
            return;
        }
        
        // Pause the video while taking note
        const player = videoRef.current.getInternalPlayer();
        if (player && typeof player.pause === 'function') {
            player.pause();
        }
        
        const time = videoRef.current.getCurrentTime();
        setCurrentTime(time);
        setIsAdding(true);
    };

    const handleSaveNote = async () => {
        if (!noteContent.trim()) {
            toast.error("Note content cannot be empty");
            return;
        }
        try {
            await createNote({ courseId, lectureId, timestamp: currentTime, content: noteContent }).unwrap();
            setNoteContent('');
            setIsAdding(false);
            toast.success("Note saved successfully!");
        } catch (error) {
            toast.error("Failed to save note");
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(noteId).unwrap();
            toast.success("Note deleted");
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    const jumpToTime = (timestamp) => {
        if (videoRef?.current) {
            videoRef.current.seekTo(timestamp);
            
            // Try to play automatically after seeking
            const player = videoRef.current.getInternalPlayer();
            if (player && typeof player.play === 'function') {
                player.play();
            }
        }
    };

    if (isLoading) {
        return (
            <div className="py-10 flex justify-center text-muted-foreground">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">My Video Notes</h3>
                {!isAdding && (
                    <Button onClick={handleAddNoteClick} className="gap-2 rounded-xl btn-primary-gradient border-0 text-white font-bold h-10">
                        <PlusCircle size={16} /> Add Note Here
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/60 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <Clock size={12} /> {formatTime(currentTime)}
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">Adding a note at this timestamp...</span>
                    </div>
                    <div className="flex gap-3">
                        <Input 
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Type your private note here..."
                            className="bg-background rounded-xl border-border/60 focus-visible:ring-primary h-11"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveNote();
                            }}
                        />
                        <Button 
                            onClick={handleSaveNote} 
                            disabled={isCreating}
                            className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold px-6 border-0 shrink-0"
                        >
                            {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save Note'}
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsAdding(false)}
                            className="h-11 rounded-xl text-muted-foreground hover:bg-muted"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {notes.length === 0 && !isAdding ? (
                    <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-muted/10">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={24} className="text-muted-foreground/50" />
                        </div>
                        <p className="font-bold text-foreground">No notes for this lecture yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Click the Add Note button while watching to bookmark important concepts.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className="group flex gap-4 p-4 rounded-2xl border border-border/40 hover:border-border/80 hover:bg-muted/20 transition-all">
                            <button 
                                onClick={() => jumpToTime(note.timestamp)}
                                className="flex flex-col items-center justify-center shrink-0 w-16 h-12 bg-primary/10 rounded-xl text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                                <span className="text-xs font-black">{formatTime(note.timestamp)}</span>
                                <PlayCircle size={14} className="mt-0.5 opacity-50" />
                            </button>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-sm font-medium text-foreground">{note.content}</p>
                            </div>
                            <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CourseNotes;
