"use client";

import * as React from "react";
import { BarChart3, Users, UserCheck, UsersRound, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KelasSosialData {
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

interface KelasSosialDisplayProps {
    className?: string;
}

const fetchKelasSosialData = async (): Promise<KelasSosialData | null> => {
    try {
        const response = await fetch(`/api/statistik/kelas-sosial`);
        if (!response.ok) throw new Error(`Failed to fetch kelas-sosial data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch kelas-sosial data:", error);
        return null;
    }
};

export function KelasSosialDisplay({ className }: KelasSosialDisplayProps) {
    const [data, setData] = React.useState<KelasSosialData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchKelasSosialData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                setData(result as KelasSosialData);
            } catch (error) {
                console.error("Failed to load kelas-sosial data:", error);
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
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Data Kelas Sosial Desa
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
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Data Kelas Sosial Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data kelas sosial saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Define the specific social classes we want to display
    const mainClasses = [
        "KELUARGA PRA SEJAHTERA",
        "KELUARGA SEJAHTERA I",
        "KELUARGA SEJAHTERA II",
        "KELUARGA SEJAHTERA III",
        "KELUARGA SEJAHTERA III PLUS",
    ];

    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    // Create display cards for the 5 social classes
    const displayCards = [];

    for (const className of mainClasses) {
        const item = data.data.find((item) => item.attributes.nama === className);
        if (item) {
            displayCards.push(item);
        } else {
            // If not found, create empty card
            displayCards.push({
                id: `empty-${className}`,
                type: "empty",
                attributes: { nama: className, jumlah: 0, laki: 0, perempuan: 0, persen: "0%" },
            });
        }
    }

    const getClassColor = (nama: string, type?: string) => {
        if (type === "empty") return "from-gray-100 to-gray-200";

        // Specific colors for each social class
        switch (nama) {
            case "KELUARGA PRA SEJAHTERA":
                return "from-red-100 to-red-200";
            case "KELUARGA SEJAHTERA I":
                return "from-orange-100 to-orange-200";
            case "KELUARGA SEJAHTERA II":
                return "from-yellow-100 to-yellow-200";
            case "KELUARGA SEJAHTERA III":
                return "from-green-100 to-green-200";
            case "KELUARGA SEJAHTERA III PLUS":
                return "from-blue-100 to-blue-200";
            default:
                return "from-gray-100 to-gray-200";
        }
    };

    const getClassIcon = (nama: string, type?: string) => {
        if (type === "empty") return BarChart3;

        // Specific icons for each social class
        switch (nama) {
            case "KELUARGA PRA SEJAHTERA":
                return Users;
            case "KELUARGA SEJAHTERA I":
                return Users;
            case "KELUARGA SEJAHTERA II":
                return UsersRound;
            case "KELUARGA SEJAHTERA III":
                return UserCheck;
            case "KELUARGA SEJAHTERA III PLUS":
                return UserCheck;
            default:
                return UsersRound;
        }
    };

    const getTextColor = (nama: string, type?: string) => {
        if (type === "empty") return "text-gray";

        // Specific text colors for each social class
        switch (nama) {
            case "KELUARGA PRA SEJAHTERA":
                return "text-red";
            case "KELUARGA SEJAHTERA I":
                return "text-orange";
            case "KELUARGA SEJAHTERA II":
                return "text-yellow";
            case "KELUARGA SEJAHTERA III":
                return "text-green";
            case "KELUARGA SEJAHTERA III PLUS":
                return "text-blue";
            default:
                return "text-gray";
        }
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Data Kelas Sosial Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik kelas sosial keluarga di Desa</p>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayCards.map((card) => {
                    const IconComponent = getClassIcon(card.attributes.nama, card.type);
                    const colorClass = getClassColor(card.attributes.nama, card.type);
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
                                    <span className="line-clamp-2">{card.attributes.nama}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className={`text-3xl font-bold mb-2 ${textColor}-900`}>
                                    {card.attributes.jumlah.toLocaleString("id-ID")}
                                </div>
                                {card.type === "empty" ? (
                                    <p className={`text-xs ${textColor}-600`}>tidak ada data</p>
                                ) : (
                                    <p className={`text-xs ${textColor}-600 mt-1`}>{card.attributes.persen}</p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

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
                                    <span className="font-semibold">Total Keluarga</span>
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Detail Statistik Kelas Sosial
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
                                const IconComponent = getClassIcon(item.attributes.nama);
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

