import { useGetAdminAnalyticsQuery } from "@/features/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Users, IndianRupee, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import UsersTable from "./UsersTable";

const AdminDashboard = () => {
    const { data, isLoading, isError } = useGetAdminAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px] text-red-500">
                Failed to load analytics data.
            </div>
        );
    }

    const { totalUsers, totalInstructors, totalRevenue, totalCourses, salesData } = data.analytics;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Platform Dashboard</h1>
                <p className="text-muted-foreground mt-1">Real-time overview of the platform's health and growth.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">₹{totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">Total Users</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">{totalUsers.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">Total Courses</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">{totalCourses.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">Active Instructors</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">{totalInstructors.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-border/50 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="date" className="text-xs font-medium text-muted-foreground" tickLine={false} axisLine={false} />
                                    <YAxis className="text-xs font-medium text-muted-foreground" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                        labelStyle={{ color: 'var(--muted-foreground)' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/50 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Sales Volume</CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="date" className="text-xs font-medium text-muted-foreground" tickLine={false} axisLine={false} />
                                    <YAxis className="text-xs font-medium text-muted-foreground" tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                        cursor={{fill: 'var(--muted)', opacity: 0.2}}
                                    />
                                    <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card className="border border-border/50 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Manage Users</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <UsersTable />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
