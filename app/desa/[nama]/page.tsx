"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Info, Home, Users, Globe, ShieldCheck, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";
import { useOpenDataDesaStunting } from "@/hooks/useOpenDataDesaStunting";
import { opendataConfig } from "@/lib/opendata-config";
import * as turf from "@turf/turf";

export default function DesaProfileDashboard({ params }: { params: { nama: string } }) {
    const rawDesaName = params.nama.replace(/-/g, " ").toLowerCase();
    
    // We will extract proper names and metrics once geojson and local data are loaded
    const [villageInfo, setVillageInfo] = useState<any>(null);
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [resourceId, setResourceId] = useState<string | null>(null);
    
    // Fetch OpenData using the resolved resourceId
    const { desaStuntingData, desaStuntingLoading } = useOpenDataDesaStunting(resourceId);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [geoRes, realRes] = await Promise.all([
                    fetch('/peta_desa.geojson'),
                    fetch('/desa_data.json')
                ]);
                
                const geoData = await geoRes.json();
                const realData = await realRes.json();
                
                // 1. Find the specific village in GeoJSON
                const villageFeature = geoData.features.find((f: any) => {
                    const name = f.properties?.Nama_Desa_ || f.properties?.name || "";
                    // normalize string for robust comparison
                    return name.toLowerCase().replace(/desa /g, "").replace(/kelurahan /g, "").trim() === 
                           rawDesaName.replace(/desa /g, "").replace(/kelurahan /g, "").trim();
                });

                if (!villageFeature) {
                    console.error("Village not found in geojson");
                    return;
                }

                // Create a Map with just this village for the Mini Map
                const filteredGeoJson = {
                    ...geoData,
                    features: [villageFeature]
                };
                setGeoJsonData(filteredGeoJson);

                // Calculate bounding box for just this village
                const bbox = turf.bbox(filteredGeoJson);
                setBounds([
                    [bbox[1], bbox[0]], 
                    [bbox[3], bbox[2]]
                ]);

                // 2. Extract Info
                const name = villageFeature.properties?.Nama_Desa_ || villageFeature.properties?.name || "Desa Tidak Diketahui";
                const kec = villageFeature.properties?.Kecamatan || "Kecamatan Tidak Diketahui";
                
                // Lookup OpenData Config
                const mappedResourceId = opendataConfig.getStuntingResourceIdByKecamatan(kec);
                if (mappedResourceId) {
                    setResourceId(mappedResourceId);
                }
                
                // 3. Match with Real Data
                const cleanKec = kec.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toUpperCase();
                const cleanDesa = name.toUpperCase();
                const upperName = cleanDesa + "_" + cleanKec;
                
                const dbData = realData[upperName] || { isDigital: false, pop: "0", website: null, provider: "Belum Ada" };

                // Determine Mock Metrics like main page
                let hash = 0;
                for (let i = 0; i < upperName.length; i++) {
                    hash = upperName.charCodeAt(i) + ((hash << 5) - hash);
                }
                const mockKemiskinan = (Math.abs(hash) % 25) + 10;

                setVillageInfo({
                    name,
                    kec,
                    isDigital: dbData.isDigital,
                    pop: dbData.pop,
                    website: dbData.website,
                    provider: dbData.provider,
                    kemiskinan: mockKemiskinan
                });

            } catch (err) {
                console.error("Gagal memuat data desa", err);
            }
        };

        loadData();
    }, [rawDesaName]);

    // Derived Stunting Data specifically for this village
    const currentDesaStunting = React.useMemo(() => {
        if (!desaStuntingData || !villageInfo) return null;
        const norm = (s: string) => s.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toUpperCase();
        return desaStuntingData.find(d => norm(d["Desa/Kelurahan"]) === norm(villageInfo.name));
    }, [desaStuntingData, villageInfo]);

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
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Navigation */}
                <div className="flex items-center gap-4">
                    <Link href="/kabupaten" className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors border border-slate-200 shrink-0">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200">Profil Tingkat Desa</Badge>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Identitas & Metrik Dasar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                            <div className="bg-indigo-600 px-5 py-4">
                                <h2 className="text-white font-bold flex items-center gap-2"><Info className="w-4 h-4"/> Identitas Wilayah</h2>
                            </div>
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Kecamatan Induk</div>
                                    <Link href={`/kecamatan/${villageInfo.kec.replace(/kec\./i, '').replace(/kecamatan/i, '').trim().replace(/ /g, '-').toLowerCase()}`} className="text-lg font-bold text-indigo-600 hover:underline">
                                        {villageInfo.kec}
                                    </Link>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Total Penduduk</div>
                                    <div className="text-2xl font-black text-slate-800">{villageInfo.pop} <span className="text-sm font-medium text-slate-500">Jiwa</span></div>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Sistem Terintegrasi (SID)</div>
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

                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                            <div className="bg-purple-600 px-5 py-4">
                                <h2 className="text-white font-bold flex items-center gap-2"><Activity className="w-4 h-4"/> Estimasi Kesejahteraan</h2>
                            </div>
                            <CardContent className="p-5">
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Risiko Keluarga Rentan (RTLH)</div>
                                <div className="text-3xl font-black flex items-end gap-1 mb-2">
                                    <span className={villageInfo.kemiskinan > 30 ? 'text-purple-600' : villageInfo.kemiskinan > 20 ? 'text-purple-400' : 'text-slate-600'}>
                                        {villageInfo.kemiskinan}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div className={`h-full ${villageInfo.kemiskinan > 30 ? 'bg-purple-600' : villageInfo.kemiskinan > 20 ? 'bg-purple-400' : 'bg-slate-400'}`} style={{width: `${(villageInfo.kemiskinan/40)*100}%`}}></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Mini Map & OpenData Stats */}
                    <div className="lg:col-span-2 space-y-6 flex flex-col">
                        
                        {/* Peta Mini */}
                        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden relative" style={{ height: "350px" }}>
                            {/* Lapisan Pelindung agar peta tidak bisa di-scroll berlebihan oleh pengguna (Optional tapi bagus untuk profil) */}
                            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 pointer-events-none">
                                <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Home className="w-3 h-3"/> Batas Poligon Desa</span>
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

                        {/* OpenData Stunting Section */}
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden flex-1">
                            <div className="bg-slate-800 px-5 py-4 flex justify-between items-center">
                                <h2 className="text-white font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-red-400"/> Kasus Stunting (OpenData)</h2>
                                {desaStuntingLoading && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse text-xs text-white" title="Loading..."></span>}
                            </div>
                            <CardContent className="p-0">
                                {currentDesaStunting ? (
                                    <div className="p-6">
                                        <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100 flex items-start gap-3">
                                            <Info className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-red-900 font-medium">Dataset Spesifik dari API OpenData Banjarnegara Terdeteksi.</p>
                                                <p className="text-xs text-red-700 mt-1">Tahun Pengukuran: <strong>{currentDesaStunting.Tahun}</strong> | ID Dataset Kecamatan: <strong>{resourceId}</strong></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Balita Terdata</div>
                                                <div className="text-4xl font-black text-slate-800">{currentDesaStunting["Jumlah Seluruh Balita"]}</div>
                                            </div>
                                            <div className="bg-red-600 rounded-xl p-4 shadow-md text-center text-white">
                                                <div className="text-xs font-bold text-red-200 uppercase mb-2">Balita Stunting</div>
                                                <div className="text-4xl font-black">{currentDesaStunting["Jumlah Balita Stunting"]}</div>
                                            </div>
                                            <div className="bg-white border rounded-xl p-4 shadow-sm text-center">
                                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Persentase Prevalensi</div>
                                                <div className="text-4xl font-black text-red-600">{currentDesaStunting["Persentase* (%)"]}</div>
                                            </div>
                                        </div>
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
                                        <p className="text-slate-400 text-sm max-w-sm mx-auto">Sistem belum menemukan Resource ID API OpenData Stunting untuk kecamatan ini di pemetaan konfigurasi kami.</p>
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
