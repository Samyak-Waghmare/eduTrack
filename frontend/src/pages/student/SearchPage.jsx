import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useGetSearchCourseQuery } from "@/features/api/courseApi"
import CourseCard from "@/components/CourseCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, SlidersHorizontal, X, BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react"

const CATEGORIES = [
    "Web Development", "Python", "Machine Learning", "Data Science",
    "UI/UX Design", "Mobile Development", "DevOps", "JavaScript",
    "React", "Node.js", "Database", "Cybersecurity", "Cloud Computing", "Other"
];

const LEVELS = ["Beginner", "Medium", "Advance"];

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryParam = searchParams.get("query") || "";

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [submitted, setSubmitted] = useState(queryParam);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [page, setPage] = useState(1);
    const [allCourses, setAllCourses] = useState([]);

    const { data, isLoading, isError, isFetching, error } = useGetSearchCourseQuery({
        searchQuery: submitted,
        categories: selectedCategories,
        levels: selectedLevels,
        sortByPrice,
        page
    });

    useEffect(() => {
        setSearchQuery(queryParam);
        setSubmitted(queryParam);
        setPage(1);
        setAllCourses([]);
    }, [queryParam]);

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
        setAllCourses([]);
    }, [selectedCategories, selectedLevels, sortByPrice]);

    useEffect(() => {
        if (data?.courses) {
            if (page === 1) {
                setAllCourses(data.courses);
            } else {
                setAllCourses(prev => [...prev, ...data.courses]);
            }
        }
    }, [data, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSubmitted(searchQuery);
        setPage(1);
        setAllCourses([]);
        navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    };

    const toggleIn = (setter) => (value) =>
        setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);

    const toggleCategory = toggleIn(setSelectedCategories);
    const toggleLevel = toggleIn(setSelectedLevels);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSortByPrice("");
        setPage(1);
        setAllCourses([]);
    };

    const activeFilterCount = selectedCategories.length + selectedLevels.length + (sortByPrice ? 1 : 0);
    const courses = allCourses;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background">
            {}
            <div className="relative bg-gradient-to-br from-primary/10 via-background to-purple-600/5 border-b border-border/60 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-3">
                                <Sparkles size={12} /> Explore Courses
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                                Find your next <span className="gradient-text">skill</span>
                            </h1>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-3xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for courses, topics, skills..."
                                className="pl-12 h-14 rounded-2xl bg-card border-border/60 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary text-base font-medium"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="h-14 px-8 rounded-2xl btn-primary-gradient text-white font-bold border-0 text-base"
                        >
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="h-14 px-5 rounded-2xl gap-2 font-bold bg-card border-border/60 hover:bg-muted/50"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
                                    {activeFilterCount}
                                </span>
                            )}
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                    </form>

                    {}
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                        {submitted && (
                            <p className="text-sm font-medium text-muted-foreground">
                                {isLoading ? "Searching..." : (
                                    <span>
                                        <span className="font-bold text-foreground">{courses.length}</span> result{courses.length !== 1 ? "s" : ""} for{" "}
                                        <span className="font-bold text-primary">"{submitted}"</span>
                                    </span>
                                )}
                            </p>
                        )}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-destructive bg-destructive/10 rounded-full hover:bg-destructive/20 transition-colors"
                            >
                                <X size={12} /> Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
                {}
                {showFilters && (
                    <aside className="w-full lg:w-72 shrink-0 animate-fade-in">
                        <div className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden lg:sticky lg:top-24">
                            <div className="px-6 py-5 border-b border-border/60 bg-muted/20">
                                <h3 className="font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                                    <SlidersHorizontal size={14} /> Filter Options
                                </h3>
                            </div>

                            {}
                            <div className="px-6 py-5 border-b border-border/60">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Sort by Price</h4>
                                <div className="space-y-1.5">
                                    {[
                                        { value: "", label: "Default" },
                                        { value: "low", label: "Low to High" },
                                        { value: "high", label: "High to Low" }
                                    ].map(opt => (
                                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${sortByPrice === opt.value ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                                                {sortByPrice === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortByPrice === opt.value}
                                                onChange={() => setSortByPrice(opt.value)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-medium ${sortByPrice === opt.value ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                                {opt.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {}
                            <div className="px-6 py-5 border-b border-border/60">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Skill Level</h4>
                                <div className="space-y-1.5">
                                    {LEVELS.map(lvl => (
                                        <label key={lvl} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedLevels.includes(lvl) ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                                                {selectedLevels.includes(lvl) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedLevels.includes(lvl)}
                                                onChange={() => toggleLevel(lvl)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-medium ${selectedLevels.includes(lvl) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                                {lvl}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {}
                            <div className="px-6 py-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Category</h4>
                                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                    {CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedCategories.includes(cat) ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                                                {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-medium leading-tight ${selectedCategories.includes(cat) ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {}
                <div className="flex-1 min-w-0">
                    {isError ? (
                        <div className="text-center py-20 bg-card rounded-3xl border border-border/60 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                                <BookOpen size={28} className="text-destructive" />
                            </div>
                            <p className="font-black text-xl text-foreground mb-2">Error Loading Courses</p>
                            <p className="text-sm font-medium text-muted-foreground">{error?.data?.message || error?.error || "Unknown error occurred"}</p>
                            <p className="text-xs mt-2 text-muted-foreground/50">{JSON.stringify(error)}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border/60">
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        <div className="absolute inset-0 shimmer" />
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <Skeleton className="h-5 w-3/4 rounded-lg" />
                                        <Skeleton className="h-4 w-full rounded-lg" />
                                        <div className="flex gap-2 items-center pt-2 border-t border-border/50">
                                            <Skeleton className="h-7 w-7 rounded-full" />
                                            <Skeleton className="h-4 w-24 rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {courses.map((course, idx) => (
                                    <div key={`${course._id}-${idx}`} className="animate-fade-up" style={{ animationDelay: `${(idx % 12) * 50}ms` }}>
                                        <CourseCard course={course} />
                                    </div>
                                ))}
                            </div>
                            
                            {data?.currentPage < data?.totalPages && (
                                <div className="flex justify-center pt-6 pb-12">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={isFetching}
                                        className="h-14 px-10 rounded-2xl font-bold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary min-w-[200px]"
                                    >
                                        {isFetching ? "Loading..." : "Load More Courses"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-28 bg-card rounded-3xl border border-border/60 shadow-sm">
                            <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <Search size={36} className="text-muted-foreground/50" />
                            </div>
                            <h3 className="font-black text-2xl text-foreground mb-3">No courses found</h3>
                            <p className="text-muted-foreground font-medium mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                            {activeFilterCount > 0 && (
                                <Button variant="outline" onClick={clearFilters} className="gap-2 rounded-xl h-11 font-bold">
                                    <X size={16} /> Clear All Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
