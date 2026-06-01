"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    ShieldAlert, 
    User, 
    Mail, 
    Phone, 
    FileText, 
    Upload, 
    ChevronLeft, 
    CheckCircle2, 
    AlertTriangle, 
    Scale, 
    HelpCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/custom/CustomToast";
import { createPengaduanAction } from "@/app/actions/pengaduan";

// Region data for subdistricts and villages in Banjarnegara
import { regionData } from "@/lib/regionsData";

const VIOLATION_CATEGORIES = [
    "Pungutan Liar (Pungli) / Gratifikasi",
    "Korupsi & Penyalahgunaan Anggaran Desa",
    "Ketidakhadiran & Kelalaian Jam Kerja/Tugas",
    "Penyalahgunaan Wewenang & Jabatan",
    "Tindakan Asusila / Pelanggaran Etika Moral",
    "Diskriminasi & Pelayanan Publik Buruk",
    "Lainnya"
];

export default function GadisDesaPage() {
    const kecamatans = Object.keys(regionData);
    
    // Form states
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");
    const [kategori, setKategori] = useState(VIOLATION_CATEGORIES[0]);
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [telepon, setTelepon] = useState("");
    const [pesan, setPesan] = useState("");
    const [fileName, setFileName] = useState("");
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        setSelectedDesa(regionData[kec][0]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nama || !email || !telepon || !pesan) {
            showToast.peringatan("Harap isi semua kolom wajib!");
            return;
        }

        setLoading(true);
        try {
            const lokasi = `${selectedKec}, ${selectedDesa}`;
            const subjek = `Pengaduan Aparatur: ${kategori}`;
            const mockUploadPath = fileName ? `/uploads/identitas_${Date.now()}_${fileName}` : "/uploads/default_ktp.jpg";

            const result = await createPengaduanAction({
                nama,
                email,
                telepon,
                kategori,
                subjek,
                pesan,
                lokasi,
                gambar: mockUploadPath
            });

            if (result.success) {
                setSubmittedTicket(result.tiketId);
                showToast.berhasil("Laporan disiplin berhasil terkirim!");
            } else {
                showToast.terjadiKesalahan();
            }
        } catch (error) {
            console.error(error);
            showToast.terjadiKesalahan();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-red-650 hover:text-red-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Scale className="h-5 w-5 text-red-600" />
                            <span className="text-xs font-bold text-red-600 tracking-widest uppercase font-mono">PORTAL DISIPLIN APARATUR</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Penegakkan Disiplin Aparatur Desa (Gadis Desa)
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Layanan pengaduan pelanggaran disiplin, kode etik, dan tindakan pidana oleh perangkat desa se-Kabupaten Banjarnegara
                        </p>
                    </div>
                </div>

                {submittedTicket ? (
                    /* Success State Card */
                    <Card className="border-emerald-200 bg-white shadow-md">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600 animate-bounce" />
                            </div>
                            <CardTitle className="text-2xl text-emerald-800">Laporan Berhasil Diterima</CardTitle>
                            <CardDescription>
                                Terima kasih atas partisipasi Anda dalam mengawasi integritas pelayanan publik desa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 max-w-lg mx-auto">
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-2">
                                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider font-mono">NOMOR TIKET PELACAKAN</span>
                                <span className="text-3xl font-black text-slate-800 tracking-widest font-mono block">
                                    {submittedTicket}
                                </span>
                                <p className="text-xs text-slate-500">
                                    Simpan nomor tiket ini untuk melacak status penanganan laporan Anda oleh Dispermades.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSubmittedTicket(null)}
                                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-sm"
                                >
                                    Buat Laporan Baru
                                </button>
                                <Link
                                    href="/"
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center"
                                >
                                    Selesai
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Form State */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-red-100 bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-red-600" />
                                        Formulir Pengaduan Pelanggaran
                                    </CardTitle>
                                    <CardDescription>
                                        Isi data laporan dengan benar. Identitas Anda dijamin aman & dirahasiakan oleh dinas.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Lokasi Dropdowns */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Kecamatan Aparatur</label>
                                                <select
                                                    value={selectedKec}
                                                    onChange={handleKecChange}
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                >
                                                    {kecamatans.map((kec) => (
                                                        <option key={kec} value={kec}>{kec}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Desa Aparatur</label>
                                                <select
                                                    value={selectedDesa}
                                                    onChange={(e) => setSelectedDesa(e.target.value)}
                                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                >
                                                    {regionData[selectedKec].map((desa) => (
                                                        <option key={desa} value={desa}>{desa}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Kategori Pelanggaran */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Kategori Pelanggaran</label>
                                            <select
                                                value={kategori}
                                                onChange={(e) => setKategori(e.target.value)}
                                                className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            >
                                                {VIOLATION_CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Deskripsi Pelanggaran */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Uraian Kejadian Pelanggaran</label>
                                            <Textarea
                                                placeholder="Jelaskan secara rinci tindakan pelanggaran yang dilakukan oleh aparatur desa, nama jabatan aparatur bersangkutan, serta kronologi waktu kejadian..."
                                                value={pesan}
                                                onChange={(e) => setPesan(e.target.value)}
                                                className="min-h-32 border-slate-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                required
                                            />
                                        </div>

                                        {/* Data Pelapor */}
                                        <div className="border-t border-slate-100 pt-5 space-y-4">
                                            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Identitas Pelapor (Wajib)</span>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-450" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Nama Lengkap Pelapor"
                                                        value={nama}
                                                        onChange={(e) => setNama(e.target.value)}
                                                        className="pl-9 border-slate-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-450" />
                                                    <Input
                                                        type="email"
                                                        placeholder="Alamat Email Aktif"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="pl-9 border-slate-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-450" />
                                                <Input
                                                    type="tel"
                                                    placeholder="Nomor Telepon / WhatsApp Aktif"
                                                    value={telepon}
                                                    onChange={(e) => setTelepon(e.target.value)}
                                                    className="pl-9 border-slate-200 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Upload Identitas */}
                                        <div className="border-t border-slate-100 pt-5">
                                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Upload Kartu Identitas (KTP / Paspor)</label>
                                            <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                                <span className="text-xs font-semibold text-slate-600">
                                                    {fileName ? `File terpilih: ${fileName}` : "Klik atau seret file identitas ke sini"}
                                                </span>
                                                <span className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, PDF (Maks. 5MB)</span>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <Scale className="h-5 w-5" />
                                                    Kirim Laporan Pengaduan
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <Card className="border-red-100 bg-red-50/50">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-red-800 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Informasi Penting & SOP
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3.5 text-xs text-red-900 leading-relaxed">
                                    <p>
                                        <strong>Kerahasiaan Dijamin:</strong> Dispermades PPKB Banjarnegara wajib merahasiakan identitas pelapor (Whistleblower) demi perlindungan hukum.
                                    </p>
                                    <p>
                                        <strong>Objektif & Akurat:</strong> Laporan harus didasari bukti yang valid, bukan fitnah atau tendensi pribadi. Laporan palsu dapat dikenakan sanksi hukum.
                                    </p>
                                    <p>
                                        <strong>Proses Investigasi:</strong> Setiap laporan yang memenuhi unsur pelanggaran akan ditindaklanjuti dengan investigasi lapangan oleh Tim Inspektorat Wilayah dalam 7x24 jam.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 bg-white">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        Butuh Bantuan Lain?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-xs text-slate-500">
                                    <p>Jika Anda mengalami kendala teknis atau membutuhkan bantuan langsung, silakan hubungi kami:</p>
                                    <div className="pt-2 border-t text-slate-700 space-y-1.5">
                                        <p className="font-semibold">Alamat Kantor:</p>
                                        <p className="text-slate-500 leading-normal">Jl. S. Parman No.7, Parakancanggah, Kec. Banjarnegara, Kab. Banjarnegara, Jawa Tengah 53412</p>
                                        <p className="font-semibold pt-1">Hubungi Kami:</p>
                                        <p className="font-mono text-slate-500">Telpon : (0286) 594442</p>
                                        <p className="font-mono text-slate-500">Email : dispermadesppkb@banjarnegarakab.go.id</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
