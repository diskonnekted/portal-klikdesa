import * as React from "react";
import { Users, TrendingUp, TrendingDown, Activity, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";

// Types for statistics data
interface StatisticItem {
    id: string;
    title: string;
    value: number;
    unit: string;
    previousValue?: number;
    trend?: "up" | "down" | "stable";
    icon: React.ReactNode;
    color: string;
    change?: number;
    changePercentage?: number;
    source?: string;
}

interface StatistikAPIResponse {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            jumlah: number;
            laki: number;
            perempuan: number;
            persen: string;
            persen1?: string;
            persen2?: string;
        };
    }>;
}

interface StatisticsDisplayProps {
    className?: string;
    showTrends?: boolean;
    compact?: boolean;
    title?: string;
    description?: string;
}

// Function to fetch real statistik data from API
const fetchStatistikData = async (): Promise<StatistikAPIResponse | null> => {
    try {
        const response = await fetch(`/api/statistik/penduduk`);

        if (!response.ok) {
            throw new Error(`Failed to fetch statistik data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch statistik data:", error);
        return null;
    }
};

export const StatisticsDisplay = React.forwardRef<HTMLDivElement, StatisticsDisplayProps>(
    ({ className, showTrends = true, compact = false, title, description }, ref) => {
        const { t } = useTranslation();
        const [statistics, setStatistics] = React.useState<StatisticItem[]>([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const data = await fetchStatistikData();
                    if (data && data.data) {
                        // Extract education data and total population
                        const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");
                        const totalPopulation = totalData?.attributes.jumlah || 0;
                        const totalLaki = totalData?.attributes.laki || 0;
                        const totalPerempuan = totalData?.attributes.perempuan || 0;

                        // Get education level data
                        const educationData = data.data
                            .filter((item) => {
                                const nama = item.attributes.nama;
                                return (
                                    nama &&
                                    !nama.includes("JUMLAH") &&
                                    !nama.includes("TOTAL") &&
                                    !nama.includes("BELUM MENGISI")
                                );
                            })
                            .map((item) => ({
                                id: item.id,
                                nama: item.attributes.nama,
                                jumlah: item.attributes.jumlah,
                                laki: item.attributes.laki,
                                perempuan: item.attributes.perempuan,
                                persentase: parseFloat(item.attributes.persen.replace(",", ".")),
                            }))
                            .sort((a, b) => b.jumlah - a.jumlah);

                        // Find top 4 education levels for display
                        const topEducations = educationData.slice(0, 4);

                        // Calculate difference (people not categorized by gender)
                        const genderDifference = totalPopulation - (totalLaki + totalPerempuan);

                        // Transform to StatisticItem format
                        const transformedStatistics: StatisticItem[] = [
                            {
                                id: "population",
                                title: t("statistik.totalPenduduk") || "Total Penduduk",
                                value: totalPopulation,
                                unit: "jiwa",
                                icon: <Users className="h-5 w-5" />,
                                color: "text-blue-600",
                                source: t("statistik.sumberDukcapil") || "Sistem Administrasi Kependudukan",
                            },
                            {
                                id: "laki-laki",
                                title: "Laki-Laki",
                                value: totalLaki,
                                unit: "jiwa",
                                icon: <Users className="h-5 w-5" />,
                                color: "text-indigo-600",
                                source: `${((totalLaki / totalPopulation) * 100).toFixed(1)}% dari total`,
                            },
                            {
                                id: "perempuan",
                                title: "Perempuan",
                                value: totalPerempuan,
                                unit: "jiwa",
                                icon: <Users className="h-5 w-5" />,
                                color: "text-rose-600",
                                source: `${((totalPerempuan / totalPopulation) * 100).toFixed(1)}% dari total`,
                            },
                            {
                                id: "pendidikan-slta",
                                title: "SLTA/Sederajat",
                                value: topEducations[0]?.jumlah || 0,
                                unit: "jiwa",
                                icon: <GraduationCap className="h-5 w-5" />,
                                color: "text-emerald-600",
                                source: `${topEducations[0]?.persentase.toFixed(1)}% - Jenjang pendidikan tertinggi`,
                            },
                            {
                                id: "pendidikan-sltp",
                                title: "SLTP/Sederajat",
                                value: topEducations[1]?.jumlah || 0,
                                unit: "jiwa",
                                icon: <GraduationCap className="h-5 w-5" />,
                                color: "text-teal-600",
                                source: `${topEducations[1]?.persentase.toFixed(1)}%`,
                            },
                            {
                                id: "pendidikan-sd",
                                title: "Tamat SD/Sederajat",
                                value: topEducations[2]?.jumlah || 0,
                                unit: "jiwa",
                                icon: <GraduationCap className="h-5 w-5" />,
                                color: "text-cyan-600",
                                source: `${topEducations[2]?.persentase.toFixed(1)}%`,
                            },
                            {
                                id: "pendidikan-belum-sekolah",
                                title: "Belum/Tidak Sekolah",
                                value: topEducations[3]?.jumlah || 0,
                                unit: "jiwa",
                                icon: <GraduationCap className="h-5 w-5" />,
                                color: "text-amber-600",
                                source: `${topEducations[3]?.persentase.toFixed(1)}% - Perlu perhatian khusus`,
                            },
                            {
                                id: "gender-difference",
                                title: "Belum Dikategorikan",
                                value: genderDifference,
                                unit: "jiwa",
                                icon: <Users className="h-5 w-5" />,
                                color: "text-gray-500",
                                source: `${((genderDifference / totalPopulation) * 100).toFixed(2)}% dari total - ${t("statistik.sumberDukcapil") || "Data admin"}`,
                            },
                        ];

                        setStatistics(transformedStatistics);
                    }
                } catch (error) {
                    console.error("Error loading statistik data:", error);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }, [t]);

        // Format large numbers
        const formatNumber = (num: number, unit: string) => {
            if (unit === "IDR") {
                return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
            }
            return `${new Intl.NumberFormat("id-ID").format(num)} ${unit}`;
        };

        // Calculate trend color
        const getTrendColor = (trend?: "up" | "down" | "stable") => {
            switch (trend) {
                case "up":
                    return "text-gray-900";
                case "down":
                    return "text-red-600";
                case "stable":
                    return "text-gray-600";
                default:
                    return "text-gray-600";
            }
        };

        if (loading) {
            return (
                <div className={cn("w-full space-y-4", className)}>
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary mb-2">
                            {title || t("statistik.judul") || "Statistik Desa"}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {description ||
                                t("statistik.deskripsi") ||
                                "Data statistik penduduk berdasarkan pendidikan"}
                        </p>
                    </div>
                    {/* Loading Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="p-4">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-8 bg-muted rounded w-1/2"></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div ref={ref} className={cn("w-full space-y-4", className)}>
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary mb-2">{title || t("statistik.judul")}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{description || t("statistik.deskripsi")}</p>
                </div>

                {/* Statistics Grid */}
                <div
                    className={cn(
                        "grid gap-4",
                        compact
                            ? "grid-cols-2 sm:grid-cols-4"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}
                >
                    {statistics.map((stat) => (
                        <Card
                            key={stat.id}
                            className={cn(
                                "relative overflow-hidden transition-all duration-200 hover:shadow-md",
                                compact ? "p-3" : "p-4"
                            )}
                        >
                            <CardHeader className={cn("pb-3", compact ? "p-0" : "p-0")}>
                                <div className="flex items-center justify-between">
                                    <div className={cn("flex items-center gap-3", stat.color)}>
                                        {stat.icon}
                                        <div className="flex-1 min-w-0">
                                            <CardTitle
                                                className={cn(
                                                    "font-medium line-clamp-1",
                                                    compact ? "text-sm" : "text-base"
                                                )}
                                            >
                                                {stat.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className={cn("pt-0", compact ? "p-0" : "p-0")}>
                                {/* Main Value */}
                                <div className="mb-3">
                                    <div className={cn("font-bold", compact ? "text-xl" : "text-3xl")}>
                                        {formatNumber(stat.value, stat.unit)}
                                    </div>
                                </div>

                                {/* Trend Information */}
                                {showTrends && stat.change !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-gray-900" />}
                                            {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                                            {stat.trend === "stable" && <Activity className="h-4 w-4 text-gray-600" />}

                                            <span className={cn("text-sm font-medium", getTrendColor(stat.trend))}>
                                                {stat.changePercentage !== undefined && (
                                                    <>
                                                        {stat.changePercentage > 0 ? "+" : ""}
                                                        {stat.changePercentage.toFixed(1)}%
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Progress Bar for Budget */}
                                        {stat.id === "budget" && stat.previousValue && (
                                            <div className="flex-1 ml-4">
                                                <Progress
                                                    value={(stat.value / (stat.previousValue * 1.2)) * 100}
                                                    className="h-2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Additional Info */}
                                {!compact && stat.source && (
                                    <div className="text-xs text-gray-500 mt-2">
                                        {t("statistik.sumber")}: {stat.source}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
);

StatisticsDisplay.displayName = "StatisticsDisplay";

