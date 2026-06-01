"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Building2, Server, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function OpenSIDStatsDisplay() {
    // Stats data mapping from sid.clasnet.co.id
    const stats = {
        total: 270,
        online: 175,
        offline: 95,
        syncDb: 150,
        prosesDb: 120,
        percentage: 65,
    };

    // Chart data 1: Status Website
    const webStatusData = [
        { name: "Website Online", value: stats.online, color: "#10b981" },
        { name: "Website Offline", value: stats.offline, color: "#64748b" },
    ];

    // Chart data 2: Database Sync Status
    const dbStatusData = [
        { name: "Tersinkron", value: stats.syncDb, color: "#8b5cf6" },
        { name: "Proses Sinkronisasi", value: stats.prosesDb, color: "#f59e0b" },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Desa */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-0 gap-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                        <Building2 className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Total Desa OpenSID
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black text-blue-900 mb-2">{stats.total} Desa</div>
                        <Badge className="bg-blue-600/20 text-blue-800 hover:bg-blue-600/30 border-none font-semibold text-xs">
                            Terintegrasi
                        </Badge>
                    </CardContent>
                </Card>

                {/* Website Online */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 border-0 gap-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                        <Server className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            Website Desa Online
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black text-emerald-900 mb-2">{stats.online} Desa</div>
                        <Badge className="bg-emerald-600/20 text-emerald-800 hover:bg-emerald-600/30 border-none font-semibold text-xs">
                            Aktif & Online (UP)
                        </Badge>
                    </CardContent>
                </Card>

                {/* Database Tersinkron */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 border-0 gap-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                        <Users className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-purple-800 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Sinkronisasi OpenData
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black text-purple-900 mb-2">{stats.syncDb} Desa</div>
                        <Badge className="bg-purple-600/20 text-purple-800 hover:bg-purple-600/30 border-none font-semibold text-xs">
                            Portal Kominfo
                        </Badge>
                    </CardContent>
                </Card>

                {/* Rata-rata Integrasi */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 border-0 gap-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                        <Globe className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Persentase Smart Village
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-black text-amber-900 mb-2">{stats.percentage}%</div>
                        <Badge className="bg-amber-600/20 text-amber-800 hover:bg-amber-600/30 border-none font-semibold text-xs">
                            ★ Cukup Baik
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart: Status Website */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-slate-800 font-bold">
                            <Server className="h-5 w-5 text-emerald-600" />
                            Status Konektivitas Website Desa (OpenSID)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                        <div className="w-full h-[300px] flex flex-col justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={webStatusData}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={true}
                                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={90}
                                        dataKey="value"
                                    >
                                        {webStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} Desa`, "Jumlah"]} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart: Status Database */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-slate-800 font-bold">
                            <Users className="h-5 w-5 text-purple-600" />
                            Status Sinkronisasi Database OpenData
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dbStatusData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} Desa`, "Jumlah"]} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {dbStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
