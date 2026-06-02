"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, Eye, CloudRain, Radio, MapPin, Activity, HardDrive, Compass, Thermometer, Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dynamically import LeafletMap component to avoid hydration errors
const LeafletMap = dynamic(
    () => import("@/components/ui/custom/LeafletMap").then((m) => m.LeafletMap),
    { ssr: false }
);

interface IoTSensor {
    id: string;
    name: string;
    type:
        | "seismic"
        | "water-level"
        | "rainfall"
        | "weather"
        | "air-quality"
        | "ground-tilt"
        | "wind"
        | "temperature"
        | "voltage"
        | "current"
        | "power"
        | "energy"
        | "cost"
        | "humidity";
    lat: number;
    lng: number;
    status: "active" | "inactive" | "warning" | "critical";
    value: number;
    unit: string;
    lastUpdate: string;
    location: string;
    battery: number;
    description: string;
}

interface CCTV {
    name: string;
    status: string;
    desc: string;
    src: string;
    placeholder: string;
}

const CCTVCard = ({ cctv, index }: { cctv: CCTV; index: number }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(true);
    };

    return (
        <Card className="border-slate-850 bg-slate-900 text-slate-100 overflow-hidden shadow-lg transition-all duration-300 hover:border-cyan-900/50">
            <div className="aspect-video bg-black relative group cursor-pointer overflow-hidden" onClick={!isPlaying ? handlePlay : undefined}>
                {!isPlaying ? (
                    <>
                        <img 
                            src={cctv.placeholder} 
                            alt={cctv.name}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 p-4 rounded-full group-hover:bg-cyan-500/30 transition-all duration-300">
                                <Play className="h-8 w-8 text-cyan-400 fill-cyan-400" />
                            </div>
                        </div>
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                            <Activity className="h-3 w-3 text-red-500" /> Live Stream
                        </div>
                    </>
                ) : (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                            </div>
                        )}
                        <iframe 
                            src={`${cctv.src}${cctv.src.includes('?') ? '&' : '?'}autoplay=1`}
                            className="w-full h-full border-0 relative z-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                    </>
                )}
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none z-20">
                    CH: 0{index + 1}
                </div>
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-slate-200">{cctv.name}</h4>
                    <Badge className={`${
                        cctv.status === "SIAGA" ? "bg-amber-900/50 border border-amber-500 text-amber-400" :
                        "bg-emerald-900/50 border border-emerald-500 text-emerald-400"
                    } text-[10px] font-semibold px-2 py-0.5`}>
                        {cctv.status}
                    </Badge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{cctv.desc}</p>
            </CardContent>
        </Card>
    );
};

// Region coordinates map
const villageCoordinates: { [key: string]: { lat: number; lng: number } } = {
    // Banjarmangu
    "Desa Sijenggung": { lat: -7.3917, lng: 109.6124 },
    "Desa Jenggawur": { lat: -7.3995, lng: 109.6200 },
    "Desa Banjarkulon": { lat: -7.3680, lng: 109.6050 },
    "Desa Banjarmangu": { lat: -7.3712, lng: 109.6190 },
    "Desa Beji": { lat: -7.3690, lng: 109.6250 },
    "Desa Gripit": { lat: -7.3550, lng: 109.6420 },
    "Desa Kalilunjar": { lat: -7.3580, lng: 109.6100 },
    "Desa Kendaga": { lat: -7.3820, lng: 109.6010 },
    "Desa Kesenet": { lat: -7.3650, lng: 109.6300 },
    // Purwareja Klampok
    "Desa Klampok": { lat: -7.4589, lng: 109.5211 },
    "Desa Purwareja": { lat: -7.4611, lng: 109.5198 },
    "Desa Kalilandak": { lat: -7.4660, lng: 109.5300 },
    "Desa Kecitran": { lat: -7.4520, lng: 109.5100 },
    "Desa Kalimandi": { lat: -7.4490, lng: 109.5450 },
    "Desa Sirkandi": { lat: -7.4720, lng: 109.5550 },
    // Banjarnegara
    "Desa Ampelsari": { lat: -7.4100, lng: 109.6750 },
    "Desa Cendana": { lat: -7.3880, lng: 109.7200 },
    "Desa Sokayasa": { lat: -7.3950, lng: 109.7020 },
    "Desa Tlagawera": { lat: -7.4050, lng: 109.6950 },
    // Mandiraja
    "Desa Mandiraja Kulon": { lat: -7.4690, lng: 109.5780 },
    "Desa Mandiraja Wetan": { lat: -7.4710, lng: 109.5840 },
    "Desa Kebanaran": { lat: -7.4920, lng: 109.5920 },
    "Desa Somawangi": { lat: -7.4990, lng: 109.5700 }
};

