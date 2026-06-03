"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Info, Home, Users, Globe, ShieldCheck, Activity, TrendingUp, BookOpen, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";
import { useOpenDataDesaStunting } from "@/hooks/useOpenDataDesaStunting";
import { opendataConfig } from "@/lib/opendata-config";
import * as turf from "@turf/turf";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function DesaProfileDashboard({ params }: { params: Promise<{ kecamatan: string, nama: string }> }) {
    const { kecamatan, nama } = React.use(params);
    const rawDesaName = nama.replace(/-/g, " ").toLowerCase();
    const rawKecName = kecamatan.replace(/-/g, " ").toLowerCase();
    
    const [villageInfo, setVillageInfo] = useState<any>(null);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [resourceId, setResourceId] = useState<string | null>(null);
    
    // Fetch OpenData
    const { desaStuntingData, desaStuntingHistorical, desaStuntingLoading } = useOpenDataDesaStunting(resourceId);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [geoRes, realRes] = await Promise.all([
                    fetch('/peta_desa.geojson'),
                    fetch('/desa_data.json')
                ]);
                
                const geoData = await geoRes.json();
                const realData = await realRes.json();
                
                const villageFeature = geoData.features.find((f: any) => {
                    const name = f.properties?.Nama_Desa_ || f.properties?.name || "";
                    const kec = f.properties?.Kecamatan || "";
                    const n1 = name.toLowerCase().replace(/desa /g, "").replace(/kelurahan /g, "").trim();
                    const n2 = rawDesaName.replace(/desa /g, "").replace(/kelurahan /g, "").trim();
                    
                    const k1 = kec.toLowerCase().replace(/kecamatan /g, "").replace(/kec\. /g, "").trim();
                    const k2 = rawKecName.replace(/kecamatan /g, "").replace(/kec\. /g, "").trim();
                    return n1 === n2 && k1.includes(k2);
                });

                if (!villageFeature) {
                    console.error("Village not found in geojson");
                    return;
                }

                const filteredGeoJson = {
                    ...geoData,
                    features: [villageFeature]
                };
                setGeoJsonData(filteredGeoJson);

                const bbox = turf.bbox(filteredGeoJson);
                setBounds([
                    [bbox[1], bbox[0]], 
                    [bbox[3], bbox[2]]
                ]);

                const vName = villageFeature.properties?.Nama_Desa_ || villageFeature.properties?.name || "Desa Tidak Diketahui";
                const vKec = villageFeature.properties?.Kecamatan || "Kecamatan Tidak Diketahui";
                
                const mappedResourceId = opendataConfig.getStuntingResourceIdByKecamatan(vKec);
                if (mappedResourceId) setResourceId(mappedResourceId);
                
                const cleanKec = vKec.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toUpperCase();
                const cleanDesa = vName.toUpperCase();
                const upperName = cleanDesa + "_" + cleanKec;
                
                const dbData = realData[upperName] || { isDigital: false, pop: "0", website: null, provider: "Belum Ada" };

                // Mock metrics based on hash
                let hash = 0;
                for (let i = 0; i < upperName.length; i++) hash = upperName.charCodeAt(i) + ((hash << 5) - hash);
                const mockKemiskinan = (Math.abs(hash) % 25) + 10;
                const mockPendidikan = 100 - (Math.abs(hash) % 30);
                const mockKesehatan = 100 - (Math.abs(hash) % 20);

                setVillageInfo({
                    name: vName,
                    kec: vKec,
                    isDigital: dbData.isDigital,
                    pop: dbData.pop,
                    website: dbData.website,
                    provider: dbData.provider,
                    kemiskinan: mockKemiskinan,
                    pendidikan: mockPendidikan,
                    kesehatan: mockKesehatan
                });

            } catch (err) {
                console.error("Gagal memuat data desa", err);
            }
        };

        loadData();
    }, [rawDesaName, rawKecName]);

    const currentDesaStunting = React.useMemo(() => {
        if (!desaStuntingData || !villageInfo) return null;
        const norm = (s: string) => s.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toUpperCase();
        return desaStuntingData.find(d => norm(d["Desa/Kelurahan"]) === norm(villageInfo.name));
    }, [desaStuntingData, villageInfo]);

    const historicalTrend = React.useMemo(() => {
        if (!desaStuntingHistorical || !villageInfo) return [];
        const norm = (s: string) => s.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toUpperCase();
        const matchKey = Object.keys(desaStuntingHistorical).find(k => norm(k) === norm(villageInfo.name));
        if (!matchKey) return [];
        
        const records = desaStuntingHistorical[matchKey];
        return [...records].sort((a, b) => parseInt(a.Tahun || "0") - parseInt(b.Tahun || "0")).map(r => ({
            tahun: r.Tahun,
            balita: parseInt(r["Jumlah Seluruh Balita"] || "0"),
            stunting: parseInt(r["Jumlah Balita Stunting"] || "0"),
            persentase: parseFloat((r["Persentase* (%)"] || "0").replace(',', '.').replace('%', ''))
        })).filter(d => d.balita > 0); // only show years where data is not 0
    }, [desaStuntingHistorical, villageInfo]);

    if (!villageInfo || !geoJsonData) {
        return (
            <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-medium">Memuat Profil Desa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Navigation */}
                <div className="flex items-center gap-4">
                    <Link href={`/kecamatan/${villageInfo.kec.replace(/kec\./i, '').replace(/kecamatan/i, '').trim().replace(/ /g, '-').toLowerCase()}`} className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors border border-slate-200 shrink-0">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200">Profil Desa/Kelurahan</Badge>
                            {villageInfo.isDigital ? (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Globe className="w-3 h-3 mr-1 inline"/> Digital Terintegrasi</Badge>
                            ) : (
                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Belum Digital</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 capitalize">{villageInfo.name.toLowerCase()}</h1>
                        <p className="text-slate-500 font-medium capitalize">{villageInfo.kec.toLowerCase()}, Kabupaten Banjarnegara</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Left Column: Identitas & Metrik Dasar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                            <div className="bg-indigo-600 px-5 py-4">
                                <h2 className="text-white font-bold flex items-center gap-2"><Info className="w-4 h-4"/> Identitas Wilayah</h2>
                            </div>
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Total Penduduk</div>
                                    <div className="text-2xl font-black text-slate-800">{villageInfo.pop} <span className="text-sm font-medium text-slate-500">Jiwa</span></div>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Sistem Desa (SID)</div>
                                    <div className="text-base font-bold text-slate-800">{villageInfo.provider}</div>
                                </div>
                                {villageInfo.website && (
                                    <>
                                        <div className="h-px bg-slate-100"></div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Portal Resmi</div>
                                            <a href={villageInfo.website} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline break-all">
                                                {villageInfo.website}
                                            </a>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Indeks Tambahan */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2 opacity-80"><HeartPulse className="w-4 h-4"/> Indeks Kesehatan</div>
                                    <div className="text-3xl font-black">{villageInfo.kesehatan} <span className="text-lg font-normal">/100</span></div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2 opacity-80"><BookOpen className="w-4 h-4"/> Indeks Pendidikan</div>
                                    <div className="text-3xl font-black">{villageInfo.pendidikan} <span className="text-lg font-normal">/100</span></div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm rounded-xl overflow-hidden lg:col-span-1 col-span-2 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2 opacity-80"><TrendingUp className="w-4 h-4"/> Risiko Keluarga Rentan</div>
                                    <div className="text-3xl font-black">{villageInfo.kemiskinan}%</div>
                                    <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="h-full bg-white" style={{width: `${(villageInfo.kemiskinan/40)*100}%`}}></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Middle Column: Mini Map */}
                    <div className="lg:col-span-1 h-full">
                        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden relative h-[400px] lg:h-full min-h-[400px]">
                            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 pointer-events-none">
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Home className="w-3 h-3"/> Wilayah Teritorial</span>
                            </div>
                            <LeafletMap 
                                sensors={[]} 
                                geoJsonData={geoJsonData}
                                center={[-7.3986, 109.6963]} 
                                onSensorClick={() => {}}
                                bounds={bounds}
                                activeMapLayer="stunting-desa"
                                desaStuntingData={desaStuntingData}
                            />
                        </div>
                    </div>

                    {/* Right Column: OpenData Stats & Trends */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* OpenData Stunting Section */}
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                            <div className="bg-slate-800 px-5 py-4 flex justify-between items-center">
                                <h2 className="text-white font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-red-400"/> Analisis Stunting (OpenData Banjarnegara)</h2>
                                {desaStuntingLoading && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse text-xs text-white" title="Loading..."></span>}
                            </div>
                            <CardContent className="p-0">
                                {currentDesaStunting ? (
                                    <div className="p-6">
                                        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100 flex justify-between items-center gap-3">
                                            <div className="flex items-start gap-3">
                                                <Info className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-red-900 font-medium">Berdasarkan data terkini tahun <strong>{currentDesaStunting.Tahun}</strong>.</p>
                                                    <p className="text-xs text-red-700 mt-1">ID Dataset: <code>{resourceId}</code></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                            <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Balita</div>
                                                <div className="text-4xl font-black text-slate-800">{currentDesaStunting["Jumlah Seluruh Balita"]}</div>
                                            </div>
                                            <div className="bg-red-600 rounded-xl p-4 shadow-md text-center text-white">
                                                <div className="text-xs font-bold text-red-200 uppercase mb-2">Balita Stunting</div>
                                                <div className="text-4xl font-black">{currentDesaStunting["Jumlah Balita Stunting"]}</div>
                                            </div>
                                            <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Prevalensi</div>
                                                <div className="text-4xl font-black text-red-600">{currentDesaStunting["Persentase* (%)"]}</div>
                                            </div>
                                        </div>

                                        {/* Chart Section */}
                                        {historicalTrend.length > 1 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500"/> Tren Perkembangan Tahunan</h3>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={historicalTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                            <XAxis dataKey="tahun" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                                            <Tooltip 
                                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                                itemStyle={{ fontWeight: 'bold' }}
                                                            />
                                                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                                                            <Line type="monotone" name="Kasus Stunting" dataKey="stunting" stroke="#dc2626" strokeWidth={3} activeDot={{ r: 6 }} />
                                                            <Line type="monotone" name="Persentase (%)" dataKey="persentase" stroke="#f59e0b" strokeWidth={3} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : desaStuntingLoading ? (
                                    <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
                                        Memeriksa ketersediaan OpenData...
                                    </div>
                                ) : (
                                    <div className="p-12 text-center space-y-3">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                                            <Activity className="w-8 h-8"/>
                                        </div>
                                        <p className="text-slate-500 font-medium text-lg">Belum Terhubung ke OpenData Stunting</p>
                                        <p className="text-slate-400 text-sm max-w-sm mx-auto">Sistem belum menemukan data stunting spesifik desa ini dari portal OpenData.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
