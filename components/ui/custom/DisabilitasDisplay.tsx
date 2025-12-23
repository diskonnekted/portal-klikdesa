"use client";

import * as React from "react";
import { Accessibility, Users, UserCheck, Heart, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DisabilitasData {
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

interface DisabilitasDisplayProps {
    className?: string;
}

// Function to fetch Disabilitas data from API
const fetchDisabilitasData = async (): Promise<DisabilitasData | null> => {
    try {
        const response = await fetch(`/api/statistik/disabilitas`);

        if (!response.ok) {
            throw new Error(`Failed to fetch disabilitas data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch disabilitas data:", error);
        return null;
    }
};

export function DisabilitasDisplay({ className }: DisabilitasDisplayProps) {
    const [data, setData] = React.useState<DisabilitasData | null>(null);
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
                const result = await Promise.race([fetchDisabilitasData(), timeoutPromise]);
                setData(result as DisabilitasData);
            } catch (error) {
                console.error("Failed to load disabilitas data:", error);
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
                            <Accessibility className="h-5 w-5 text-primary" />
                            Data Disabilitas Desa
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
                            <Accessibility className="h-5 w-5 text-primary" />
                            Data Disabilitas Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data disabilitas saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Extract data from API response and sort by population
    const disabilitasItems = data.data
        .filter(
            (item) => !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama) && item.attributes.jumlah > 0
        )
        .sort((a, b) => b.attributes.jumlah - a.attributes.jumlah);

    // Get top 3 disabilitas
    const top3Disabilitas = disabilitasItems.slice(0, 3);
    const otherDisabilitas = disabilitasItems.slice(3);

    // Calculate "Others" data
    const othersData = otherDisabilitas.reduce(
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
    const displayCards = [...top3Disabilitas];

    // Add "Others" card if there are other disabilitas, or if we have fewer than 3 disabilitas
    if (otherDisabilitas.length > 0) {
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
    } else if (disabilitasItems.length < 3) {
        // If fewer than 3 disabilitas, add empty cards to fill 4 slots
        const remainingSlots = 3 - disabilitasItems.length;
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
    } else if (disabilitasItems.length === 3) {
        // If exactly 3 disabilitas, add a 4th "Info" card
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

    // Get color classes for each disabilitas
    const getDisabilitasColor = (nama: string, type?: string) => {
        if (type === "others") return "from-slate-100 to-slate-200";
        if (type === "info") return "from-cyan-100 to-cyan-200";
        if (type === "empty") return "from-gray-100 to-gray-200";
        return "from-purple-100 to-purple-200";
    };

    const getDisabilitasIcon = (nama: string, type?: string) => {
        if (type === "others") return Users;
        if (type === "info") return BarChart3;
        if (type === "empty") return Accessibility;
        return Accessibility;
    };

    const getTextColor = (nama: string, type?: string) => {
        if (type === "others") return "text-slate";
        if (type === "info") return "text-cyan";
        if (type === "empty") return "text-gray";
        return "text-purple";
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Accessibility className="h-5 w-5 text-primary" />
                        Data Disabilitas Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik disabilitas penduduk Desa</p>
                </CardHeader>
            </Card>

            {/* Summary Cards - Always 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Display Cards */}
                {displayCards.map((card, index) => {
                    const IconComponent = getDisabilitasIcon(card.attributes.nama, card.type);
                    const colorClass = getDisabilitasColor(card.attributes.nama, card.type);
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
                                        <p className={`text-xs ${textColor}-700`}>disabilitas lainnya</p>
                                    </>
                                ) : card.type === "info" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-700`}>total penduduk</p>
                                        <p className={`text-xs ${textColor}-600 mt-1`}>seluruh disabilitas</p>
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
                        Detail Statistik Disabilitas
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
                                const IconComponent = getDisabilitasIcon(item.attributes.nama);
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-primary flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {item.attributes.nama}
                                            </h4>
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
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