import { regionData } from "@/lib/regionsData";

// Raw list of telemetry sensors in Banjarnegara
const allSensors: IoTSensor[] = [
    {
        id: "EWS-SL-01",
        name: "EWS Longsor Sijenggung",
        type: "ground-tilt",
        lat: -7.3917,
        lng: 109.6124,
        status: "warning",
        value: 1.2,
        unit: "mm",
        lastUpdate: "Baru saja",
        location: "Dusun Sijenggung, Banjarmangu",
        battery: 89,
        description: "Pendeteksi pergerakan kemiringan tanah lereng rawan longsor Dusun Sijenggung."
    },
    {
        id: "EWS-WL-02",
        name: "Sensor Banjir DAS Klampok",
        type: "water-level",
        lat: -7.4589,
        lng: 109.5211,
        status: "active",
        value: 0.85,
        unit: "m",
        lastUpdate: "2 menit lalu",
        location: "Jembatan Klampok, Purwareja Klampok",
        battery: 95,
        description: "Monitoring ketinggian permukaan air sungai dan kecepatan aliran Sungai Klampok."
    },
    {
        id: "EWS-RF-03",
        name: "Rainfall Purwareja",
        type: "rainfall",
        lat: -7.4611,
        lng: 109.5198,
        status: "active",
        value: 12,
        unit: "mm",
        lastUpdate: "5 menit lalu",
        location: "Kantor Kecamatan Purwareja Klampok",
        battery: 84,
        description: "Ombrometer otomatis mencatat curah hujan harian untuk kalkulasi kejenuhan tanah."
    },
    {
        id: "EWS-SM-04",
        name: "Seismograf Karangkobar",
        type: "seismic",
        lat: -7.2844,
        lng: 109.7022,
        status: "active",
        value: 0.05,
        unit: "G",
        lastUpdate: "1 menit lalu",
        location: "Pos Pantau Karangkobar",
        battery: 100,
        description: "Sensor getaran mikro tanah mendeteksi tremor seismik lokal dan aktivitas tebing."
    },
    {
        id: "EWS-WE-05",
        name: "Weather Station Dieng",
        type: "weather",
        lat: -7.2185,
        lng: 109.8144,
        status: "active",
        value: 18,
        unit: "°C",
        lastUpdate: "10 menit lalu",
        location: "Batur, Dataran Tinggi Dieng",
        battery: 92,
        description: "Pemantauan cuaca ekstrem, kecepatan angin, kelembapan udara, dan suhu di zona Dieng."
    },
    {
        id: "EWS-SL-06",
        name: "EWS Longsor Kalilunjar",
        type: "ground-tilt",
        lat: -7.3580,
        lng: 109.6100,
        status: "active",
        value: 0.01,
        unit: "mm",
        lastUpdate: "4 menit lalu",
        location: "Bukit Kalilunjar, Banjarmangu",
        battery: 76,
        description: "Sensor inklinometer memantau stabilitas lereng jalan utama Kecamatan Banjarmangu."
    },
    {
        id: "EWS-SL-07",
        name: "EWS Longsor Kebanaran",
        type: "ground-tilt",
        lat: -7.4920,
        lng: 109.5920,
        status: "active",
        value: 0.15,
        unit: "mm",
        lastUpdate: "3 menit lalu",
        location: "Kebanaran Atas, Mandiraja",
        battery: 90,
        description: "Alat pendeteksi dini ancaman gerakan tanah struktural di area pemukiman perbukitan."
    }
];

