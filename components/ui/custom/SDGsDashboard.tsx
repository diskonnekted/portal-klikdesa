import * as React from "react";
import Image from "next/image";
import {
    BarChart3,
    Target,
    Info,
    PieChart,
    BarChart,
    Activity,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    FileText,
    TrendingUp,
    BookOpen,
    Lightbulb,
} from "lucide-react";
import {
    BarChart as RechartsBarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Function to fetch real SDGs data
const fetchSDGsData = async (locationCode: string = "3404140004"): Promise<SDGGoal[]> => {
    try {
        const response = await fetch(`/api/sdgs?location_code=${locationCode}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch SDGs data: ${response.status}`);
        }

        const data: SDGsApiResponse = await response.json();

        // Map API data to our format
        return data.data.map((item) => {
            const score = item.score;

            // Determine status based on score
            let status: "on-track" | "behind" | "ahead" | "not-started";
            if (score === 0) {
                status = "not-started";
            } else if (score < 50) {
                status = "behind";
            } else if (score >= 80) {
                status = "ahead";
            } else {
                status = "on-track";
            }

            // Map to color classes based on goal number
            const colors = [
                "bg-red-600",
                "bg-yellow-600",
                "bg-[#3a4d74]",
                "bg-red-700",
                "bg-orange-600",
                "bg-blue-500",
                "bg-yellow-500",
                "bg-purple-600",
                "bg-orange-700",
                "bg-red-800",
                "bg-yellow-700",
                "bg-amber-600",
                "bg-[#2f3f62]",
                "bg-blue-700",
                "bg-[#283755]",
                "bg-blue-800",
                "bg-indigo-700",
                "bg-indigo-700",
            ];

            // Map to local SDGs images
            const localImages = [
                "/images/sdgs/satu.png", // 1
                "/images/sdgs/dua.png", // 2
                "/images/sdgs/tiga.png", // 3
                "/images/sdgs/empat.png", // 4
                "/images/sdgs/lima.png", // 5
                "/images/sdgs/enam.png", // 6
                "/images/sdgs/tujuh.png", // 7
                "/images/sdgs/delapan.png", // 8
                "/images/sdgs/sembilan.png", // 9
                "/images/sdgs/sepuluh.png", // 10
                "/images/sdgs/sebelas.png", // 11
                "/images/sdgs/duabelas.png", // 12
                "/images/sdgs/tigabelas.png", // 13
                "/images/sdgs/empatbelas.png", // 14
                "/images/sdgs/limabelas.png", // 15
                "/images/sdgs/enambelas.png", // 16
                "/images/sdgs/tujuhbelas.png", // 17
                "/images/sdgs/delapanbelas.jpg", // 18
            ];

            return {
                id: item.goals,
                title: item.title,
                description: `Implementasi ${item.title} di Desa Sijenggung`,
                imageUrl: localImages[item.goals - 1] || "/images/sdgs/satu.png",
                color: colors[item.goals - 1] || "bg-gray-600",
                progress: Math.round(score),
                target: 100,
                programs: Math.max(1, Math.floor(score / 20)), // Estimate programs based on score
                achievements:
                    score > 0
                        ? [`Program implementasi ${item.title}`, `Pencapaian skor ${Math.round(score)}`]
                        : ["Belum ada program implementasi"],
                status,
            };
        });
    } catch (error) {
        console.error("Failed to fetch SDGs data:", error);
        return [];
    }
};

// Function to get overall SDGs score
const fetchOverallScore = async (locationCode: string = "3404140004"): Promise<number> => {
    try {
        const response = await fetch(`/api/sdgs?location_code=${locationCode}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch overall score: ${response.status}`);
        }

        const data: SDGsApiResponse = await response.json();
        return parseFloat(data.average);
    } catch (error) {
        console.error("Failed to fetch overall score:", error);
        return 0;
    }
};

