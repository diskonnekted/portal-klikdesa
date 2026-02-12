"use client";

import { useEffect, useState } from "react";
import {
    History,
    Users,
    MapPin,
    Calendar,
    TrendingUp,
    Thermometer,
    Mountain,
    TreePine,
    Building,
    Trophy,
    CloudRain,
    Award,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PegawaiDisplay } from "@/components/ui/custom/PegawaiDisplay";

export default function ProfilPage() {
    const [wilayahTotals, setWilayahTotals] = useState<{ dusun: number; rw: number; rt: number } | null>(null);

    useEffect(() => {
        let isActive = true;
        const fetchWilayahTotals = async () => {
            try {
                const response = await fetch("/api/wilayah");
                if (!response.ok) return;
                const data = (await response.json()) as {
                    data?: Array<{ attributes: { rws_count: number; rts_count: number } }>;
                };
                const wilayahData = data.data ?? [];
                const totals = {
                    dusun: wilayahData.length,
                    rw: wilayahData.reduce((sum, wilayah) => sum + wilayah.attributes.rws_count, 0),
                    rt: wilayahData.reduce((sum, wilayah) => sum + wilayah.attributes.rts_count, 0),
                };
                if (isActive) {
                    setWilayahTotals(totals);
                }
            } catch {
                if (isActive) {
                    setWilayahTotals(null);
                }
            }
        };
        fetchWilayahTotals();
        return () => {
            isActive = false;
        };
    }, []);

    // Real comprehensive data Desa Sijenggung
    const DesaData = {
        // Basic Info
        nama: "Sijenggung",
        kecamatan: "Banjarmangu",
        kabupaten: "Banjarnegara",
        provinsi: "Jawa Tengah",
        tahunSemester: "II/2024",

        // Geography & Climate
        tinggiDaerah: "290 mdpl",
        suhuMax: "30°C",
        suhuMin: "18°C",
        bentukWilayah: "Dataran sampai berombak: 100%",
        jumlahCurahHujan: "3.500 mm/th",
        hariCurahHujan: "160 hari/th",

        batasWilayah: {
            utara: "Desa Sembawa",
            timur: "Desa Beji",
            selatan: "Desa Sipedang",
            barat: "Desa Tlaga",
        },

        jarak: {
            dusunTerjauh: "1 km/jam",
            keKecamatan: "2,5 km; /jam",
            keKabupaten: "10 km; /jam",
            keProvinsi: "20 km; /jam",
        },

        // Desa Categories
        DesaStatus: {
            swadaya: {
                mula: 0,
                madya: 0,
                lanjut: 0,
            },
            swakarsa: {
                mula: 0,
                madya: 0,
                lanjut: 0,
            },
            swasembada: {
                mula: 0,
                madya: 0,
                lanjut: 0,
            },
            idt: 0,
        },

        // Kejuaraan
        kejuaraan: {
            kecamatan: { i: 0, ii: 0, iii: 0 },
            kabupaten: { i: 0, ii: 0, iii: 0 },
            provinsi: { i: 0, ii: 0, iii: 0 },
        },

        // Land Use
        luasTotal: "248.495 Ha",
        tanahSawah: {
            total: "52.5 Ha",
            irigasiTeknis: "32.5 Ha",
            irigasiSetengahTeknis: "55 Ha",
            irigasiSederhana: "7.5 Ha",
            tadahHujan: "10 Ha",
        },
        pekarangan: "102.2696 Ha",
        lapanganOlahraga: "0.5850 Ha",
        kuburan: "2.3600 Ha",
        lainnya: "40.2680 Ha",

        // Government Structure
        government: {
            dusun: 9,
            rw: 20,
            rt: 47,
        },

        // LPMK Data
        lpmk: {
            kategoriI: 1,
            kategoriII: 11,
            kategoriIII: 0,
        },

        // Lurah Info
        lurah: {
            nama: "Suyono",
            jabatan: "Kepala Desa",
            periode: "2020-2026",
            foto: "/uploads/perangkat-desa/kepala-desa-suyono.jpg",
        },

        // Historical Data
        sejarah: {
            maklumat: "Maklumat Gubernur DIY Sri Sultan Hamengkubuwono ke IX",
            nomor: "05",
            tahun: "1948",
            deskripsi:
                "Desa Sijenggung dulunya terbagi menjadi 2 (dua) Desa yaitu Desa Ngentak dan Desa Glagahombo.",
        },
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <Building className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Profil Desa</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Profil lengkap Desa {DesaData.nama}, {DesaData.kecamatan},{" "}
                        {DesaData.kabupaten} - Data komprehensif mengenai geografi, pemerintahan, dan administrasi
                        Desa
                    </p>
                </div>

                {/* Section 1: Leader & Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Lurah Card */}
                    <Card className="md:col-span-2 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Pimpinan Desa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative w-48 h-48 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <Image
                                        src={DesaData.lurah.foto}
                                        alt={DesaData.lurah.nama}
                                        fill
                                        className="object-cover"
                                        sizes="192px"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {DesaData.lurah.nama}
                                    </h2>
                                    <p className="text-xl text-gray-700 mb-3">{DesaData.lurah.jabatan}</p>
                                    <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-800">
                                            Periode {DesaData.lurah.periode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Statistik Cepat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted p-3 rounded-lg text-center">
                                    <h4 className="text-xs font-semibold text-muted-foreground">Luas</h4>
                                    <p className="text-xl font-bold text-foreground">{DesaData.luasTotal}</p>
                                </div>
                                <div className="bg-muted p-3 rounded-lg text-center">
                                    <h4 className="text-xs font-semibold text-muted-foreground">Ketinggian</h4>
                                    <p className="text-xl font-bold text-foreground">{DesaData.tinggiDaerah}</p>
                                </div>
                                <div className="bg-muted p-3 rounded-lg text-center">
                                    <h4 className="text-xs font-semibold text-muted-foreground">Dusun</h4>
                                    <p className="text-xl font-bold text-foreground">
                                        {wilayahTotals?.dusun ?? DesaData.government.dusun}
                                    </p>
                                </div>
                                <div className="bg-muted p-3 rounded-lg text-center">
                                    <h4 className="text-xs font-semibold text-muted-foreground">RW/RT</h4>
                                    <p className="text-xl font-bold text-foreground">
                                        {wilayahTotals?.rw ?? DesaData.government.rw}/
                                        {wilayahTotals?.rt ?? DesaData.government.rt}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Geography & Boundaries */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Geographic Data */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Mountain className="h-4 w-4 text-blue-600" />
                                Geografi & Iklim
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold">Ketinggian</span>
                                    <Mountain className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xl font-bold text-foreground">{DesaData.tinggiDaerah}</p>
                                <p className="text-xs text-muted-foreground">dari permukaan air laut</p>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold">Suhu Udara</span>
                                    <Thermometer className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xl font-bold text-foreground">
                                    {DesaData.suhuMin} - {DesaData.suhuMax}
                                </p>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold">Curah Hujan</span>
                                    <CloudRain className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xl font-bold text-foreground">{DesaData.jumlahCurahHujan}</p>
                                <p className="text-xs text-muted-foreground">
                                    Jumlah hari hujan: {DesaData.hariCurahHujan}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Boundaries */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-4 w-4 text-primary" />
                                Batas Wilayah
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                        <span className="text-sm font-medium">Utara</span>
                                    </div>
                                    <span className="text-sm font-semibold text-right">
                                        {DesaData.batasWilayah.utara}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                        <span className="text-sm font-medium">Timur</span>
                                    </div>
                                    <span className="text-sm font-semibold text-right">
                                        {DesaData.batasWilayah.timur}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                        <span className="text-sm font-medium">Selatan</span>
                                    </div>
                                    <span className="text-sm font-semibold text-right">
                                        {DesaData.batasWilayah.selatan}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                        <span className="text-sm font-medium">Barat</span>
                                    </div>
                                    <span className="text-sm font-semibold text-right">
                                        {DesaData.batasWilayah.barat}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 3: Land Use */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <TreePine className="h-4 w-4 text-green-600" />
                            Luas Daerah/Wilayah Desa
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Total: {DesaData.luasTotal}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid lg:grid-cols-3 gap-4">
                            {/* Tanah Sawah */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary/40 rounded" />
                                    Tanah Sawah
                                </h3>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Irigasi Teknis</span>
                                        <span className="text-sm font-semibold">32.5 Ha</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Irigasi Sederhana</span>
                                        <span className="text-sm font-semibold">7.5 Ha</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Tadah Hujan</span>
                                        <span className="text-sm font-semibold">10 Ha</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/50 rounded-lg border border-primary/20">
                                        <span className="text-xs font-semibold">Total Sawah</span>
                                        <span className="font-bold text-sm text-foreground">52.5 Ha</span>
                                    </div>
                                </div>
                            </div>

                            {/* Penggunaan Lain */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary/40 rounded" />
                                    Penggunaan Lain
                                </h3>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Pekarangan/Bangunan</span>
                                        <span className="text-sm font-semibold">{DesaData.pekarangan}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Lapangan Olahraga</span>
                                        <span className="text-sm font-semibold">{DesaData.lapanganOlahraga}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Kuburan</span>
                                        <span className="text-sm font-semibold">{DesaData.kuburan}</span>
                                    </div>
                                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg">
                                        <span className="text-xs">Lainnya</span>
                                        <span className="text-sm font-semibold">{DesaData.lainnya}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Jarak */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary/40 rounded" />
                                    Jarak Strategis
                                </h3>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary/40 rounded-full" />
                                            <span className="text-sm font-medium">Dusun Terjauh</span>
                                        </div>
                                        <span className="text-sm font-semibold text-right">
                                            {DesaData.jarak.dusunTerjauh}
                                        </span>
                                    </div>
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <h4 className="text-xs font-semibold mb-0.5">Ke Kecamatan</h4>
                                        <p className="text-lg font-bold text-foreground">
                                            {DesaData.jarak.keKecamatan}
                                        </p>
                                    </div>
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <h4 className="text-xs font-semibold mb-0.5">Ke Kabupaten</h4>
                                        <p className="text-lg font-bold text-foreground">
                                            {DesaData.jarak.keKabupaten}
                                        </p>
                                    </div>
                                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                                        <h4 className="text-xs font-semibold mb-0.5">Ke Provinsi</h4>
                                        <p className="text-lg font-bold text-foreground">
                                            {DesaData.jarak.keProvinsi}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Government & LPMK */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Government Structure */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building className="h-4 w-4 text-purple-600" />
                                Struktur Pemerintahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Padukuhan/Dusun</span>
                                <span className="text-xl font-bold text-foreground">
                                    {wilayahTotals?.dusun ?? DesaData.government.dusun}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Rukun Warga (RW)</span>
                                <span className="text-xl font-bold text-foreground">
                                    {wilayahTotals?.rw ?? DesaData.government.rw}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Rukun Tetangga (RT)</span>
                                <span className="text-xl font-bold text-foreground">
                                    {wilayahTotals?.rt ?? DesaData.government.rt}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* LPMK Data */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                                LPMK (Lembaga Pemberdayaan Masyarakat)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Kategori I</span>
                                <span className="text-xl font-bold text-foreground">{DesaData.lpmk.kategoriI}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Kategori II</span>
                                <span className="text-xl font-bold text-foreground">{DesaData.lpmk.kategoriII}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">Kategori III</span>
                                <span className="text-xl font-bold text-muted-foreground">
                                    {DesaData.lpmk.kategoriIII}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 5: Desa Status & Kejuaraan */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Desa Categories */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Award className="h-4 w-4 text-amber-600" />
                                Status Desa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Desa Swadaya</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Mula</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swadaya.mula}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Madya</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swadaya.madya}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Lanjut</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swadaya.lanjut}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Desa Swakarsa</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Mula</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swakarsa.mula}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Madya</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swakarsa.madya}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Lanjut</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swakarsa.lanjut}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Desa Swasembada</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Mula</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swasembada.mula}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Madya</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swasembada.madya}
                                        </p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Lanjut</p>
                                        <p className="text-lg font-bold">
                                            {DesaData.DesaStatus.swasembada.lanjut}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-center p-2 bg-muted/30 rounded-lg">
                                    <p className="text-xs mb-0.5">Desa IDT</p>
                                    <p className="text-xl font-bold text-foreground">
                                        {DesaData.DesaStatus.idt}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kejuaraan Lomba */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                                Kejuaraan Lomba Desa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Tingkat Kecamatan</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara I</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kecamatan.i}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara II</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kecamatan.ii}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara III</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kecamatan.iii}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Tingkat Kabupaten</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara I</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kabupaten.i}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara II</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kabupaten.ii}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara III</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.kabupaten.iii}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-1.5">Tingkat Provinsi</h4>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara I</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.provinsi.i}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara II</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.provinsi.ii}</p>
                                    </div>
                                    <div className="text-center p-1.5 bg-muted/30 rounded">
                                        <p className="text-xs text-muted-foreground">Juara III</p>
                                        <p className="text-lg font-bold">{DesaData.kejuaraan.provinsi.iii}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section 6: Historical Reference */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <History className="h-4 w-4 text-blue-600" />
                            Dasar Pembentukan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/30 border-l-4 border-primary/50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold mb-1.5">{DesaData.sejarah.maklumat}</h3>
                                    <p className="text-xs mb-1.5">
                                        <span className="font-medium">
                                            Nomor: {DesaData.sejarah.nomor} Tahun {DesaData.sejarah.tahun}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 leading-relaxed text-justify mb-4">
                                        Desa Sijenggung adalah salah satu desa di Kecamatan Banjarmangu,
                                        Kabupaten Banjarnegara, Jawa Tengah.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 7: Pegawai & Perangkat Desa */}
                <PegawaiDisplay />
            </div>
        </div>
    );
}

