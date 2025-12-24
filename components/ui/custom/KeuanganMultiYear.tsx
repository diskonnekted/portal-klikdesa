"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeuanganItem {
    anggaran: string | null;
    realisasi: number;
    persen: number;
    judul: string;
}

interface KeuanganData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            tahun: string;
            pendapatan: { [key: string]: KeuanganItem };
            belanja: { [key: string]: KeuanganItem };
            pelaksanaan: { [key: string]: KeuanganItem };
            laporan: string;
            updated_at: string;
        };
    }>;
}

const fetchKeuanganData = async (tahun: string): Promise<KeuanganData | null> => {
    try {
        const response = await fetch(`/api/keuangan?tahun=${tahun}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch keuangan data: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch keuangan data:", error);
        return null;
    }
};

const formatCurrency = (value: number | string | null): string => {
    if (value === null || value === undefined) return "Rp 0";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num) || num === 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "0,00%";
    return `${new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)}%`;
};

const COLORS = {
    pendapatan: "#10b981", // green
    belanja: "#ef4444", // red
    surplus: "#3b82f6", // blue
    defisit: "#f59e0b", // orange
};

export function KeuanganMultiYear() {
    const [data, setData] = React.useState<{
        [year: string]: {
            pendapatan: number;
            belanja: number;
            surplus: number;
        };
    }>({});
    const [loading, setLoading] = React.useState(true);

    const currentYear = 2025;
    const years = React.useMemo(() => {
        const yearList = [];
        for (let year = 2021; year <= currentYear; year++) {
            yearList.push(year);
        }
        return yearList;
    }, [currentYear]);

    React.useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            const newData: {
                [year: string]: {
                    pendapatan: number;
                    belanja: number;
                    surplus: number;
                };
            } = {};

            for (const year of years) {
                const result = await fetchKeuanganData(year.toString());
                if (result && result.data && result.data.length > 0) {
                    const pelaksanaanArray = Object.values(result.data[0].attributes.pelaksanaan || {});
                    const totalPendapatan = pelaksanaanArray.find((p) => p.judul === "PENDAPATAN");
                    const totalBelanja = pelaksanaanArray.find((p) => p.judul === "BELANJA");
                    const surplus = (totalPendapatan?.realisasi || 0) - (totalBelanja?.realisasi || 0);

                    newData[year] = {
                        pendapatan: totalPendapatan?.realisasi || 0,
                        belanja: totalBelanja?.realisasi || 0,
                        surplus: surplus,
                    };
                }
            }

            setData(newData);
            setLoading(false);
        };

        loadAllData();
    }, [years]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Transform data for charts
    const chartData = years
        .map((year) => {
            const yearData = data[year.toString()];
            if (!yearData) return null;

            return {
                year: year.toString(),
                Pendapatan: yearData.pendapatan / 1000000, // Convert to millions
                Belanja: yearData.belanja / 1000000,
                Surplus: yearData.surplus / 1000000,
                "Surplus %": yearData.pendapatan > 0 ? (yearData.surplus / yearData.pendapatan) * 100 : 0,
            };
        })
        .filter(Boolean);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!chartData || chartData.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                        <p className="font-semibold mb-2">Data tidak tersedia</p>
                        <p className="text-sm">Tidak dapat memuat data keuangan untuk analisis multi-tahun</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Analisis Keuangan Multi-Tahun</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Perbandingan data keuangan dari tahun 2021 hingga {currentYear}
                </p>
            </div>

            {/* Chart 1: Pendapatan vs Belanja Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Perbandingan Pendapatan vs Belanja (2021-{currentYear})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                            <Tooltip
                                formatter={(value: number, name: string) => [formatCurrency(value * 1000000), name]}
                            />
                            <Legend />
                            <Bar dataKey="Pendapatan" fill={COLORS.pendapatan} name="Pendapatan" />
                            <Bar dataKey="Belanja" fill={COLORS.belanja} name="Belanja" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Charts 2 & 3: Combined Line Charts in 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 2: Surplus/Defisit Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Tren Surplus/Defisit (2021-{currentYear})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value * 1000000), "Surplus/Defisit"]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Surplus"
                                    stroke={COLORS.surplus}
                                    strokeWidth={3}
                                    name="Surplus/Defisit"
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 3: Surplus Percentage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Persentase Surplus/Defisit terhadap Pendapatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                                <Tooltip formatter={(value: number) => [formatPercentage(value), "Persentase"]} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Surplus %"
                                    stroke={COLORS.surplus}
                                    strokeWidth={3}
                                    name="Surplus %"
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Rincian Data Keuangan Multi-Tahun
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Tahun</th>
                                    <th className="text-right p-2">Pendapatan</th>
                                    <th className="text-right p-2">Belanja</th>
                                    <th className="text-right p-2">Surplus/Defisit</th>
                                    <th className="text-right p-2">% dari Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((row) => {
                                    const year = row?.year;
                                    const yearData = year ? data[year] : null;
                                    if (!year || !yearData) return null;

                                    const percentage =
                                        yearData.pendapatan > 0 ? (yearData.surplus / yearData.pendapatan) * 100 : 0;

                                    return (
                                        <tr key={year} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-2 font-medium">{year}</td>
                                            <td className="p-2 text-right text-green-700">
                                                {formatCurrency(yearData.pendapatan)}
                                            </td>
                                            <td className="p-2 text-right text-red-700">
                                                {formatCurrency(yearData.belanja)}
                                            </td>
                                            <td
                                                className={`p-2 text-right font-semibold ${
                                                    yearData.surplus >= 0 ? "text-blue-700" : "text-orange-700"
                                                }`}
                                            >
                                                {formatCurrency(Math.abs(yearData.surplus))}
                                                {yearData.surplus < 0 ? " (Defisit)" : ""}
                                            </td>
                                            <td
                                                className={`p-2 text-right ${
                                                    percentage >= 0 ? "text-blue-700" : "text-orange-700"
                                                }`}
                                            >
                                                {formatPercentage(percentage)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">ðŸ“Š Analisis & Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Analisis 5 Tahun:</strong> Data menunjukkan perkembangan keuangan Desa dari
                                tahun 2021 hingga {currentYear}, memberikan gambaran lengkap tentang tren pendapatan,
                                belanja, dan surplus/defisit.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Grafik Perbandingan:</strong> Visualisasi bar chart dan line chart memudahkan
                                identifikasi pola dan tren keuangan dari tahun ke tahun.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Persentase Surplus:</strong> Melihat surplus/defisit sebagai persentase dari
                                pendapatan memberikan gambaran efisiensi pengelolaan keuangan yang lebih akurat.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Transparansi:</strong> data ini dipublikasikan untuk meningkatkan transparansi
                                dan akuntabilitas pengelolaan keuangan Desa kepada masyarakat.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

