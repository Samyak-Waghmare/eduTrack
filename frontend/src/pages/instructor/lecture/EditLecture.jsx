import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEditLectureMutation, useGetLectureByIdQuery, useLazyGetCloudinarySignatureQuery } from "@/features/api/courseApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Upload, Video, X, Eye } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import InstructorQuizBuilder from "./InstructorQuizBuilder"
import { COURSE_API } from "@/lib/config"

const EditLecture = () => {
    const { courseId, lectureId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: fetching } = useGetLectureByIdQuery(lectureId);
    const [editLecture, { isLoading: saving }] = useEditLectureMutation();
    const [getSignature] = useLazyGetCloudinarySignatureQuery();

    const [lectureTitle, setLectureTitle] = useState("");
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoInfo, setVideoInfo] = useState(null);
    const fileRef = useRef(null);

    const lecture = data?.lecture;

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle || "");
            setIsPreviewFree(lecture.isPreviewFree || false);
            if (lecture.videoUrl) {
                setVideoPreview(lecture.videoUrl);
                setVideoInfo({ videoUrl: lecture.videoUrl, publicId: lecture.publicId });
            }
        }
    }, [lecture]);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!lectureTitle.trim()) {
            toast.error("Lecture title is required");
            return;
        }

        let finalVideoInfo = videoInfo;

        if (videoFile) {
            setUploading(true);
            try {
                
                const sigRes = await getSignature().unwrap();
                const { signature, timestamp, cloudName, apiKey } = sigRes;

                const uploadData = new FormData();
                uploadData.append("file", videoFile);
                uploadData.append("api_key", apiKey);
                uploadData.append("timestamp", timestamp);
                uploadData.append("signature", signature);
                uploadData.append("folder", "lms_videos");

                const cloudRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                    uploadData,
                    {
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    }
                );

                finalVideoInfo = {
                    videoUrl: cloudRes.data.secure_url,
                    publicId: cloudRes.data.public_id
                };
            } catch (err) {
                setUploading(false);
                toast.error("Failed to upload video to Cloudinary");
                return; 
            }
            setUploading(false);
        }

        const formData = new FormData();
        formData.append("lectureTitle", lectureTitle);
        formData.append("isPreviewFree", isPreviewFree);
        if (finalVideoInfo) {
            formData.append("videoInfo", JSON.stringify(finalVideoInfo));
        }

        try {
            await editLecture({
                courseId,
                lectureId,
                formData
            }).unwrap();
            toast.success("Lecture saved successfully!");
            navigate(`/instructor/course/${courseId}/lecture`);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to save lecture");
        }
    };

    if (fetching) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
                <Button variant="ghost" onClick={() => navigate(`/instructor/course/${courseId}/lecture`)} className="gap-1 text-muted-foreground">
                    <ArrowLeft size={16} />Back to Lectures
                </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold">Edit Lecture</h1>
                <Button disabled={saving || uploading} onClick={handleSave} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                    {(saving || uploading) ? <><Loader2 size={15} className="animate-spin" />Saving...</> : <><Save size={15} />Save Lecture</>}
                </Button>
            </div>

            <div className="space-y-4">
                <Card className="border-0 shadow-md">
                    <CardHeader><CardTitle className="text-base">Lecture Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-lecture-title">Lecture Title *</Label>
                            <Input id="edit-lecture-title" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} placeholder="Lecture title" className="h-11" />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className={`w-10 h-6 rounded-full transition-colors relative ${isPreviewFree ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isPreviewFree ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Free Preview</p>
                                <p className="text-xs text-muted-foreground">Allow non-enrolled students to watch this lecture</p>
                            </div>
                            <input type="checkbox" className="hidden" checked={isPreviewFree} onChange={(e) => setIsPreviewFree(e.target.checked)} />
                        </label>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Video size={16} />Video</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {videoPreview ? (
                            <div className="space-y-3">
                                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                                    <video src={videoPreview} controls className="w-full h-full" />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="gap-1">
                                        <Upload size={13} />Replace
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => { setVideoFile(null); setVideoPreview(""); setVideoInfo(null); }} className="gap-1 text-red-500 hover:text-red-500">
                                        <X size={13} />Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="aspect-video rounded-xl border-2 border-dashed dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Upload size={22} className="text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm">Click to upload video</p>
                                    <p className="text-xs text-muted-foreground mt-1">MP4, WebM, MKV supported</p>
                                </div>
                            </div>
                        )}
                        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />

                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            💡 To enable video hosting, configure your Cloudinary cloud name and create a "lms_videos" unsigned upload preset.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Upload size={16} />Subtitles (.vtt)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {lecture?.subtitleUrl ? (
                                <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Upload size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Subtitle Uploaded</p>
                                            <p className="text-xs text-muted-foreground hover:underline">
                                                <a href={lecture.subtitleUrl} target="_blank" rel="noreferrer">View File</a>
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => {}}>
                                        Replace below
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No subtitles uploaded yet. Global accessibility starts here!</p>
                            )}
                            <div className="flex items-center gap-3">
                                <Input type="file" accept=".vtt" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        const formData = new FormData();
                                        formData.append("subtitle", file);
                                        try {
                                            toast.info("Uploading subtitle...");

                                            const response = await axios.post(`${COURSE_API}${courseId}/lecture/${lectureId}/subtitle`, formData, {
                                                withCredentials: true
                                            });
                                            if(response.data.success){
                                                toast.success("Subtitle uploaded successfully!");
                                                
                                                window.location.reload();
                                            }
                                        } catch (error) {
                                            toast.error(error?.response?.data?.message || "Failed to upload subtitle");
                                        }
                                    }
                                }} className="cursor-pointer" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {}
                <InstructorQuizBuilder courseId={courseId} lectureId={lectureId} />
            </div>
        </div>
    )
}

export default EditLecture;