export default function BencanaPage() {
    const kecamatans = Object.keys(regionData);
    
    // States
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");
    
    // Center map initialized to Desa Sijenggung
    const [mapCenter, setMapCenter] = useState<[number, number]>([-7.3917, 109.6124]);
    
    // Currently active / viewed sensor on panel
    const [selectedSensor, setSelectedSensor] = useState<IoTSensor>(allSensors[0]);

    // Helper to get coordinates with automatic mathematical fallback centering around Banjarnegara
    const getCoordinates = (desaName: string) => {
        if (villageCoordinates[desaName]) return villageCoordinates[desaName];
        const seed = desaName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            lat: -7.3996 + (seed % 100 - 50) / 1000,
            lng: 109.6974 + (seed % 120 - 60) / 1000
        };
    };

    // Handle Kecamatan change and reset selected Desa
    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        const defaultDesa = regionData[kec][0];
        setSelectedDesa(defaultDesa);
        
        // Move map focus to new village
        const coord = getCoordinates(defaultDesa);
        setMapCenter([coord.lat, coord.lng]);
    };

    // Handle Desa change
    const handleDesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const desa = e.target.value;
        setSelectedDesa(desa);
        
        // Move map focus
        const coord = getCoordinates(desa);
        setMapCenter([coord.lat, coord.lng]);
    };

    // Change map focus when user clicks on a sensor in the sidebar list
    const focusOnSensor = (sensor: IoTSensor) => {
        setSelectedSensor(sensor);
        setMapCenter([sensor.lat, sensor.lng]);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase font-mono">OrionVersa Disaster Engine Active</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                            Ketahanan Bencana & Telemetri
                        </h1>
                        <p className="text-slate-400 mt-1">Sistem Peringatan Dini (EWS), Pemantauan Cuaca, Seismograf & Peta Risiko Kebencanaan Kabupaten Banjarnegara</p>
                    </div>
                    
                    {/* Live Status Badge & External Tool Links */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link 
                            href="https://orionversapro.vercel.app/sungai" 
                            target="_blank"
                            className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition px-4 py-2.5 rounded-xl text-slate-350 text-sm font-semibold hover:text-white"
                        >
                            <Compass className="h-4 w-4 text-cyan-400" />
                            OrionVersa Engine
                        </Link>
                        <div className="flex items-center gap-2 bg-slate-900 border border-cyan-900/30 px-4 py-2.5 rounded-xl text-cyan-400 text-sm font-semibold">
                            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
                            Live BPBD-BMKG Feed Synchronized
                        </div>
                    </div>
                </div>

                {/* Region Filter Selector Card */}
                <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-cyan-400 font-bold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Fokus Area Pemantauan Wilayah
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-xs">
                            Pilih Kecamatan dan Desa untuk memfokuskan peta dan telemetri kebencanaan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400">Pilih Kecamatan</label>
                                <select 
                                    value={selectedKec} 
                                    onChange={handleKecChange}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-hidden"
                                >
                                    {kecamatans.map((kec) => (
                                        <option key={kec} value={kec}>{kec}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400">Pilih Desa</label>
                                <select 
                                    value={selectedDesa} 
                                    onChange={handleDesaChange}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-hidden"
                                >
                                    {regionData[selectedKec]?.map((desa) => (
                                        <option key={desa} value={desa}>{desa}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Alerts & Status Grid */}
                <div id="ews" className="grid grid-cols-1 md:grid-cols-4 gap-6 scroll-mt-28">
                    <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Status EWS Sijenggung</span>
                                <AlertTriangle className="h-5 w-5 text-amber-400 animate-pulse" />
                            </div>
                            <div className="text-2xl font-black text-amber-400">SIAGA</div>
                            <p className="text-xs text-slate-400 mt-1">Pergeseran lereng terdeteksi: 1.2 mm</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Curah Hujan Lokal</span>
                                <CloudRain className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="text-2xl font-black text-cyan-400">12 mm</div>
                            <p className="text-xs text-slate-400 mt-1">Intensitas rendah/gerimis merata</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Kamera Telemetri</span>
                                <Eye className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="text-2xl font-black text-emerald-400">6 Titik Aktif</div>
                            <p className="text-xs text-slate-400 mt-1">Sistem stream CCTV normal</p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Area Risiko Rawan</span>
                                <Activity className="h-5 w-5 text-purple-400" />
                            </div>
                            <div className="text-2xl font-black text-purple-400">4 Zona Utama</div>
                            <p className="text-xs text-slate-400 mt-1">Terpetakan di lereng Banjarnegara</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Interactive Map & Telemetry Dashboard Section */}
                <div id="pemetaan" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-28">
                    
                    {/* Live Telemetry Map */}
                    <Card className="lg:col-span-2 border-slate-800 bg-slate-900/70 text-slate-100 shadow-xl overflow-hidden min-h-[450px] lg:min-h-[550px] flex flex-col">
                        <CardHeader className="border-b border-slate-800 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-cyan-400 font-bold flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Peta Interaktif EWS Banjarnegara
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 text-xs">
                                        Menampilkan visualisasi sebaran stasiun telemetri curah hujan, getaran seismik, ketinggian air & sensor lereng
                                    </CardDescription>
                                </div>
                                <Badge className="bg-cyan-900/50 border border-cyan-800 text-cyan-400 font-mono text-[10px]">
                                    {selectedDesa.toUpperCase()} FOCUS
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative min-h-[350px]">
                            <div className="absolute inset-0 z-10">
                                <LeafletMap 
                                    key={`${mapCenter[0]}-${mapCenter[1]}`}
                                    sensors={allSensors} 
                                    geoJsonData={null} 
                                    center={mapCenter} 
                                    onSensorClick={(sensor) => setSelectedSensor(sensor)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sensor Details Sidebar / HUD Control */}
                    <div className="space-y-6">
                        
                        {/* Selected Sensor Diagnostics Panel */}
                        <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-xl">
                            <CardHeader className="border-b border-slate-800 pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge className={`${
                                        selectedSensor.status === "critical" ? "bg-red-900/50 border border-red-500 text-red-400" :
                                        selectedSensor.status === "warning" ? "bg-amber-900/50 border border-amber-500 text-amber-400" :
                                        "bg-emerald-900/50 border border-emerald-500 text-emerald-400"
                                    } text-[10px] font-mono uppercase px-2 py-0.5`}>
                                        {selectedSensor.status}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-mono">{selectedSensor.id}</span>
                                </div>
                                <CardTitle className="text-base text-slate-100 font-bold mt-2">
                                    {selectedSensor.name}
                                </CardTitle>
                                <CardDescription className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                                    {selectedSensor.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                                        <div className="text-[10px] uppercase text-slate-500 font-semibold font-mono">Nilai Pengukuran</div>
                                        <div className="text-xl font-black text-cyan-400 mt-1 flex items-baseline gap-1">
                                            {selectedSensor.value}
                                            <span className="text-sm font-normal text-slate-400">{selectedSensor.unit}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                                        <div className="text-[10px] uppercase text-slate-500 font-semibold font-mono">Daya Baterai</div>
                                        <div className="text-xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
                                            {selectedSensor.battery}%
                                            <span className="text-[10px] font-normal text-slate-400">Li-Ion</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[10px] uppercase text-slate-500 font-semibold font-mono">Deskripsi Telemetri</div>
                                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
                                        {selectedSensor.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-lg">
                                    <span>Sync Terakhir:</span>
                                    <span className="text-cyan-400">{selectedSensor.lastUpdate}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* List of Telemetry Stations */}
                        <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-xl max-h-[290px] overflow-hidden flex flex-col">
                            <CardHeader className="py-3 border-b border-slate-800 flex-shrink-0">
                                <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Stasiun Sensor Telemetri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 overflow-y-auto flex-1 space-y-1">
                                {allSensors.map((sensor) => (
                                    <button
                                        key={sensor.id}
                                        onClick={() => focusOnSensor(sensor)}
                                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition border ${
                                            selectedSensor.id === sensor.id
                                                ? "bg-slate-800/80 border-cyan-500/40 text-slate-100"
                                                : "bg-transparent border-transparent hover:bg-slate-800/40 text-slate-350"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${
                                                sensor.status === "critical" ? "bg-red-500 animate-pulse" :
                                                sensor.status === "warning" ? "bg-amber-500" :
                                                "bg-emerald-500"
                                            }`}></span>
                                            <div>
                                                <div className="text-xs font-semibold">{sensor.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono">{sensor.id}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-cyan-400 font-bold">
                                            {sensor.value} {sensor.unit}
                                        </div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CCTV Telemetry Pantauan Bencana */}
                <div id="cctv" className="space-y-4 scroll-mt-28">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-cyan-400" />
                        Kamera CCTV Pemantau Kondisi Visual Kerawanan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { 
                                name: "CCTV 01 - Pantauan Gunung Merapi (Official)", 
                                status: "SIAGA", 
                                desc: "Live visual aktivitas vulkanik Gunung Merapi via BPPTKG Badan Geologi.", 
                                src: "https://www.youtube.com/embed/live_stream?channel=UC-lHJZR3Gqxm24_Vd_AJ5Yw",
                                placeholder: "/images/cctv01.jpg"
                            },
                            { 
                                name: "CCTV 02 - Pantauan Merapi (Komunitas)", 
                                status: "SIAGA", 
                                desc: "Monitoring visual 24 jam dengan audio seismogram dari relawan Induk Frekom 86.", 
                                src: "https://www.youtube.com/embed/live_stream?channel=UCUQnHReiTd5_HLXJLOiUObw",
                                placeholder: "/images/cctv02.jpg"
                            },
                            { 
                                name: "CCTV 03 - Pantauan Global (VolcanoYT)", 
                                status: "NORMAL", 
                                desc: "Siaran berkualitas tinggi (4K) memantau aktivitas tektonik dan vulkanik Merapi.", 
                                src: "https://www.youtube.com/embed/live_stream?channel=UCsh_zD7_Nf8iI7b7H9Q_9tg",
                                placeholder: "/images/cctv03.jpg"
                            },
                        ].map((cctv, index) => (
                            <CCTVCard key={cctv.name} cctv={cctv} index={index} />
                        ))}
                    </div>
                </div>

                {/* Evacuation Shelters & Disaster Maps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-slate-800 bg-slate-900/60 text-slate-100 shadow-xl">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-base text-slate-100 font-bold">Rencana Kesiapsiagaan & Evakuasi Terpadu</CardTitle>
                            <CardDescription className="text-slate-400 text-xs">Posko tanggap darurat yang siap menampung warga saat kondisi bahaya aktif</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {[
                                { Shelter: "Posko Utama Desa Jenggawur", capacity: "Kapasitas 350 Jiwa", supply: "Logistik Siaga & Dapur Umum", status: "Aktif" },
                                { Shelter: "Tenda Darurat Lapangan Kecamatan Klampok", capacity: "Kapasitas 500 Jiwa", supply: "Medis & Logistik Lengkap", status: "Aktif" },
                                { Shelter: "Masjid Baitul Makmur, Sleman", capacity: "Kapasitas 150 Jiwa", supply: "Logistik Darurat Mandiri", status: "Siaga" },
                            ].map((shelter) => (
                                <div key={shelter.Shelter} className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-200">{shelter.Shelter}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{shelter.capacity} | Suplai: <span className="text-cyan-400">{shelter.supply}</span></p>
                                    </div>
                                    <Badge className="bg-cyan-900/50 border border-cyan-800 text-cyan-400 text-[10px] font-semibold">{shelter.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60 text-slate-100 shadow-xl flex flex-col justify-between">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-base text-slate-100 font-bold">Prosedur Operasi Standar (SOP)</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-xs leading-relaxed text-slate-350">
                            <p>
                                Panduan tindakan kedaruratan bagi masyarakat lereng apabila terdengar bunyi sirene EWS terus menerus:
                            </p>
                            <ol className="list-decimal pl-4 space-y-2 text-slate-300">
                                <li>Matikan kompor, listrik, dan bawa dokumen penting.</li>
                                <li>Ikuti marka rambu evakuasi hijau menuju titik kumpul terdekat.</li>
                                <li>Segera lapor kepada petugas posko untuk pendataan keluarga.</li>
                                <li>Respon cepat evakuasi diupayakan di bawah 20 menit sejak alarm berbunyi.</li>
                            </ol>
                            <div className="p-3 bg-slate-955 border border-cyan-900/40 rounded-xl flex items-center gap-2 text-cyan-400 text-xs font-semibold mt-1">
                                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                                Teruji: 3 Kali Simulasi Evakuasi Sukses
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

