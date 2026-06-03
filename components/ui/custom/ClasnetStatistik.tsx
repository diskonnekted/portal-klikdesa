"use client";

import React, { useState } from "react";
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

// Data from clasnet.co.id/statistik2.php
const rows = [{"nama_kecamatan":"Kecamatan Banjarmangu","total":"17","with_sid":"17","db_with":"17","berita_update":"11","berita_tidak_update":"6","berita_tidak_ada":"0","pelatihan_sudah":"10","pelatihan_belum":"7"},{"nama_kecamatan":"Kecamatan Banjarnegara","total":"4","with_sid":"1","db_with":"0","berita_update":"0","berita_tidak_update":"0","berita_tidak_ada":"4","pelatihan_sudah":"0","pelatihan_belum":"4"},{"nama_kecamatan":"Kecamatan Batur","total":"8","with_sid":"3","db_with":"3","berita_update":"2","berita_tidak_update":"1","berita_tidak_ada":"5","pelatihan_sudah":"0","pelatihan_belum":"8"},{"nama_kecamatan":"Kecamatan Bawang","total":"18","with_sid":"6","db_with":"2","berita_update":"2","berita_tidak_update":"1","berita_tidak_ada":"15","pelatihan_sudah":"1","pelatihan_belum":"17"},{"nama_kecamatan":"Kecamatan Kalibening","total":"16","with_sid":"5","db_with":"2","berita_update":"0","berita_tidak_update":"4","berita_tidak_ada":"12","pelatihan_sudah":"1","pelatihan_belum":"15"},{"nama_kecamatan":"Kecamatan Karangkobar","total":"13","with_sid":"1","db_with":"1","berita_update":"0","berita_tidak_update":"1","berita_tidak_ada":"12","pelatihan_sudah":"1","pelatihan_belum":"12"},{"nama_kecamatan":"Kecamatan Madukara","total":"18","with_sid":"15","db_with":"14","berita_update":"6","berita_tidak_update":"3","berita_tidak_ada":"9","pelatihan_sudah":"4","pelatihan_belum":"14"},{"nama_kecamatan":"Kecamatan Mandiraja","total":"16","with_sid":"4","db_with":"4","berita_update":"1","berita_tidak_update":"3","berita_tidak_ada":"12","pelatihan_sudah":"1","pelatihan_belum":"15"},{"nama_kecamatan":"Kecamatan Pagedongan","total":"9","with_sid":"1","db_with":"1","berita_update":"0","berita_tidak_update":"1","berita_tidak_ada":"8","pelatihan_sudah":"0","pelatihan_belum":"9"},{"nama_kecamatan":"Kecamatan Pagentan","total":"19","with_sid":"19","db_with":"14","berita_update":"3","berita_tidak_update":"12","berita_tidak_ada":"4","pelatihan_sudah":"2","pelatihan_belum":"17"},{"nama_kecamatan":"Kecamatan Pandanarum","total":"8","with_sid":"8","db_with":"8","berita_update":"1","berita_tidak_update":"7","berita_tidak_ada":"0","pelatihan_sudah":"8","pelatihan_belum":"0"},{"nama_kecamatan":"Kecamatan Pejawaran","total":"17","with_sid":"5","db_with":"4","berita_update":"3","berita_tidak_update":"4","berita_tidak_ada":"10","pelatihan_sudah":"0","pelatihan_belum":"17"},{"nama_kecamatan":"Kecamatan Punggelan","total":"17","with_sid":"17","db_with":"17","berita_update":"5","berita_tidak_update":"12","berita_tidak_ada":"0","pelatihan_sudah":"17","pelatihan_belum":"0"},{"nama_kecamatan":"Kecamatan Purwanegara","total":"13","with_sid":"2","db_with":"2","berita_update":"1","berita_tidak_update":"1","berita_tidak_ada":"11","pelatihan_sudah":"2","pelatihan_belum":"11"},{"nama_kecamatan":"Kecamatan Purwareja Klampok","total":"8","with_sid":"8","db_with":"7","berita_update":"0","berita_tidak_update":"8","berita_tidak_ada":"0","pelatihan_sudah":"8","pelatihan_belum":"0"},{"nama_kecamatan":"Kecamatan Rakit","total":"11","with_sid":"10","db_with":"8","berita_update":"5","berita_tidak_update":"5","berita_tidak_ada":"1","pelatihan_sudah":"0","pelatihan_belum":"11"},{"nama_kecamatan":"Kecamatan Sigaluh","total":"15","with_sid":"13","db_with":"10","berita_update":"3","berita_tidak_update":"5","berita_tidak_ada":"7","pelatihan_sudah":"0","pelatihan_belum":"15"},{"nama_kecamatan":"Kecamatan Susukan","total":"15","with_sid":"15","db_with":"12","berita_update":"1","berita_tidak_update":"14","berita_tidak_ada":"0","pelatihan_sudah":"0","pelatihan_belum":"15"},{"nama_kecamatan":"Kecamatan Wanadadi","total":"11","with_sid":"8","db_with":"4","berita_update":"3","berita_tidak_update":"5","berita_tidak_ada":"3","pelatihan_sudah":"3","pelatihan_belum":"8"},{"nama_kecamatan":"Kecamatan Wanayasa","total":"17","with_sid":"17","db_with":"17","berita_update":"3","berita_tidak_update":"14","berita_tidak_ada":"0","pelatihan_sudah":"17","pelatihan_belum":"0"}];

