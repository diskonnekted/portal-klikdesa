"use client";

import * as React from "react";
import { Heart, Users, UserCheck, UserX, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PerkawinanData {
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

interface PerkawinanDisplayProps {
    className?: string;
}

// Function to fetch Perkawinan data from API
const fetchPerkawinanData = async (): Promise<PerkawinanData | null> => {
    try {
        const response = await fetch(`/api/statistik/perkawinan`);

        if (!response.ok) {
            throw new Error(`Failed to fetch perkawinan data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch perkawinan data:", error);
        return null;
    }
};

export function PerkawinanDisplay({ className }: PerkawinanDisplayProps) {
    const [data, setData] = React.useState<PerkawinanData | null>(null);
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
                const result = await Promise.race([fetchPerkawinanData(), timeoutPromise]);
                setData(result as PerkawinanData);
            } catch (error) {
                console.error("Failed to load perkawinan data:", error);
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
                            Data Perkawinan Desa
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
                            Data Perkawinan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data perkawinan saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Extract data from API response
    const belumKawinData = data.data.find((item) => item.attributes.nama === "BELUM KAWIN");
    const kawinData = data.data.find((item) => item.attributes.nama === "KAWIN");
    const ceraiHidupData = data.data.find((item) => item.attributes.nama === "CERAI HIDUP");
    const ceraiMatiData = data.data.find((item) => item.attributes.nama === "CERAI MATI");
    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Data Perkawinan Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik status perkawinan penduduk Desa</p>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* BELUM KAWIN */}
                {belumKawinData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-purple-100 to-purple-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                            <UserX className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                                <UserX className="h-4 w-4" />
                                BELUM KAWIN
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-purple-900 mb-2">
                                {belumKawinData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-xs text-purple-700">belum menikah</p>
                            <p className="text-xs text-purple-600 mt-1">{belumKawinData.attributes.persen}</p>
                        </CardContent>
                    </Card>
                )}

                {/* KAWIN */}
                {kawinData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-pink-100 to-pink-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-pink-600">
                            <Heart className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-pink-800 flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                KAWIN
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-pink-900 mb-2">
                                {kawinData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-xs text-pink-700">sudah menikah</p>
                            <p className="text-xs text-pink-600 mt-1">{kawinData.attributes.persen}</p>
                        </CardContent>
                    </Card>
                )}

                {/* CERAI HIDUP */}
                {ceraiHidupData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-amber-100 to-amber-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                            <UserX className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                                <UserX className="h-4 w-4" />
                                CERAI HIDUP
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-amber-900 mb-2">
                                {ceraiHidupData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-xs text-amber-700">bercerai hidup</p>
                            <p className="text-xs text-amber-600 mt-1">{ceraiHidupData.attributes.persen}</p>
                        </CardContent>
                    </Card>
                )}

                {/* CERAI MATI */}
                {ceraiMatiData && (
                    <Card className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-gray-600">
                            <AlertCircle className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                CERAI MATI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {ceraiMatiData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-xs text-gray-700">bercerai mati</p>
                            <p className="text-xs text-gray-600 mt-1">{ceraiMatiData.attributes.persen}</p>
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
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <UserCheck className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.perempuan.toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laki-laki</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
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
                        Detail Statistik Perkawinan
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
                                        <h4 className="font-semibold text-primary">{item.attributes.nama}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.attributes.perempuan} perempuan, {item.attributes.laki} laki-laki
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {item.attributes.jumlah.toLocaleString("id-ID")}
                                        </div>
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

