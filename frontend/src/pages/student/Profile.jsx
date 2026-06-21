import { useSelector } from "react-redux"
import { useUpdateUserMutation } from "@/features/api/authApi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Camera, BookOpen, Award, Shield, Edit3, Mail, ExternalLink } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Profile = () => {
    const { user } = useSelector(state => state.auth);
    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();
    const navigate = useNavigate();

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
        <div className="min-h-[calc(100vh-64px)] bg-background pb-20">
            {/* Banner */}
            <div className="relative h-48 sm:h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-black/20 blur-3xl pointer-events-none" />
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header section with Avatar and Name */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-24 sm:-mt-28 mb-12">
                    <div className="relative shrink-0 group">
                        <Avatar className="w-40 h-40 sm:w-48 sm:h-48 border-[6px] border-background shadow-xl rounded-full bg-card">
                            <AvatarImage src={previewUrl} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 text-muted-foreground text-5xl font-black">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200 border-4 border-background"
                            title="Update Profile Photo"
                        >
                            <Camera size={18} className="text-white" />
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    </div>
                    
                    <div className="flex-1 pb-2 sm:pb-4 w-full text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-1">{user?.name}</h1>
                                <p className="text-muted-foreground font-medium text-lg">{user?.email}</p>
                                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${role.bg} ${role.text}`}>
                                        {role.icon} {user?.role}
                                    </span>
                                </div>
                            </div>
                            
                            {user && (
                                <Button 
                                    onClick={() => navigate(`/u/${user._id}`)} 
                                    className="rounded-full font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all btn-primary-gradient text-white border-0 px-6 h-11 flex items-center gap-2"
                                >
                                    <ExternalLink size={16} /> View Public Portfolio
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Account */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm">
                            <h3 className="font-black text-sm text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                                <Award size={16} /> Your Progress
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center border border-primary/15 hover:border-primary/30 transition-colors">
                                    <BookOpen size={24} className="mx-auto mb-3 text-primary" />
                                    <p className="text-3xl font-black text-foreground mb-1">{user?.enrolledCourses?.length || 0}</p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Enrolled</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl p-5 text-center border border-emerald-500/15 hover:border-emerald-500/30 transition-colors">
                                    <Award size={24} className="mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-3xl font-black text-foreground mb-1">{user?.completedCoursesCount || 0}</p>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Completed</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm">
                            <h3 className="font-black text-sm text-muted-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
                                <Shield size={16} /> Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <Shield size={16} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Role</p>
                                        <p className="text-sm font-black text-foreground">{user?.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                        <Mail size={16} className="text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                                        <p className="text-sm font-bold text-foreground truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form & Enrolled Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-border/60 bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Edit3 size={18} className="text-primary" />
                                    </div>
                                    <h2 className="text-xl font-black text-foreground">Edit Profile</h2>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="profile-name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                    <Input
                                        id="profile-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="h-12 rounded-xl border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="profile-bio" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bio</Label>
                                    <textarea
                                        id="profile-bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself — your background, skills, and goals..."
                                        rows={4}
                                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all font-medium placeholder:text-muted-foreground/60 text-foreground"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={user?.email || ""}
                                            disabled
                                            className="h-12 rounded-xl pl-11 bg-muted/50 text-muted-foreground border-border/60 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <p className="text-xs font-semibold text-muted-foreground">Email cannot be changed for security reasons</p>
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl btn-primary-gradient text-white font-bold border-0 mt-4 text-[15px] hover:-translate-y-0.5 transition-transform"
                                >
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving changes...</> : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        {user?.enrolledCourses?.length > 0 && (
                            <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
                                <div className="px-8 py-6 border-b border-border/60 bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <BookOpen size={18} className="text-primary" />
                                        </div>
                                        <h2 className="text-xl font-black text-foreground">Enrolled Courses</h2>
                                        <span className="ml-auto text-xs font-black bg-primary text-white px-3 py-1 rounded-full shadow-sm shadow-primary/20">
                                            {user.enrolledCourses.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
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

