"use client";

import * as React from "react";
import { Heart, Users, UserCheck, Baby, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HamilData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            jumlah: number;
            laki: number;
            perempuan: number;
            persen?: string;
            persen1?: string;
            persen2?: string;
            no?: string;
        };
    }>;
}

interface HamilDisplayProps {
    className?: string;
}

// Function to fetch Hamil data from API
const fetchHamilData = async (): Promise<HamilData | null> => {
    try {
        const response = await fetch(`/api/statistik/hamil`);

        if (!response.ok) {
            throw new Error(`Failed to fetch hamil data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch hamil data:", error);
        return null;
    }
};

export function HamilDisplay({ className }: HamilDisplayProps) {
    const [data, setData] = React.useState<HamilData | null>(null);
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
                const result = await Promise.race([fetchHamilData(), timeoutPromise]);
                setData(result as HamilData);
            } catch (error) {
                console.error("Failed to load hamil data:", error);
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
                            <Heart className="h-5 w-5 text-primary" />
                            Data Ibu Hamil Desa
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
                            <Heart className="h-5 w-5 text-primary" />
                            Data Ibu Hamil Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data ibu hamil saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Extract data from API response
    const hamilData = data.data.find((item) => item.attributes.nama === "Hamil");
    const tidakHamilData = data.data.find((item) => item.attributes.nama === "Tidak Hamil");
    const jumlahData = data.data.find((item) => item.attributes.nama === "JUMLAH");
    const belumMengisiData = data.data.find((item) => item.attributes.nama === "BELUM MENGISI");
    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Data Ibu Hamil Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistic ibu hamil dan wanita usia subur</p>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Hamil */}
                {hamilData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-pink-100 to-pink-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-pink-600">
                            <Baby className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-pink-800 flex items-center gap-2">
                                <Baby className="h-4 w-4" />
                                Hamil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-pink-900 mb-2">{hamilData.attributes.jumlah}</div>
                            <p className="text-xs text-pink-700">ibu hamil</p>
                            {hamilData.attributes.perempuan > 0 && (
                                <p className="text-xs text-pink-600 mt-1">{hamilData.attributes.perempuan} perempuan</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Tidak Hamil */}
                {tidakHamilData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                            <UserCheck className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Tidak Hamil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 mb-2">
                                {tidakHamilData.attributes.jumlah}
                            </div>
                            <p className="text-xs text-blue-700">wanita tidak hamil</p>
                            {tidakHamilData.attributes.perempuan > 0 && (
                                <p className="text-xs text-blue-600 mt-1">
                                    {tidakHamilData.attributes.perempuan} perempuan
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* JUMLAH */}
                {jumlahData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-emerald-100 to-emerald-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                            <Users className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                JUMLAH
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-emerald-900 mb-2">
                                {jumlahData.attributes.jumlah}
                            </div>
                            <p className="text-xs text-emerald-700">total responden</p>
                            <p className="text-xs text-emerald-600 mt-1">{jumlahData.attributes.persen}</p>
                        </CardContent>
                    </Card>
                )}

                {/* BELUM MENGISI */}
                {belumMengisiData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-amber-100 to-amber-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                            <AlertCircle className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                BELUM MENGISI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-amber-900 mb-2">
                                {belumMengisiData.attributes.jumlah}
                            </div>
                            <p className="text-xs text-amber-700">belum mengisi</p>
                            <p className="text-xs text-amber-600 mt-1">{belumMengisiData.attributes.persen}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* TOTAL */}
            {totalData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            TOTAL
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Population</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <UserCheck className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.perempuan.toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laki-laki</span>
                                    <Baby className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.laki.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Detail Statistik
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data
                            .filter((item) => !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama))
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-semibold text-foreground">{item.attributes.nama}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.attributes.perempuan} perempuan, {item.attributes.laki} laki-laki
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-foreground">{item.attributes.jumlah}</div>
                                        {item.attributes.persen && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.attributes.persen}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

