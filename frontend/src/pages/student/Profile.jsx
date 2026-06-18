import { useSelector } from "react-redux"
import { useUpdateUserMutation } from "@/features/api/authApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Camera, BookOpen, Award, User, Shield, Edit3, Mail } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import Course from "./Course"

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.photoUrl || "");
    const fileRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setBio(user.bio || "");
            setPreviewUrl(user.photoUrl || "");
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess) toast.success("Profile updated successfully!");
        if (isError) toast.error(error?.data?.message || "Failed to update profile");
    }, [isSuccess, isError]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        if (profilePhoto) formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);
    };

    const roleConfig = {
        "Instructor": { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-600 dark:text-purple-400", icon: "🎓" },
        "Student": { bg: "bg-primary/10 border-primary/20", text: "text-primary", icon: "📚" },
        "Admin": { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-600 dark:text-rose-400", icon: "⚡" },
    };
    const role = roleConfig[user?.role] || roleConfig["Student"];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background">
            {}
            <div className="relative h-44 bg-gradient-to-br from-primary via-primary/80 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-purple-900/30 blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-6">
                {}
                <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 mb-8">
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-3xl ring-4 ring-background shadow-2xl overflow-hidden">
                            <Avatar className="w-full h-full rounded-3xl">
                                <AvatarImage src={previewUrl} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-4xl font-black rounded-3xl">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all duration-200 border-2 border-background"
                        >
                            <Camera size={15} className="text-white" />
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </div>
                    <div className="pb-2">
                        <h1 className="text-2xl font-black text-foreground">{user?.name}</h1>
                        <p className="text-muted-foreground text-sm font-medium">{user?.email}</p>
                        <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold border ${role.bg} ${role.text}`}>
                            {role.icon} {user?.role}
                        </span>
                        {user && (
                            <Button 
                                onClick={() => window.open(`/u/${user._id}`, '_blank')} 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 ml-4 rounded-full font-bold border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors text-xs"
                            >
                                View Public Portfolio
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 pb-16">
                    {}
                    <div className="space-y-4">
                        {}
                        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
                            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Your Progress</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center border border-primary/15">
                                    <BookOpen size={20} className="mx-auto mb-2 text-primary" />
                                    <p className="text-2xl font-black text-foreground">{user?.enrolledCourses?.length || 0}</p>
                                    <p className="text-xs text-muted-foreground font-semibold mt-1">Enrolled</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 text-center border border-emerald-500/15">
                                    <Award size={20} className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-2xl font-black text-foreground">{user?.completedCoursesCount || 0}</p>
                                    <p className="text-xs text-muted-foreground font-semibold mt-1">Completed</p>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
                            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Account</h3>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                    <Shield size={14} className="text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Role</p>
                                    <p className="text-sm font-bold">{user?.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                    <Mail size={14} className="text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-bold truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                            <div className="px-6 py-5 border-b border-border/60 bg-muted/30">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Edit3 size={15} className="text-primary" />
                                    </div>
                                    <h2 className="font-bold text-foreground">Edit Profile</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="profile-name" className="text-sm font-bold">Full Name</Label>
                                    <Input
                                        id="profile-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="h-12 rounded-xl border-border bg-muted/30 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profile-bio" className="text-sm font-bold">Bio</Label>
                                    <textarea
                                        id="profile-bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself — your background, skills, and goals..."
                                        rows={4}
                                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted/30 focus:bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all font-medium placeholder:text-muted-foreground/60 text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={user?.email || ""}
                                            disabled
                                            className="h-12 rounded-xl pl-11 bg-muted/50 text-muted-foreground border-border/60 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Email cannot be changed for security reasons</p>
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl btn-primary-gradient text-white font-bold border-0 mt-2"
                                >
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving changes...</> : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        {}
                        {user?.enrolledCourses?.length > 0 && (
                            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                                <div className="px-6 py-5 border-b border-border/60 bg-muted/30">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <BookOpen size={15} className="text-primary" />
                                        </div>
                                        <h2 className="font-bold text-foreground">Enrolled Courses</h2>
                                        <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                            {user.enrolledCourses.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    {user.enrolledCourses.map(course => (
                                        <Course key={course._id} course={course} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