export function ClasnetStatistik() {
    // Add "Semua Kecamatan" option at the top
    const allRow = rows.reduce((acc, curr) => {
        acc.total += parseInt(curr.total || "0");
        acc.with_sid += parseInt(curr.with_sid || "0");
        acc.db_with += parseInt(curr.db_with || "0");
        acc.berita_update += parseInt(curr.berita_update || "0");
        acc.berita_tidak_update += parseInt(curr.berita_tidak_update || "0");
        acc.berita_tidak_ada += parseInt(curr.berita_tidak_ada || "0");
        acc.pelatihan_sudah += parseInt(curr.pelatihan_sudah || "0");
        acc.pelatihan_belum += parseInt(curr.pelatihan_belum || "0");
        return acc;
    }, {
        nama_kecamatan: "Semua Kecamatan",
        total: 0, with_sid: 0, db_with: 0, berita_update: 0, berita_tidak_update: 0, berita_tidak_ada: 0, pelatihan_sudah: 0, pelatihan_belum: 0
    });

    const [selectedKec, setSelectedKec] = useState<string>("Semua Kecamatan");

    const getActiveRow = () => {
        if (selectedKec === "Semua Kecamatan") return allRow;
        return rows.find(r => r.nama_kecamatan === selectedKec) || allRow;
    };

    const row = getActiveRow();

    // Calculate Data for Pie Charts
    const sidData = [
        { name: "Memiliki SID", value: parseInt(row.with_sid as any) || 0, color: "#10b981" }, // emerald-500
        { name: "Belum Memiliki SID", value: Math.max(0, parseInt(row.total as any) - parseInt(row.with_sid as any)) || 0, color: "#f59e0b" } // amber-500
    ];

    const dbData = [
        { name: "Sudah Ada", value: parseInt(row.db_with as any) || 0, color: "#3b82f6" }, // blue-500
        { name: "Belum Ada", value: Math.max(0, parseInt(row.with_sid as any) - parseInt(row.db_with as any)) || 0, color: "#ef4444" } // red-500
    ];

    const beritaAda = parseInt(row.berita_update as any) + parseInt(row.berita_tidak_update as any);
    const beritaData = [
        { name: "Ada", value: beritaAda || 0, color: "#3b82f6" }, // blue-500
        { name: "Tidak Ada", value: parseInt(row.berita_tidak_ada as any) || 0, color: "#9ca3af" } // gray-400
    ];

    const pelData = [
        { name: "Sudah", value: parseInt(row.pelatihan_sudah as any) || 0, color: "#22c55e" }, // green-500
        { name: "Belum", value: parseInt(row.pelatihan_belum as any) || 0, color: "#ef4444" } // red-500
    ];

    // Prepare Bar Chart Data for all kecamatans
    const barData = rows.map(r => ({
        name: r.nama_kecamatan.replace('Kecamatan ', ''),
        "Memiliki SID": parseInt(r.with_sid),
        "Belum Memiliki SID": Math.max(0, parseInt(r.total) - parseInt(r.with_sid))
    }));

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        if (percent === 0) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
    };

    return (
        <div className="w-full space-y-6 relative z-10">
            {/* Control & Pie Charts */}
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-slate-200/60 p-5 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Statistik Layanan Digital Desa</h3>
                        <p className="text-sm text-slate-500">Cakupan adopsi OpenSID dan pembaharuan website</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-slate-600">Filter Wilayah:</div>
                        <select 
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={selectedKec}
                            onChange={(e) => setSelectedKec(e.target.value)}
                        >
                            <option value="Semua Kecamatan">Semua Kecamatan</option>
                            {rows.map(r => (
                                <option key={r.nama_kecamatan} value={r.nama_kecamatan}>{r.nama_kecamatan}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {/* Pie 1: SID */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-bold text-slate-700 mb-2 text-center h-10 flex items-center">Ketersediaan Website / SID</div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sidData} cx="50%" cy="50%" outerRadius={70} innerRadius={20} dataKey="value" stroke="none" labelLine={false} label={renderCustomLabel}>
                                        {sidData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value} Desa`, "Jumlah"]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie 2: Database */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-bold text-slate-700 mb-2 text-center h-10 flex items-center">Sinkronisasi Database Penduduk</div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dbData} cx="50%" cy="50%" outerRadius={70} innerRadius={20} dataKey="value" stroke="none" labelLine={false} label={renderCustomLabel}>
                                        {dbData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value} Desa`, "Jumlah"]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie 3: Berita */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-bold text-slate-700 mb-2 text-center h-10 flex items-center">Publikasi Berita Desa</div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={beritaData} cx="50%" cy="50%" outerRadius={70} innerRadius={20} dataKey="value" stroke="none" labelLine={false} label={renderCustomLabel}>
                                        {beritaData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value} Desa`, "Jumlah"]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie 4: Pelatihan */}
                    <div className="flex flex-col items-center">
                        <div className="text-sm font-bold text-slate-700 mb-2 text-center h-10 flex items-center">Status Pelatihan Aparatur</div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pelData} cx="50%" cy="50%" outerRadius={70} innerRadius={20} dataKey="value" stroke="none" labelLine={false} label={renderCustomLabel}>
                                        {pelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value} Desa`, "Jumlah"]} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-slate-200/60 p-5">
                <div className="text-sm font-bold text-slate-700 mb-4">Perbandingan Kepemilikan SID per Kecamatan</div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={80} 
                                interval={0} 
                                tick={{fontSize: 10, fill: '#64748b'}} 
                                axisLine={{stroke: '#cbd5e1'}}
                                tickLine={false}
                            />
                            <YAxis 
                                tick={{fontSize: 12, fill: '#64748b'}} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}} 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Memiliki SID" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="Belum Memiliki SID" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
