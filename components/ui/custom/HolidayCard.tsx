import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { Holiday } from "@/hooks/useHolidays";

interface HolidayCardProps {
    holidays: Holiday[];
    loading?: boolean;
    error?: string | null;
}

export function HolidayCard({ holidays, loading = false, error = null }: HolidayCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        return date.toLocaleDateString("id-ID", options);
    };

    const getDaysUntil = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const holidayDate = new Date(dateString);
        holidayDate.setHours(0, 0, 0, 0);

        const diffTime = holidayDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hari ini";
        if (diffDays === 1) return "Besok";
        return `${diffDays} hari lagi`;
    };

    const getBadgeVariant = (jenis: string) => {
        if (jenis.includes("Hari Libur Nasional")) return "default";
        if (jenis.includes("Cuti Bersama")) return "secondary";
        return "outline";
    };

    const getTypeIcon = (jenis: string) => {
        if (jenis.includes("Hari Libur Nasional")) return <Sparkles className="h-3 w-3" />;
        return <Calendar className="h-3 w-3" />;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Hari Libur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-start space-x-3 pb-3 border-b last:border-0">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Hari Libur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (holidays.length === 0) {
        return (
            <Card>
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Hari Libur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Tidak ada hari libur mendatang</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="gap-0">
                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Hari Libur
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {holidays.map((holiday, index) => (
                        <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm leading-tight">{holiday.nama_perayaan}</h4>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(holiday.tanggal)}</span>
                                    <span className="text-foreground font-medium">• {getDaysUntil(holiday.tanggal)}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={getBadgeVariant(holiday.jenis)} className="text-xs">
                                        {getTypeIcon(holiday.jenis)}
                                        <span className="ml-1">{holiday.jenis}</span>
                                    </Badge>
                                </div>
                                {holiday.keterangan && (
                                    <p className="text-xs text-gray-600 line-clamp-2">{holiday.keterangan}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
