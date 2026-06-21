import { Menu, School, GraduationCap, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DarkMode from '@/DarkMode'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

const Navbar = () => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Logged out successfully");
            navigate("/login");
        }
    }, [isSuccess]);

    const logoutHandler = async () => {
        await logoutUser();
    };

    const isActive = (path) => location.pathname === path;

    const scrollTo = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const publicNavLinks = [
        { label: 'Home', action: () => navigate('/') },
        { label: 'Features', action: () => scrollTo('features') },
        { label: 'About', action: () => scrollTo('about') },
        { label: 'Contact', action: () => scrollTo('contact') },
    ];

    return (
        <nav className={`h-16 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-[0_2px_20px_rgba(0,0,0,0.06)]' 
                : 'bg-background/60 backdrop-blur-xl border-b border-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full hidden md:flex items-center justify-between">
                {}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2.5 shrink-0 group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <span className="font-black text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight">
                        EduTrack
                    </span>
                </button>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {publicNavLinks.map(({ label, action }) => (
                        <button
                            key={label}
                            onClick={action}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                label === 'Home' && location.pathname === '/'
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                    <Link
                        to="/course/search"
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isActive('/course/search')
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                        Browse Courses
                    </Link>
                    {isAuthenticated && user?.role === "Instructor" && (
                        <Link
                            to="/instructor"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                location.pathname.startsWith('/instructor')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}
                    {isAuthenticated && user?.role === "Admin" && (
                        <Link
                            to="/admin/dashboard"
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                location.pathname.startsWith('/admin')
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-primary/80 hover:text-primary hover:bg-primary/10'
                            }`}
                        >
                            Admin Panel
                        </Link>
                    )}
                </div>

                {}
                <div className="flex items-center gap-3">
                    <DarkMode />
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate("/leaderboard")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-colors"
                            >
                                <Crown size={16} />
                                <span className="font-black text-sm">{user?.xp || 0} XP</span>
                            </button>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-border hover:border-primary/40 transition-all duration-200 bg-card hover:bg-accent group shadow-sm">
                                    <Avatar className="h-7 w-7 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                                        <AvatarImage src={user?.photoUrl || ""} alt={user?.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xs font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold text-foreground max-w-[110px] truncate">
                                        {user?.name?.split(" ")[0] || "Account"}
                                    </span>
                                    <svg className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-60 mt-2 rounded-2xl border border-border/60 bg-popover/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-1.5"
                                align="end"
                                sideOffset={8}
                            >
                                <div className="px-3 py-3 mb-1">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                            <AvatarImage src={user?.photoUrl || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-foreground truncate">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-border/60 mx-1 mb-1" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() => navigate("/my-learning")}
                                        className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                                    >
                                        My Learning
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate("/profile")}
                                        className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                                    >
                                        Edit Profile
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                {user?.role === "Instructor" && (
                                    <>
                                        <div className="h-px bg-border/60 mx-1 my-1" />
                                        <DropdownMenuItem
                                            onClick={() => navigate("/instructor")}
                                            className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                                        >
                                            Instructor Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => navigate("/instructor/qa")}
                                            className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                                        >
                                            Q&A Inbox
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <div className="h-px bg-border/60 mx-1 my-1" />
                                <DropdownMenuItem
                                    onClick={logoutHandler}
                                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive transition-colors"
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/login")}
                                className="font-semibold text-sm rounded-xl h-9 px-4 hover:bg-accent hover:text-primary transition-colors"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => navigate("/login")}
                                className="btn-primary-gradient text-white font-bold text-sm rounded-xl h-9 px-5 border-0"
                            >
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <GraduationCap size={16} className="text-white" />
                    </div>
                    <span className="font-black text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">EduTrack</span>
                </button>
                <div className="flex items-center gap-2">
                    <DarkMode />
                    <MobileNavbar user={user} isAuthenticated={isAuthenticated} onLogout={logoutHandler} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

const MobileNavbar = ({ user, isAuthenticated, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollTo = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const publicLinks = [
        { label: 'Home', action: () => navigate('/') },
        { label: 'Features', action: () => scrollTo('features') },
        { label: 'About', action: () => scrollTo('about') },
        { label: 'Contact', action: () => scrollTo('contact') },
        { label: 'Browse Courses', action: () => navigate('/course/search') },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-accent hover:text-primary transition-colors">
                    <Menu size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] p-0 bg-background/98 backdrop-blur-2xl border-l border-border/60 overflow-y-auto">
                <SheetHeader className="px-6 pt-7 pb-5 border-b border-border/60 sticky top-0 bg-background/98 backdrop-blur z-10">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <span className="font-black text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">EduTrack</span>
                    </SheetTitle>
                </SheetHeader>
                <div className="px-4 py-5 space-y-4">
                    {/* Public Links */}
                    <div className="space-y-1">
                        <p className="px-4 text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Navigation</p>
                        {publicLinks.map(({ label, action }) => (
                            <SheetClose key={label} asChild>
                                <button
                                    onClick={action}
                                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                                >
                                    {label}
                                </button>
                            </SheetClose>
                        ))}
                    </div>
                    
                    <div className="h-px bg-border/60 my-2" />

                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-border/60 mb-5">
                                <Avatar className="h-11 w-11 ring-2 ring-primary/30">
                                    <AvatarImage src={user?.photoUrl || ""} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-foreground truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground font-medium truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="px-4 text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Account</p>
                                {[
                                    { label: "My Learning", path: "/my-learning" },
                                    { label: "Edit Profile", path: "/profile" },
                                    ...(user?.role === "Instructor" ? [
                                        { label: "Dashboard", path: "/instructor" },
                                        { label: "Q&A Inbox", path: "/instructor/qa" }
                                    ] : []),
                                    ...(user?.role === "Admin" ? [{ label: "Admin Dashboard", path: "/admin/dashboard" }] : [])
                                ].map(item => (
                                    <SheetClose key={item.path} asChild>
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                location.pathname === item.path
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:text-primary hover:bg-primary/8'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    </SheetClose>
                                ))}
                            </div>
                            <div className="h-px bg-border/60 my-4" />
                            <SheetClose asChild>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </SheetClose>
                        </>
                    ) : (
                        <div className="space-y-3 pt-2">
                            <SheetClose asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-xl font-bold text-sm border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                                    onClick={() => navigate("/login")}
                                >
                                    Sign In
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button
                                    className="w-full h-12 rounded-xl btn-primary-gradient text-white font-bold text-sm border-0"
                                    onClick={() => navigate("/login")}
                                >
                                    Get Started Free
                                </Button>
                            </SheetClose>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
