import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, Clock } from "lucide-react";
import { Holiday } from "@/hooks/useHolidays";

interface HolidayCardsProps {
    holidays: Holiday[];
    loading?: boolean;
    error?: string | null;
}

export function HolidayCards({ holidays, loading = false, error = null }: HolidayCardsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
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

    const getCardBackground = (jenis: string) => {
        if (jenis.includes("Hari Libur Nasional")) {
            return "bg-gradient-to-br from-red-50 to-orange-50 border-red-200";
        }
        if (jenis.includes("Cuti Bersama")) {
            return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200";
        }
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200";
    };

    const getIconColor = (jenis: string) => {
        if (jenis.includes("Hari Libur Nasional")) return "text-red-600";
        if (jenis.includes("Cuti Bersama")) return "text-blue-600";
        return "text-gray-600";
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Hari Libur Mendatang</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Informasi hari libur nasional dan peringatan penting
        </p>
      </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                            <div className="h-24 bg-gray-200"></div>
                            <CardContent className="p-3 space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Hari Libur Mendatang</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Informasi hari libur nasional dan peringatan penting
                    </p>
                </div>
                <div className="text-center py-12">
                    <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (holidays.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Hari Libur Mendatang</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Informasi hari libur nasional dan peringatan penting
                    </p>
                </div>
                <div className="text-center py-12">
                    <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada hari libur mendatang</p>
                </div>
            </div>
        );
    }

    // Display cards - show all on desktop, limit to 5 on mobile
    const displayHolidays = holidays;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">Hari Libur Mendatang</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Informasi hari libur nasional dan peringatan penting</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {displayHolidays.map((holiday, index) => (
                    <Card
                        key={index}
                        className={`
              overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer
              ${getCardBackground(holiday.jenis)}
            `}
                    >
                        {/* Card Header with Icon and Date */}
                        <div className="relative h-24 p-3 flex flex-col items-center justify-center">
                            <div className={`absolute top-2 right-2 ${getIconColor(holiday.jenis)}`}>
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <Calendar className={`h-6 w-6 mb-1 ${getIconColor(holiday.jenis)}`} />
                            <div className="text-center">
                                <div className="text-xs font-medium text-gray-600">{formatDate(holiday.tanggal)}</div>
                            </div>
                        </div>

                        {/* Card Content */}
                        <CardContent className="p-3 space-y-2">
                            {/* Holiday Name */}
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
                                {holiday.nama_perayaan}
                            </h3>

                            {/* Days Until */}
                            <div className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3 text-primary" />
                                <span className="font-medium text-foreground">{getDaysUntil(holiday.tanggal)}</span>
                            </div>

                            {/* Badge */}
                            <div className="flex items-center justify-center">
                                <Badge
                                    variant={getBadgeVariant(holiday.jenis)}
                                    className="text-xs w-full justify-center"
                                >
                                    {holiday.jenis.includes("Hari Libur Nasional")
                                        ? "Libur Nasional"
                                        : holiday.jenis.includes("Cuti Bersama")
                                          ? "Cuti Bersama"
                                          : "Peringatan"}
                                </Badge>
                            </div>

                            {/* Description - only if space allows */}
                            {holiday.keterangan && (
                                <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{holiday.keterangan}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Show more indicator if there are more holidays */}
            {holidays.length >= 10 && (
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Menampilkan 10 hari libur mendatang dari total yang tersedia
                    </p>
                </div>
            )}
        </div>
    );
}