// Function to fetch detailed scores for a specific goal
const fetchDetailedScores = async (
    goalId: number,
    locationCode: string = "33.04.09.2014"
): Promise<DetailedScoresResponse | null> => {
    try {
        const response = await fetch(`/api/sdgs/detail/${goalId}?location_code=${locationCode}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch detailed scores: ${response.status}`);
        }

        const data: DetailedScoresResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch detailed scores for goal ${goalId}:`, error);
        return null;
    }
};

// Types for SDGs data
interface SDGGoal {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    color: string;
    progress: number;
    target: number;
    programs: number;
    achievements: string[];
    status: "on-track" | "behind" | "ahead" | "not-started";
}

// API response types
interface APISDGGoal {
    goals: number;
    title: string;
    image: string;
    score: number;
}

interface SDGsApiResponse {
    average: string;
    data: APISDGGoal[];
    total_desa: number;
}

// Detailed score types
interface DetailedScoreItem {
    no: string;
    name: string;
    score: number | string;
    recommendation: string;
    bnba: number | string;
    unit: string;
}

interface DetailedScoresResponse {
    target: unknown[];
    header: unknown[];
    recom: DetailedScoreItem[];
}

interface SDGsDashboardProps {
    className?: string;
    showProgress?: boolean;
    showDetails?: boolean;
    showCharts?: boolean;
    interactive?: boolean;
    compact?: boolean;
    onGoalClick?: (goal: SDGGoal) => void;
}

// Status colors
const STATUS_COLORS = {
    "on-track": "#10B981",
    behind: "#F59E0B",
    ahead: "#3B82F6",
    "not-started": "#6B7280",
};

// Detailed Score Display Component
interface DetailedScoreDisplayProps {
    goal: SDGGoal;
    onClose: () => void;
}

const DetailedScoreDisplay: React.FC<DetailedScoreDisplayProps> = ({ goal, onClose }) => {
    const [detailedScores, setDetailedScores] = React.useState<DetailedScoresResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState<"scores" | "recommendations">("scores");

    React.useEffect(() => {
        const loadDetailedScores = async () => {
            try {
                setLoading(true);
                const data = await fetchDetailedScores(goal.id);
                setDetailedScores(data);
            } catch (error) {
                console.error("Failed to load detailed scores:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDetailedScores();
    }, [goal.id]);

    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    const getStatusColor = (status: SDGGoal["status"]) => {
        switch (status) {
            case "ahead":
                return "text-gray-900 bg-[#c2c9df]";
            case "on-track":
                return "text-blue-600 bg-blue-100";
            case "behind":
                return "text-orange-600 bg-orange-100";
            case "not-started":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getScoreColor = (score: number | string) => {
        const numericScore = typeof score === "string" ? parseFloat(score.replace(",", ".")) : score;
        if (numericScore === 0) return "text-gray-500";
        if (numericScore < 50) return "text-orange-500";
        if (numericScore >= 80) return "text-[#4a5f8c]";
        return "text-blue-500";
    };

    const getScoreBadgeVariant = (score: number | string) => {
        const numericScore = typeof score === "string" ? parseFloat(score.replace(",", ".")) : score;
        if (numericScore === 0) return "secondary";
        if (numericScore < 50) return "destructive";
        if (numericScore >= 80) return "default";
        return "secondary";
    };

    if (loading) {
        return (
            <Card className="border-primary/20">
                <CardContent className="p-8">
                    <div className="flex justify-center items-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Memuat detail skor SDGs...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!detailedScores || !detailedScores.recom || detailedScores.recom.length === 0) {
        return (
            <Card className="border-primary/20">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 relative">
                                <Image src={goal.imageUrl} alt={`SDG ${goal.id}`} fill className="object-contain" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl">
                                    Goal {goal.id}: {goal.title}
                                </CardTitle>
                                <p className="text-gray-600 mt-1">{goal.description}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-gray-100">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-8">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Data detail tidak tersedia untuk tujuan ini</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 relative">
                            <Image src={goal.imageUrl} alt={`SDG ${goal.id}`} fill className="object-contain" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-xl">
                                Goal {goal.id}: {goal.title}
                            </CardTitle>
                            <p className="text-gray-600 mt-1">{goal.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <Badge variant={getScoreBadgeVariant(goal.progress)}>Skor: {goal.progress}%</Badge>
                                <Badge className={cn("text-sm", getStatusColor(goal.status))}>
                                    {goal.status === "ahead" && "Lebih Cepat"}
                                    {goal.status === "on-track" && "On Track"}
                                    {goal.status === "behind" && "Tertinggal"}
                                    {goal.status === "not-started" && "Belum Dimulai"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-gray-100">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "scores" | "recommendations")}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="scores" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Detail Skor
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Rekomendasi
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="mt-6">
                        <div className="space-y-4">
                            <div className="grid gap-4">
                                {detailedScores.recom.map((item, index) => {
                                    const numericScore =
                                        typeof item.score === "string"
                                            ? parseFloat(item.score.replace(",", "."))
                                            : item.score;

                                    return (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.no}
                                                        </Badge>
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" />
                                                            {item.unit !== "-"
                                                                ? `${item.bnba} ${item.unit}`
                                                                : "Tidak ada data"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                                                        {typeof item.score === "string" ? item.score : `${item.score}%`}
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end mt-1">
                                                        {numericScore === 0 ? (
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                        ) : numericScore >= 80 ? (
                                                            <CheckCircle className="h-3 w-3 text-[#4a5f8c]" />
                                                        ) : (
                                                            <AlertCircle className="h-3 w-3 text-orange-500" />
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {numericScore === 0
                                                                ? "Belum Dimulai"
                                                                : numericScore >= 80
                                                                  ? "Sangat Baik"
                                                                  : numericScore >= 50
                                                                    ? "Cukup Baik"
                                                                    : "Perlu Peningkatan"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-6">
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-semibold text-blue-900">Rekomendasi Implementasi</h4>
                                </div>
                                <p className="text-sm text-blue-800 mb-4">
                                    Berdasarkan analisis SDGs, berikut adalah rekomendasi program yang dapat
                                    diimplementasikan:
                                </p>

                                <div className="space-y-3">
                                    {detailedScores.recom
                                        .map((item, index) => {
                                            if (!item.recommendation || item.recommendation.trim() === "") return null;

                                            return (
                                                <div
                                                    key={index}
                                                    className="bg-white rounded-lg p-4 border border-blue-100"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Badge variant="outline" className="text-xs mt-0.5">
                                                            {item.no}
                                                        </Badge>
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-gray-900 mb-2">
                                                                {item.name}
                                                            </h5>
                                                            <div
                                                                className="text-sm text-gray-700 [&_table]:w-full [&_table]:border [&_table]:border-gray-200 [&_table]:rounded-lg [&_table]:overflow-hidden [&_th]:bg-primary [&_th]:text-white [&_th]:p-2 [&_th]:text-center [&_th]:font-semibold [&_td]:p-2 [&_td]:border-t [&_td]:border-gray-200 [&_td]:align-top"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: decodeHtml(item.recommendation),
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                        .filter(Boolean)}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export const SDGsDashboard = React.forwardRef<HTMLDivElement, SDGsDashboardProps>(
    (
        {
            className,
            showProgress = true,
            showDetails = true,
            showCharts = true,
            interactive = true,
            compact = false,
            onGoalClick,
            ...props
        },
        ref
    ) => {
        const [selectedGoal, setSelectedGoal] = React.useState<SDGGoal | null>(null);
        const [currentIndex, setCurrentIndex] = React.useState(0);
        const [sdgsData, setSdgsData] = React.useState<SDGGoal[]>([]);
        const [overallScore, setOverallScore] = React.useState<number>(0);
        const [loading, setLoading] = React.useState(true);

        // Fetch real SDGs data on component mount
        React.useEffect(() => {
            const loadData = async () => {
                try {
                    setLoading(true);
                    const data = await fetchSDGsData();
                    const score = await fetchOverallScore();
                    setSdgsData(data);
                    setOverallScore(score);
                } catch (error) {
                    console.error("Failed to load SDGs data:", error);
                    // Show error state to user
                    setSdgsData([]);
                    setOverallScore(0);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }, []);

        // Use real SDGs goals data
        const filteredGoals = sdgsData;

        // Handle goal click with toggle functionality
        const handleGoalClick = (goal: SDGGoal) => {
            if (interactive) {
                if (selectedGoal?.id === goal.id) {
                    // If clicking the same goal, close the details
                    setSelectedGoal(null);
                } else {
                    // If clicking a different goal, show its details
                    setSelectedGoal(goal);
                    onGoalClick?.(goal);
                }
            }
        };

        // Prepare chart data
        const progressData = sdgsData.map((goal) => ({
            name: `SDG ${goal.id}`,
            progress: goal.progress,
            target: goal.target,
            programs: goal.programs,
            status: goal.status,
        }));

        const statusData = [
            {
                name: "On Track",
                value: sdgsData.filter((g) => g.status === "on-track").length,
                color: STATUS_COLORS["on-track"],
            },
            {
                name: "Behind",
                value: sdgsData.filter((g) => g.status === "behind").length,
                color: STATUS_COLORS["behind"],
            },
            {
                name: "Ahead",
                value: sdgsData.filter((g) => g.status === "ahead").length,
                color: STATUS_COLORS["ahead"],
            },
            {
                name: "Not Started",
                value: sdgsData.filter((g) => g.status === "not-started").length,
                color: STATUS_COLORS["not-started"],
            },
        ];

        const categoryData = [
            { name: "Sosial", value: 65, programs: 8 },
            { name: "Ekonomi", value: 72, programs: 6 },
            { name: "Lingkungan", value: 78, programs: 7 },
            { name: "Infrastruktur", value: 85, programs: 5 },
            { name: "Tata Kelola", value: 79, programs: 6 },
        ];

        // Custom tooltip formatter
        const CustomTooltip = ({
            active,
            payload,
            label,
        }: {
            active?: boolean;
            payload?: Array<{ name: string; value: number; color: string }>;
            label?: string;
        }) => {
            if (active && payload?.length) {
                return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold text-sm">{label}</p>
                        {payload.map((entry, index: number) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}%
                            </p>
                        ))}
                    </div>
                );
            }
            return null;
        };

        // Get status color
        const getStatusColor = (status: SDGGoal["status"]) => {
            switch (status) {
                case "ahead":
                    return "text-gray-900 bg-[#c2c9df]";
                case "on-track":
                    return "text-blue-600 bg-blue-100";
                case "behind":
                    return "text-orange-600 bg-orange-100";
                case "not-started":
                    return "text-gray-600 bg-gray-100";
                default:
                    return "text-gray-600 bg-gray-100";
            }
        };

        // Carousel navigation functions
        const getVisibleItemsCount = () => {
            if (typeof window === "undefined") return 6; // Default to desktop count
            if (window.innerWidth < 768) return 2; // Mobile
            if (window.innerWidth < 1024) return 3; // Tablet
            if (window.innerWidth < 1280) return 4; // Large desktop
            return 6; // Extra large desktop
        };

        const itemsPerSlide = getVisibleItemsCount();
        const maxIndex = Math.max(0, filteredGoals.length - itemsPerSlide);

        const goToPrevious = () => {
            setCurrentIndex(Math.max(0, currentIndex - 1));
        };

        const goToNext = () => {
            setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
        };

        // Adjust current index when window resizes
        React.useEffect(() => {
            const handleResize = () => {
                const visibleCount = getVisibleItemsCount();
                const maxValidIndex = Math.max(0, filteredGoals.length - visibleCount);
                if (currentIndex > maxValidIndex) {
                    setCurrentIndex(maxValidIndex);
                }
            };

            window.addEventListener("resize", handleResize);
            handleResize(); // Check initial state

            return () => window.removeEventListener("resize", handleResize);
        }, [currentIndex, filteredGoals.length, loading]);

        return (
            <div ref={ref} className={cn("w-full space-y-4", className)} {...props}>
                {/* Overall Progress */}
                {showProgress && (
                    <div className="w-full pb-4">
                        <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Skor SDGs</h3>
                        </div>
                        <div className="text-center">
                            <div className="text-6xl font-bold text-primary mb-6">
                                {loading ? "..." : `${overallScore.toFixed(2)}`}
                            </div>
                            <div className="max-w-md mx-auto">
                                <Progress value={loading ? 0 : overallScore} className="h-3 w-full" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                {showCharts && !loading && (
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-secondary">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white !text-white hover:text-[#ddf0ff] transition-colors"
                            >
                                Ringkasan
                            </TabsTrigger>
                            <TabsTrigger
                                value="progress"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white !text-white hover:text-[#ddf0ff] transition-colors"
                            >
                                Progress
                            </TabsTrigger>
                            <TabsTrigger
                                value="status"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white !text-white hover:text-[#ddf0ff] transition-colors"
                            >
                                Status
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="data-[state=active]:bg-primary data-[state=active]:text-white !text-white hover:text-[#ddf0ff] transition-colors"
                            >
                                Kategori
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <PieChart className="h-5 w-5" />
                                            Distribusi Status SDGs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) =>
                                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart className="h-5 w-5" />
                                            Progress per Kategori
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsBarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="progress" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Progress Detail Semua SDGs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RechartsBarChart data={progressData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="progress" fill="#10B981" radius={[8, 8, 0, 0]} />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="status" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Status Implementation SDGs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        {statusData.map((status) => (
                                            <div key={status.name} className="text-center">
                                                <div className="text-2xl font-bold" style={{ color: status.color }}>
                                                    {status.value}
                                                </div>
                                                <div className="text-sm text-gray-600">{status.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="categories" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Analisis per Kategori
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart data={categoryData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#3B82F6"
                                                fill="#3B82F6"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}

                {/* SDGs Goals Carousel */}
                <div className="relative">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="mt-4 text-gray-600">Memuat data SDGs...</p>
                            </div>
                        </div>
                    ) : sdgsData.length === 0 ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <div className="text-red-500 text-4xl mb-4">âš ï¸</div>
                                <p className="text-gray-600">Gagal memuat data SDGs</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Silakan coba lagi nanti atau hubungi administrator
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Navigation Buttons */}
                            {interactive && filteredGoals.length > getVisibleItemsCount() && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        disabled={currentIndex === 0}
                                        className={cn(
                                            "absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 lg:-translate-x-2",
                                            "w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md",
                                            "flex items-center justify-center transition-all duration-200",
                                            "hover:bg-gray-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                                            "hidden md:flex"
                                        )}
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                                    </button>

                                    <button
                                        onClick={goToNext}
                                        disabled={currentIndex >= maxIndex}
                                        className={cn(
                                            "absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 lg:translate-x-2",
                                            "w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md",
                                            "flex items-center justify-center transition-all duration-200",
                                            "hover:bg-gray-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                                            "hidden md:flex"
                                        )}
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-600" />
                                    </button>
                                </>
                            )}

                            {/* Carousel Container */}
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{
                                        transform: `translateX(-${currentIndex * (100 / getVisibleItemsCount())}%)`,
                                    }}
                                >
                                    {filteredGoals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className={cn(
                                                "shrink-0 px-2",
                                                compact ? "w-1/6 lg:w-1/6" : "w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer group rounded-sm border bg-white flex flex-col",
                                                    selectedGoal?.id === goal.id && "bg-sky-100 border-sky-400"
                                                )}
                                                onClick={() => handleGoalClick(goal)}
                                            >
                                                {/* Image Container with fixed aspect ratio - Full Cover */}
                                                <div className="relative w-full aspect-square">
                                                    <Image
                                                        src={goal.imageUrl}
                                                        alt={`SDG ${goal.id}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />

                                                    {/* Status Badge */}
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                                                        <Badge className={cn("text-xs", getStatusColor(goal.status))}>
                                                            {goal.status === "ahead" && "Lebih Cepat"}
                                                            {goal.status === "on-track" && "On Track"}
                                                            {goal.status === "behind" && "Tertinggal"}
                                                            {goal.status === "not-started" && "Belum Dimulai"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Progress Bar Below Image */}
                                                {showProgress && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex justify-between text-xs pl-2 pr-2">
                                                            <span className="text-gray-600 pl-1">Progress</span>
                                                            <span className="font-medium text-gray-900">
                                                                {goal.progress}%
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={goal.progress}
                                                            className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2"
                                                        />
                                                    </div>
                                                )}

                                                {/* Hover Overlay */}
                                                {interactive && (
                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Info className="h-6 w-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Navigation */}
                            {interactive && filteredGoals.length > 2 && (
                                <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
                                    <button
                                        onClick={goToPrevious}
                                        disabled={currentIndex === 0}
                                        className={cn(
                                            "w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm",
                                            "flex items-center justify-center transition-all duration-200",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({
                                            length: Math.ceil(filteredGoals.length / 2), // Total slides for mobile
                                        }).map((_, slideIndex) => {
                                            const targetIndex = slideIndex * 2;
                                            const isActive = Math.floor(currentIndex / 2) === slideIndex;

                                            return (
                                                <button
                                                    key={slideIndex}
                                                    onClick={() => setCurrentIndex(targetIndex)}
                                                    className={cn(
                                                        "w-2 h-2 rounded-full transition-all duration-200",
                                                        isActive ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={goToNext}
                                        disabled={currentIndex >= maxIndex}
                                        className={cn(
                                            "w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm",
                                            "flex items-center justify-center transition-all duration-200",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            )}

                            {/* Desktop Dots */}
                            {interactive && filteredGoals.length > 6 && (
                                <div className="hidden md:flex justify-center items-center gap-2 mt-4">
                                    {Array.from({
                                        length: Math.ceil(filteredGoals.length / 6), // Total slides for desktop
                                    }).map((_, slideIndex) => {
                                        const targetIndex = slideIndex * 6;
                                        const isActive = Math.floor(currentIndex / 6) === slideIndex;

                                        return (
                                            <button
                                                key={slideIndex}
                                                onClick={() => setCurrentIndex(targetIndex)}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-200",
                                                    isActive ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Selected Goal Details */}
                {selectedGoal && showDetails && (
                    <DetailedScoreDisplay goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
                )}
            </div>
        );
    }
);

SDGsDashboard.displayName = "SDGsDashboard";

