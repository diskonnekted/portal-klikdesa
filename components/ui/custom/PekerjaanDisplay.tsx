"use client";

import * as React from "react";
import { Briefcase, Users, UserCheck, Wrench, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PekerjaanData {
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

interface PekerjaanDisplayProps {
    className?: string;
}

// Function to fetch Pekerjaan data from API
const fetchPekerjaanData = async (): Promise<PekerjaanData | null> => {
    try {
        const response = await fetch(`/api/statistik/pekerjaan`);

        if (!response.ok) {
            throw new Error(`Failed to fetch pekerjaan data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch pekerjaan data:", error);
        return null;
    }
};

export function PekerjaanDisplay({ className }: PekerjaanDisplayProps) {
    const [data, setData] = React.useState<PekerjaanData | null>(null);
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
                const result = await Promise.race([fetchPekerjaanData(), timeoutPromise]);
                setData(result as PekerjaanData);
            } catch (error) {
                console.error("Failed to load pekerjaan data:", error);
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
                            <Briefcase className="h-5 w-5 text-primary" />
                            Data Pekerjaan Desa
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
                            <Briefcase className="h-5 w-5 text-primary" />
                            Data Pekerjaan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data pekerjaan saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Extract data from API response and sort by population
    const pekerjaanItems = data.data
        .filter(
            (item) => !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama) && item.attributes.jumlah > 0
        )
        .sort((a, b) => b.attributes.jumlah - a.attributes.jumlah);

    // Get top 3 pekerjaan
    const top3Pekerjaan = pekerjaanItems.slice(0, 3);
    const otherPekerjaan = pekerjaanItems.slice(3);

    // Calculate "Others" data
    const othersData = otherPekerjaan.reduce(
        (acc, item) => {
            acc.jumlah += item.attributes.jumlah;
            acc.laki += item.attributes.laki;
            acc.perempuan += item.attributes.perempuan;
            return acc;
        },
        { jumlah: 0, laki: 0, perempuan: 0 }
    );

    // Find TOTAL
    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    // Prepare cards - always show 4 cards
    const displayCards = [...top3Pekerjaan];

    // Add "Others" card if there are other pekerjaan, or if we have fewer than 3 pekerjaan
    if (otherPekerjaan.length > 0) {
        displayCards.push({
            id: "others",
            type: "others",
            attributes: {
                nama: "LAINNYA",
                jumlah: othersData.jumlah,
                laki: othersData.laki,
                perempuan: othersData.perempuan,
                persen:
                    othersData.jumlah > 0
                        ? `${((othersData.jumlah / (totalData?.attributes.jumlah || 1)) * 100).toFixed(1)}%`
                        : "0%",
            },
        });
    } else if (pekerjaanItems.length < 3) {
        // If fewer than 3 pekerjaan, add empty cards to fill 4 slots
        const remainingSlots = 3 - pekerjaanItems.length;
        for (let i = 0; i < remainingSlots; i++) {
            displayCards.push({
                id: `empty-${i}`,
                type: "empty",
                attributes: {
                    nama: "-",
                    jumlah: 0,
                    laki: 0,
                    perempuan: 0,
                    persen: "0%",
                },
            });
        }
    } else if (pekerjaanItems.length === 3) {
        // If exactly 3 pekerjaan, add a 4th "Info" card
        displayCards.push({
            id: "info",
            type: "info",
            attributes: {
                nama: "INFORMASI",
                jumlah: totalData?.attributes.jumlah || 0,
                laki: 0,
                perempuan: 0,
                persen: "100%",
            },
        });
    }

    // Get color classes for each pekerjaan
    const getPekerjaanColor = (nama: string, type?: string) => {
        if (type === "others") return "from-slate-100 to-slate-200";
        if (type === "info") return "from-cyan-100 to-cyan-200";
        if (type === "empty") return "from-gray-100 to-gray-200";

        // Color based on job type
        const colors: { [key: string]: string } = {
            "PEGAWAI SWASTA": "from-blue-100 to-blue-200",
            "PEGAWAI ASN": "from-emerald-100 to-emerald-200",
            PEGAWAIhonorer: "from-teal-100 to-teal-200",
            WIRASWASTA: "from-orange-100 to-orange-200",
            "USAHA/l/remaja": "from-amber-100 to-amber-200",
            PETANI: "from-green-100 to-green-200",
            PETERNAK: "from-lime-100 to-lime-200",
            NELAYAN: "from-cyan-100 to-cyan-200",
            SOPIR: "from-indigo-100 to-indigo-200",
            TUKANG: "from-yellow-100 to-yellow-200",
            BIDAN: "from-pink-100 to-pink-200",
            PERAWAT: "from-rose-100 to-rose-200",
            "BELUM/TIDAK BEKERJA": "from-red-100 to-red-200",
            "PELAJAR/MAHASISWA": "from-emerald-100 to-emerald-200",
            "MENGURUS RUMAH TANGGA": "from-yellow-100 to-yellow-200",
        };
        return colors[nama] || "from-purple-100 to-purple-200";
    };

    const getPekerjaanIcon = (nama: string, type?: string) => {
        if (type === "others") return Users;
        if (type === "info") return BarChart3;
        if (type === "empty") return Briefcase;

        // Icon based on job type
        if (nama.includes("PEGAWAI") || nama.includes("ASN")) return Briefcase;
        if (nama.includes("WIRASWASTA") || nama.includes("USAHA")) return TrendingUp;
        if (nama.includes("PETANI")) return Wrench;
        return Briefcase;
    };

    const getTextColor = (nama: string, type?: string) => {
        if (type === "others") return "text-slate";
        if (type === "info") return "text-cyan";
        if (type === "empty") return "text-gray";
        if (nama.includes("PEGAWAI") || nama.includes("ASN")) return "emerald";
        if (nama.includes("WIRASWASTA") || nama.includes("USAHA")) return "orange";
        if (nama.includes("PETANI")) return "green";
        return "purple";
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Data Pekerjaan Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik pekerjaan penduduk Desa</p>
                </CardHeader>
            </Card>

            {/* Summary Cards - Always 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Display Cards */}
                {displayCards.map((card) => {
                    const IconComponent = getPekerjaanIcon(card.attributes.nama, card.type);
                    const colorClass = getPekerjaanColor(card.attributes.nama, card.type);
                    const textColor = getTextColor(card.attributes.nama, card.type);

                    return (
                        <Card
                            key={card.id}
                            className={`relative overflow-hidden bg-linear-to-br ${colorClass} border-0`}
                        >
                            <div className="absolute -top-4 -right-4 opacity-10">
                                <IconComponent className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className={`text-sm font-medium flex items-center gap-2 ${textColor}-800`}>
                                    <IconComponent className="h-4 w-4" />
                                    {card.attributes.nama}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className={`text-3xl font-bold mb-2 ${textColor}-900`}>
                                    {card.attributes.jumlah.toLocaleString("id-ID")}
                                </div>
                                {card.type === "others" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-700`}>pekerjaan lainnya</p>
                                    </>
                                ) : card.type === "info" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-700`}>total penduduk</p>
                                        <p className={`text-xs ${textColor}-600 mt-1`}>seluruh pekerjaan</p>
                                    </>
                                ) : card.type === "empty" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-600`}>tidak ada data</p>
                                    </>
                                ) : (
                                    <>
                                        <p className={`text-xs ${textColor}-600 mt-1`}>{card.attributes.persen}</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
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
                                    <Users className="h-5 w-5 text-primary" />
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
                        Detail Statistik Pekerjaan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data
                            .filter(
                                (item) =>
                                    !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama) &&
                                    item.attributes.jumlah > 0
                            )
                            .map((item) => {
                                const IconComponent = getPekerjaanIcon(item.attributes.nama);
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                <IconComponent className="h-4 w-4 text-primary" />
                                                {item.attributes.nama}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.attributes.perempuan} perempuan, {item.attributes.laki} laki-laki
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-foreground">
                                                {item.attributes.jumlah.toLocaleString("id-ID")}
                                            </div>
                                            {item.attributes.persen && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {item.attributes.persen}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

