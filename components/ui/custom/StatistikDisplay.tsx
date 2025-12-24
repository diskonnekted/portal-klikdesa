"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Users, GraduationCap, UserCheck, BarChart3, PieChart as PieChartIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatistikData {
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

interface StatistikDisplayProps {
    className?: string;
}

// Function to fetch Statistik data from API
const fetchStatistikData = async (): Promise<StatistikData | null> => {
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

export function StatistikDisplay({ className }: StatistikDisplayProps) {
    const [data, setData] = React.useState<StatistikData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchStatistikData(), timeoutPromise]);
                setData(result as StatistikData);
            } catch (error) {
                console.error("Failed to load statistik data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Statistik Penduduk Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Statistik Penduduk Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data statistik saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter out summary rows and get education data
    const educationData = data.data
        .filter(
            (item) =>
                item.attributes.nama &&
                !item.attributes.nama.includes("JUMLAH") &&
                !item.attributes.nama.includes("TOTAL") &&
                !item.attributes.nama.includes("BELUM MENGISI")
        )
        .map((item) => ({
            name: item.attributes.nama,
            jumlah: item.attributes.jumlah,
            laki: item.attributes.laki,
            perempuan: item.attributes.perempuan,
            percentage: parseFloat(item.attributes.persen.replace(",", ".")),
        }))
        .sort((a, b) => b.jumlah - a.jumlah);

    // Get total population
    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");
    const totalPopulation = totalData?.attributes.jumlah || 0;
    const totalLaki = totalData?.attributes.laki || 0;
    const totalPerempuan = totalData?.attributes.perempuan || 0;

    // Colors for charts
    const COLORS = [
        "#3b82f6", // blue
        "#10b981", // emerald
        "#f59e0b", // amber
        "#ef4444", // red
        "#8b5cf6", // violet
        "#ec4899", // pink
        "#14b8a6", // teal
        "#f97316", // orange
        "#6366f1", // indigo
        "#06b6d4", // cyan
    ];

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Statistik Penduduk Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data berdasarkan tingkat pendidikan</p>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Population */}
                <Card className="relative overflow-hidden bg-linear-to-br from-blue-200 to-blue-300 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                        <Users className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Penduduk
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-blue-900 mb-2">
                            {totalPopulation.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-blue-700">jiwa</p>
                    </CardContent>
                </Card>

                {/* Male */}
                <Card className="relative overflow-hidden bg-linear-to-br from-indigo-200 to-indigo-300 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-indigo-600">
                        <UserCheck className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-indigo-800 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Laki-Laki
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-indigo-900 mb-2">
                            {totalLaki.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-indigo-700">
                            {((totalLaki / totalPopulation) * 100).toFixed(1)}% dari total
                        </p>
                    </CardContent>
                </Card>

                {/* Female */}
                <Card className="relative overflow-hidden bg-linear-to-br from-rose-200 to-rose-300 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-rose-600">
                        <UserCheck className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-rose-800 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Perempuan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-rose-900 mb-2">
                            {totalPerempuan.toLocaleString("id-ID")}
                        </div>
                        <p className="text-xs text-rose-700">
                            {((totalPerempuan / totalPopulation) * 100).toFixed(1)}% dari total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Distribusi Penduduk per Tingkat Pendidikan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={educationData} layout="vertical" margin={{ left: 100 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip
                                    formatter={(value: number) => [value.toLocaleString("id-ID"), "Jumlah"]}
                                    labelFormatter={(label) => `Pendidikan: ${label}`}
                                />
                                <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
                                    {educationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Proporsi Penduduk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={educationData}
                                    dataKey="jumlah"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label={(entry) => `${entry.percentage.toFixed(1)}%`}
                                >
                                    {educationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [value.toLocaleString("id-ID"), "Jumlah"]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Detail Statistik Pendidikan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {educationData.map((item, index) => (
                            <div key={index} className="p-4 bg-muted/30 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                                    <Badge variant="secondary">{item.jumlah.toLocaleString("id-ID")} jiwa</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Persentase</span>
                                        <span className="font-medium">{item.percentage.toFixed(2)}%</span>
                                    </div>
                                    <Progress value={item.percentage} className="h-2" />
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Laki-Laki:</span>
                                            <span className="font-medium">{item.laki.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Perempuan:</span>
                                            <span className="font-medium">
                                                {item.perempuan.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

