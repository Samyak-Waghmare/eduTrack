import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, GraduationCap, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react"
import { useRegisterUserMutation, useLoginUserMutation } from "@/features/api/authApi"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const perks = [
    "Access 500+ expert-led courses",
    "Learn at your own pace, anytime",
    "Earn verifiable certificates",
    "Mobile & desktop friendly",
];

const Login = () => {
    const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [showLoginPwd, setShowLoginPwd] = useState(false);
    const [showSignupPwd, setShowSignupPwd] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);

    const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
    const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated]);

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") setSignupInput({ ...signupInput, [name]: value });
        else setLoginInput({ ...loginInput, [name]: value });
    };

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;
        await action(inputData);
    };

    useEffect(() => {
        if (registerIsSuccess && registerData) toast.success(registerData.message || "Account created! Please login.");
        if (registerError) toast.error(registerError?.data?.message || "Signup failed.");
        if (loginIsSuccess && loginData) toast.success(loginData.message || "Logged in successfully!");
        if (loginError) toast.error(loginError?.data?.message || "Login failed.");
    }, [loginIsLoading, registerIsLoading]);

    const inputClass = "pl-11 h-12 rounded-xl border-border bg-muted/40 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-muted-foreground/60";

    return (
        <div className="min-h-[calc(100vh-64px)] flex">
            {}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
                {}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-purple-700" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-900/40 blur-3xl" />

                <div className="relative z-10 text-white max-w-md w-full">
                    {}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
                            <GraduationCap size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">EduSkill</h1>
                            <p className="text-white/60 text-sm font-medium">Learning Platform</p>
                        </div>
                    </div>

                    <h2 className="text-4xl font-black leading-tight mb-4 tracking-tight">
                        Learn Skills That
                        <br />
                        <span className="text-white/80">Shape Your Future</span>
                    </h2>
                    <p className="text-white/65 text-lg leading-relaxed mb-10">
                        Join thousands of learners mastering new skills and advancing their careers with EduSkill.
                    </p>

                    {}
                    <div className="space-y-3.5">
                        {perks.map((perk) => (
                            <div key={perk} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                                <span className="text-white/80 font-medium text-sm">{perk}</span>
                            </div>
                        ))}
                    </div>

                    {}
                    <div className="grid grid-cols-3 gap-4 mt-12">
                        {[["500+", "Courses"], ["50K+", "Students"], ["4.8★", "Rating"]].map(([val, label]) => (
                            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 text-center">
                                <div className="text-2xl font-black text-white">{val}</div>
                                <div className="text-white/55 text-xs font-semibold mt-1 uppercase tracking-wider">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
                <div className="w-full max-w-[420px] space-y-7">
                    {}
                    <div className="lg:hidden text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30 mb-3">
                            <GraduationCap size={26} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black gradient-text">EduSkill</h1>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Welcome back 👋</h2>
                        <p className="text-muted-foreground mt-2 text-sm font-medium">Sign in to your account or create a new one</p>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-7 h-11 rounded-xl bg-muted p-1 border border-border/60">
                            <TabsTrigger
                                value="login"
                                className="rounded-lg font-bold text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="rounded-lg font-bold text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                Create Account
                            </TabsTrigger>
                        </TabsList>

                        {}
                        <TabsContent value="login">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email" name="email" value={loginInput.email}
                                            onChange={(e) => changeInputHandler(e, "login")}
                                            placeholder="you@example.com"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showLoginPwd ? "text" : "password"} name="password" value={loginInput.password}
                                            onChange={(e) => changeInputHandler(e, "login")}
                                            placeholder="Enter your password"
                                            className={`${inputClass} pr-11`}
                                        />
                                        <button
                                            type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    disabled={loginIsLoading}
                                    onClick={() => handleRegistration("login")}
                                    className="w-full h-12 rounded-xl btn-primary-gradient text-white font-bold text-[15px] border-0 mt-2"
                                >
                                    {loginIsLoading
                                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                                        : "Sign In"
                                    }
                                </Button>
                            </div>
                        </TabsContent>

                        {}
                        <TabsContent value="signup">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text" name="name" value={signupInput.name}
                                            onChange={(e) => changeInputHandler(e, "signup")}
                                            placeholder="John Doe"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email" name="email" value={signupInput.email}
                                            onChange={(e) => changeInputHandler(e, "signup")}
                                            placeholder="you@example.com"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-foreground">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showSignupPwd ? "text" : "password"} name="password" value={signupInput.password}
                                            onChange={(e) => changeInputHandler(e, "signup")}
                                            placeholder="Create a strong password"
                                            className={`${inputClass} pr-11`}
                                        />
                                        <button
                                            type="button" onClick={() => setShowSignupPwd(!showSignupPwd)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showSignupPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    disabled={registerIsLoading}
                                    onClick={() => handleRegistration("signup")}
                                    className="w-full h-12 rounded-xl btn-primary-gradient text-white font-bold text-[15px] border-0 mt-2"
                                >
                                    {registerIsLoading
                                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                                        : "Create Account"
                                    }
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <p className="text-center text-xs text-muted-foreground pt-2">
                        By signing up, you agree to our{" "}
                        <span className="text-primary font-semibold cursor-pointer hover:underline">Terms of Service</span>{" "}
                        and{" "}
                        <span className="text-primary font-semibold cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
