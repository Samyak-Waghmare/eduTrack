import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCreateLectureMutation, useGetCourseLectureQuery, useRemoveLectureMutation } from "@/features/api/courseApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Loader2, Plus, Trash2, GripVertical, Video } from "lucide-react"
import { toast } from "sonner"

const CreateLecture = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useGetCourseLectureQuery(courseId);
    const [createLecture, { isLoading: creating }] = useCreateLectureMutation();
    const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();

    const [lectureTitle, setLectureTitle] = useState("");

    const lectures = data?.lectures || [];

    const handleCreate = async () => {
        if (!lectureTitle.trim()) {
            toast.error("Lecture title is required");
            return;
        }
        try {
            await createLecture({ lectureTitle, courseId }).unwrap();
            setLectureTitle("");
            refetch();
            toast.success("Lecture created!");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create lecture");
        }
    };

    const handleRemove = async (lectureId) => {
        try {
            await removeLecture(lectureId).unwrap();
            refetch();
            toast.success("Lecture removed");
        } catch {
            toast.error("Failed to remove lecture");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            {}
            <div className="flex items-center gap-3 mb-8">
                <Button variant="ghost" onClick={() => navigate(`/instructor/course/${courseId}`)} className="gap-1 text-muted-foreground">
                    <ArrowLeft size={16} />Back to Course
                </Button>
            </div>

            <h1 className="text-2xl font-extrabold mb-6">Manage Lectures</h1>

            {}
            <Card className="border-0 shadow-md mb-6">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus size={16} />Add New Lecture</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="lecture-title">Lecture Title</Label>
                        <Input
                            id="lecture-title"
                            value={lectureTitle}
                            onChange={(e) => setLectureTitle(e.target.value)}
                            placeholder="e.g. Introduction to React Hooks"
                            className="h-11"
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                    </div>
                    <Button
                        disabled={creating}
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold gap-2"
                    >
                        {creating ? <><Loader2 size={15} className="animate-spin" />Adding...</> : <><Plus size={15} />Add Lecture</>}
                    </Button>
                </CardContent>
            </Card>

            {}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center gap-2"><Video size={16} />All Lectures</span>
                        <span className="text-sm font-normal text-muted-foreground">{lectures.length} total</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                    ) : lectures.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Video size={32} className="mx-auto mb-3 opacity-30" />
                            <p>No lectures yet. Add your first lecture above!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {lectures.map((lecture, idx) => (
                                <div key={lecture._id} className="flex items-center gap-3 p-3 rounded-xl border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors">
                                    <GripVertical size={16} className="text-muted-foreground/40 flex-shrink-0" />
                                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{lecture.lectureTitle}</p>
                                        {lecture.videoUrl ? (
                                            <p className="text-xs text-green-600 mt-0.5">✓ Video uploaded</p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground mt-0.5">No video yet</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/instructor/course/${courseId}/lecture/${lecture._id}`)}
                                            className="h-7 gap-1 text-xs"
                                        >
                                            <Edit size={11} />Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={removing}
                                            onClick={() => handleRemove(lecture._id)}
                                            className="h-7 gap-1 text-xs text-red-500 hover:text-red-500 hover:border-red-300"
                                        >
                                            <Trash2 size={11} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateLecture;
