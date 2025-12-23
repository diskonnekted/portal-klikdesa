"use client";

import * as React from "react";
import { GraduationCap, BookOpen, Users, TrendingUp, User, Calendar, Award, Building } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PendidikanData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            jumlah: number;
            laki: number;
            perempuan: number;
            persen: string;
            persen1: string;
            persen2: string;
        };
    }>;
}

interface PendidikanDisplayProps {
    className?: string;
}

// Function to fetch Pendidikan data from API
const fetchPendidikanData = async (): Promise<PendidikanData | null> => {
    try {
        const response = await fetch(`/api/statistik/pendidikan`);

        if (!response.ok) {
            throw new Error(`Failed to fetch pendidikan data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch pendidikan data:", error);
        return null;
    }
};

export function PendidikanDisplay({ className }: PendidikanDisplayProps) {
    const [data, setData] = React.useState<PendidikanData | null>(null);
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
                const result = await Promise.race([fetchPendidikanData(), timeoutPromise]);
                setData(result as PendidikanData);
            } catch (error) {
                console.error("Failed to load pendidikan data:", error);
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
                            <GraduationCap className="h-5 w-5 text-primary" />
                            Data Pendidikan Desa
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
                            <GraduationCap className="h-5 w-5 text-primary" />
                            Data Pendidikan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data pendidikan saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter out summary rows and get education level data
    const educationData = data.data.filter((item) => item.id !== "666" && item.id !== "777" && item.id !== "888");

    // Get total data from summary rows
    const totalData = data.data.find((item) => item.id === "666" || item.id === "888");
    const totalPopulation = totalData?.attributes.jumlah || 0;

    // Calculate statistics for key education levels
    const noSchool = educationData.find((item) => item.attributes.nama.includes("TIDAK/BELUM SEKOLAH"));
    const elementary = educationData.find((item) => item.attributes.nama.includes("TAMAT SD"));
    const juniorHigh = educationData.find((item) => item.attributes.nama.includes("SLTP"));
    const seniorHigh = educationData.find((item) => item.attributes.nama.includes("SLTA"));
    const university = educationData.find(
        (item) => item.attributes.nama.includes("DIPLOMA IV") || item.attributes.nama.includes("STRATA I")
    );

    // Colors for different education levels
    const getLevelColor = (index: number) => {
        const colors = [
            "from-slate-100 to-slate-200 border-slate-300",
            "from-blue-100 to-blue-200 border-blue-300",
            "from-green-100 to-green-200 border-green-300",
            "from-yellow-100 to-yellow-200 border-yellow-300",
            "from-purple-100 to-purple-200 border-purple-300",
            "from-pink-100 to-pink-200 border-pink-300",
            "from-indigo-100 to-indigo-200 border-indigo-300",
            "from-red-100 to-red-200 border-red-300",
            "from-orange-100 to-orange-200 border-orange-300",
            "from-teal-100 to-teal-200 border-teal-300",
        ];
        return colors[index % colors.length];
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        Data Pendidikan Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Distribusi tingkat pendidikan masyarakat â€¢ Total Populasi: {totalPopulation.toLocaleString()}{" "}
                        jiwa
                    </p>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* No School */}
                <Card className={`relative overflow-hidden bg-linear-to-br ${getLevelColor(0)} border-0`}>
                    <div className="absolute -top-4 -right-4 opacity-10 text-slate-600">
                        <BookOpen className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-slate-800 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Belum/Tidak Sekolah
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-slate-900 mb-2">{noSchool?.attributes.jumlah || 0}</div>
                        <p className="text-xs text-slate-700">{noSchool?.attributes.persen || "0,00%"} dari total</p>
                    </CardContent>
                </Card>

                {/* Elementary */}
                <Card className={`relative overflow-hidden bg-linear-to-br ${getLevelColor(2)} border-0`}>
                    <div className="absolute -top-4 -right-4 opacity-10 text-green-600">
                        <Award className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Tamat SD
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-green-900 mb-2">
                            {elementary?.attributes.jumlah || 0}
                        </div>
                        <p className="text-xs text-green-700">{elementary?.attributes.persen || "0,00%"} dari total</p>
                    </CardContent>
                </Card>

                {/* Junior High */}
                <Card className={`relative overflow-hidden bg-linear-to-br ${getLevelColor(3)} border-0`}>
                    <div className="absolute -top-4 -right-4 opacity-10 text-yellow-600">
                        <Building className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            SLTP
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-yellow-900 mb-2">
                            {juniorHigh?.attributes.jumlah || 0}
                        </div>
                        <p className="text-xs text-yellow-700">{juniorHigh?.attributes.persen || "0,00%"} dari total</p>
                    </CardContent>
                </Card>

                {/* University */}
                <Card className={`relative overflow-hidden bg-linear-to-br ${getLevelColor(4)} border-0`}>
                    <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                        <GraduationCap className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Universitaria
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-purple-900 mb-2">
                            {university?.attributes.jumlah || 0}
                        </div>
                        <p className="text-xs text-purple-700">{university?.attributes.persen || "0,00%"} dari total</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gender Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Distribusi Jenis Kelamin
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {totalData && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laki-laki</span>
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="text-2xl font-bold text-blue-700">{totalData.attributes.laki}</p>
                                <p className="text-sm text-muted-foreground">
                                    {totalData.attributes.persen1} dari total
                                </p>
                            </div>
                        )}

                        {totalData && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <User className="h-5 w-5 text-pink-600" />
                                </div>
                                <p className="text-2xl font-bold text-pink-700">{totalData.attributes.perempuan}</p>
                                <p className="text-sm text-muted-foreground">
                                    {totalData.attributes.persen2} dari total
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Tingkat Pendidikan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">SLTA/Sederajat</span>
                                <Award className="h-5 w-5 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-yellow-700">{seniorHigh?.attributes.jumlah || 0}</p>
                            <p className="text-sm text-muted-foreground">
                                {seniorHigh?.attributes.persen || "0,00%"} dari total
                            </p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Pendidikan Tinggi</span>
                                <GraduationCap className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-700">
                                {(university?.attributes.jumlah || 0) +
                                    (educationData.find((item) => item.attributes.nama.includes("AKADEMI"))?.attributes
                                        .jumlah || 0) +
                                    (educationData.find((item) => item.attributes.nama.includes("DIPLOMA I"))
                                        ?.attributes.jumlah || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Diploma dan Universitas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Education Levels */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Detail Tingkat Pendidikan
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Sebaran lengkap tingkat pendidikan masyarakat menurut data terakhir
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {educationData.map((item, index) => (
                            <div key={item.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-primary">{item.attributes.nama}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">{item.attributes.jumlah}</div>
                                        <div className="text-sm text-muted-foreground">{item.attributes.persen}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-sm text-muted-foreground">Laki-laki</span>
                                        <span className="font-semibold text-blue-700">{item.attributes.laki}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                        <span className="text-sm text-muted-foreground">Perempuan</span>
                                        <span className="font-semibold text-pink-700">{item.attributes.perempuan}</span>
                                    </div>
                                </div>

                                {/* Progress bar showing percentage */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Persentase Populasi</span>
                                        <span>{item.attributes.persen}</span>
                                    </div>
                                    <Progress
                                        value={parseFloat(item.attributes.persen.replace("%", "").replace(",", "."))}
                                        className="h-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

