import React from 'react';
import { useGetInstructorAnalyticsQuery } from '@/features/api/analyticsApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, BookOpen, TrendingUp, Loader2 } from 'lucide-react';

const Analytics = () => {
    const { data, isLoading } = useGetInstructorAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="font-semibold text-lg">Loading Analytics...</p>
            </div>
        );
    }

    const { totalRevenue, totalSales, totalActiveCourses, revenueData, courseSalesData } = data?.analytics || {};

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Performance Analytics</h1>
                <p className="text-muted-foreground mt-1 text-lg">Track your revenue and student engagement</p>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-emerald-500/10 to-transparent">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
                        <div className="p-2 bg-emerald-500/20 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <IndianRupee className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black text-foreground">₹{totalRevenue?.toLocaleString('en-IN') || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-500" /> Lifetime earnings
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-primary/10 to-transparent">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Sales</CardTitle>
                        <div className="p-2 bg-primary/20 text-primary rounded-xl group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black text-foreground">{totalSales?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Enrolled students</p>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-purple-500/10 to-transparent">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Courses</CardTitle>
                        <div className="p-2 bg-purple-500/20 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black text-foreground">{totalActiveCourses || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Published on platform</p>
                    </CardContent>
                </Card>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {}
                <Card className="border-border/60 shadow-sm rounded-2xl col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Revenue Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueData && revenueData.length > 0 ? (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-muted-foreground font-medium">
                                No revenue data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {}
                <Card className="border-border/60 shadow-sm rounded-2xl col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Sales per Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {courseSalesData && courseSalesData.length > 0 ? (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={courseSalesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                        />
                                        <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-muted-foreground font-medium">
                                No sales data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
