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
import { TrendingUp, TrendingDown } from "lucide-react";

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

const COLORS = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#6366f1", // indigo
];

export function KeuanganDetailMultiYear() {
    const [data, setData] = React.useState<{
        [year: string]: {
            pendapatan: { [key: string]: KeuanganItem };
            belanja: { [key: string]: KeuanganItem };
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
                    pendapatan: { [key: string]: KeuanganItem };
                    belanja: { [key: string]: KeuanganItem };
                };
            } = {};

            for (const year of years) {
                const result = await fetchKeuanganData(year.toString());
                if (result && result.data && result.data.length > 0) {
                    const attributes = result.data[0].attributes;
                    const filteredPendapatan = Object.fromEntries(
                        Object.entries(attributes.pendapatan).filter(
                            ([, item]) =>
                                item.judul !== "ROW_SPACER" &&
                                item.anggaran !== null &&
                                item.anggaran !== undefined &&
                                item.anggaran !== ""
                        )
                    );

                    const filteredBelanja = Object.fromEntries(
                        Object.entries(attributes.belanja).filter(
                            ([, item]) =>
                                item.judul !== "ROW_SPACER" &&
                                item.anggaran !== null &&
                                item.anggaran !== undefined &&
                                item.anggaran !== ""
                        )
                    );

                    newData[year] = {
                        pendapatan: filteredPendapatan,
                        belanja: filteredBelanja,
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
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Get all unique items across all years
    const getAllItems = (category: "pendapatan" | "belanja") => {
        const allItems = new Set<string>();
        years.forEach((year) => {
            const yearData = data[year.toString()];
            if (yearData && yearData[category]) {
                Object.values(yearData[category]).forEach((item) => {
                    if (item.judul && item.judul !== "ROW_SPACER") {
                        allItems.add(item.judul);
                    }
                });
            }
        });
        return Array.from(allItems);
    };

    const allPendapatanItems = getAllItems("pendapatan");
    const allBelanjaItems = getAllItems("belanja");

    // Transform data for charts
    const transformCategoryData = (category: "pendapatan" | "belanja") => {
        const items = category === "pendapatan" ? allPendapatanItems : allBelanjaItems;

        return items.map((itemName) => {
            const itemData: Record<string, unknown> = { item: itemName };

            years.forEach((year) => {
                const yearData = data[year.toString()];
                if (yearData && yearData[category]) {
                    const foundItem = Object.values(yearData[category]).find((item: { judul?: unknown; realisasi?: number }) => item.judul === itemName);
                    itemData[year] = foundItem ? (foundItem.realisasi || 0) / 1000000 : 0;
                } else {
                    itemData[year] = 0;
                }
            });

            return itemData;
        });
    };

    const pendapatanData = transformCategoryData("pendapatan");
    const belanjaData = transformCategoryData("belanja");

    // Calculate top items by average value
    const getTopItems = (data: Record<string, unknown>[], category: string, limit: number = 5) => {
        return data
            .map((item) => {
                const values = years.map((year) => (item[year] as number) || 0);
                const total = values.reduce((sum, val) => sum + val, 0);
                const average = total / years.length;
                return { ...item, total, average };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    };

    const topPendapatan = getTopItems(pendapatanData, "pendapatan", 5);
    const topBelanja = getTopItems(belanjaData, "belanja", 5);

    // Top 5 Pendapatan with trend line
    const topPendapatanChartData = topPendapatan.map((item) => {
        const chartItem: Record<string, unknown> = { name: (item as unknown as { item: string }).item };
        years.forEach((year) => {
            chartItem[year] = ((item as unknown as Record<number, number>)[year]) || 0;
        });
        return chartItem;
    });

    // Top 5 Belanja with trend line
    const topBelanjaChartData = topBelanja.map((item) => {
        const chartItem: Record<string, unknown> = { name: (item as unknown as { item: string }).item };
        years.forEach((year) => {
            chartItem[year] = ((item as unknown as Record<number, number>)[year]) || 0;
        });
        return chartItem;
    });

    // Transform data for line charts (transpose the data structure)
    const transformForLineChart = (topItems: Record<string, unknown>[]) => {
        return years.map((year) => {
            const yearData: Record<string, unknown> = { year };
            topItems.forEach((item) => {
                yearData[(item as unknown as { item: string }).item] = (item[year] as number) || 0;
            });
            return yearData;
        });
    };

    const pendapatanLineData = transformForLineChart(topPendapatan.slice(0, 3));
    const belanjaLineData = transformForLineChart(topBelanja.slice(0, 3));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Analisis Detail Keuangan Multi-Tahun</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Perbandingan detail item pendapatan dan belanja dari tahun 2021 hingga {currentYear}
                </p>
            </div>

            {/* Top 5 Pendapatan Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Top 5 Item Pendapatan Terbesar (Rata-rata 2021-{currentYear})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={topPendapatanChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                            <Tooltip formatter={(value: number) => [formatCurrency(value * 1000000), "Nilai"]} />
                            <Legend />
                            {years.map((year, index) => (
                                <Bar key={year} dataKey={year} fill={COLORS[index % COLORS.length]} name={year} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top 5 Belanja Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-primary" />
                        Top 5 Item Belanja Terbesar (Rata-rata 2021-{currentYear})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={topBelanjaChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                            <Tooltip formatter={(value: number) => [formatCurrency(value * 1000000), "Nilai"]} />
                            <Legend />
                            {years.map((year, index) => (
                                <Bar key={year} dataKey={year} fill={COLORS[index % COLORS.length]} name={year} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Trend Analysis - 2 Columns Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pendapatan Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Tren Pendapatan (2021-{currentYear})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={pendapatanLineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [formatCurrency(value * 1000000), name]}
                                />
                                <Legend />
                                {topPendapatan.slice(0, 3).map((item, index) => (
                                    <Line
                                        key={(item as unknown as { item: string }).item}
                                        type="monotone"
                                        dataKey={(item as unknown as { item: string }).item}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Belanja Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            Tren Belanja (2021-{currentYear})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={belanjaLineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `Rp ${value.toFixed(0)}M`} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [formatCurrency(value * 1000000), name]}
                                />
                                <Legend />
                                {topBelanja.slice(0, 3).map((item, index) => (
                                    <Line
                                        key={(item as unknown as { item: string }).item}
                                        type="monotone"
                                        dataKey={(item as unknown as { item: string }).item}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Comparison Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pendapatan Detail Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-700">Detail Pendapatan per Tahun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-background">
                                    <tr className="border-b">
                                        <th className="text-left p-2">Item</th>
                                        {years.map((year) => (
                                            <th key={year} className="text-right p-2">
                                                {year}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendapatanData.map((item) => (
                                        <tr key={(item as unknown as { item: string }).item} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-2 font-medium text-green-700">{(item as unknown as { item: string }).item}</td>
                                            {years.map((year) => (
                                                <td key={year} className="p-2 text-right">
                                                    {formatCurrency(((item as unknown as Record<number, number>)[year] || 0) * 1000000)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Belanja Detail Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-700">Detail Belanja per Tahun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-background">
                                    <tr className="border-b">
                                        <th className="text-left p-2">Item</th>
                                        {years.map((year) => (
                                            <th key={year} className="text-right p-2">
                                                {year}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {belanjaData.map((item) => (
                                        <tr key={(item as unknown as { item: string }).item} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-2 font-medium text-red-700">{(item as unknown as { item: string }).item}</td>
                                            {years.map((year) => (
                                                <td key={year} className="p-2 text-right">
                                                    {formatCurrency(((item as unknown as Record<number, number>)[year] || 0) * 1000000)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Summary */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="text-purple-900">ðŸ’¡ Analisis Mendalam</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Top Pendapatan:</strong> Item dengan nilai terbesar dianalisis untuk melihat
                                sumber pendapatan utama Desa dari tahun ke tahun.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Top Belanja:</strong> Identifikasi pos-pos belanja terbesar untuk memahami
                                prioritas penggunaan anggaran desa.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Tren Perubahan:</strong> Grafik line menunjukkan bagaimana setiap item berubah
                                dari tahun ke tahun, membantu identifikasi pola dan trend.
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <p>
                                <strong>Perbandingan Detail:</strong> Tabel menampilkan nilai aktual setiap item per
                                tahun, memberikan Transparansi penuh atas pengelolaan keuangan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

