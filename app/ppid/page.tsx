"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Calendar, Eye, Download, Shield, Clock, Building, UserCheck, BookOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Fallback loading component
const InformasiPublikDataLoading = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// Fallback error component
const InformasiPublikDataNotAvailable = ({ onRetry }: { onRetry: () => void }) => (
    <Card className="p-8">
        <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data Tidak Tersedia</h3>
                <p className="text-gray-600">Informasi publik sedang tidak dapat dimuat. Silakan coba lagi nanti.</p>
            </div>
            <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
                Coba Lagi
            </Button>
        </div>
    </Card>
);

interface InformasiPublikItem {
    type: string;
    id: string;
    attributes: {
        config_id?: number;
        satuan?: string | null;
        nama?: string;
        enabled?: number;
        tgl_upload?: string;
        id_pend?: number | null;
        kategori?: string;
        attr?: string;
        tipe?: number;
        url?: string | null;
        tahun?: number;
        kategori_info_publik?: number;
        updated_at?: string;
        deleted?: number;
        id_syarat?: number | null;
        id_parent?: number | null;
        created_at?: string;
        created_by?: number | null;
        updated_by?: number | null;
        dok_warga?: number;
        lokasi_arsip?: string;
        keterangan?: string | null;
        status?: string;
        retensi_date?: string | null;
        retensi_number?: string | null;
        retensi_unit?: string | null;
        published_at?: string | null;
        [key: string]: unknown;
    };
}

interface ApiResponse {
    data: InformasiPublikItem[];
    meta?: {
        pagination?: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
    links?: {
        self: string;
        first: string;
        last: string;
    };
}

export default function InformasiPublikPage() {
    const [items, setItems] = useState<InformasiPublikItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<InformasiPublikItem | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/ppid");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data: ApiResponse | InformasiPublikItem[] = await response.json();

            // Handle different response structures
            const itemsArray = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

            setItems(itemsArray);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal memuat data informasi publik");
            setItems([]); // Ensure items is always an array
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories for filter
    const categories = Array.isArray(items)
        ? Array.from(new Set(items.map((item) => item.attributes.kategori || "Lainnya")))
        : [];

    // Filter items
    const filteredItems = Array.isArray(items) ? items.filter((item) => {
        const attrs = item.attributes;
        const title = attrs.nama || "";
        const description = attrs.keterangan || "";
        const matchesSearch =
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());
        const category = attrs.kategori || "Lainnya";
        const matchesCategory = selectedCategory === null || category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) : [];

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getCategoryBadge = (category: string) => {
        const categoryColors: { [key: string]: string } = {
            "Informasi Berkala": "bg-blue-600",
            "Informasi Setiap Saat": "bg-green-600",
            "Informasi Sukarela": "bg-purple-600",
            Lainnya: "bg-gray-600",
        };

        const colorClass = categoryColors[category] || "bg-gray-600";

        return <Badge className={`${colorClass} hover:${colorClass} text-white border-0`}>{category}</Badge>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                            <Shield className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Informasi Publik</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Pejabat Pengelola Informasi dan Dokumentasi (PPID) - Informasi publik yang dapat diakses
                            oleh masyarakat
                        </p>
                    </div>
                    <InformasiPublikDataLoading />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                            <Shield className="h-10 w-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Informasi Publik</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Pejabat Pengelola Informasi dan Dokumentasi (PPID) - Informasi publik yang dapat diakses
                            oleh masyarakat
                        </p>
                    </div>
                    <InformasiPublikDataNotAvailable onRetry={fetchData} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <Shield className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Informasi Publik</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Pejabat Pengelola Informasi dan Dokumentasi (PPID) - Informasi publik yang dapat diakses oleh
                        masyarakat sesuai dengan ketentuan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Informasi */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-blue-200 to-blue-300 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                            <FileText className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Total Informasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 mb-2">{items.length}</div>
                            <p className="text-xs text-blue-700">Dokumen tersedia</p>
                        </CardContent>
                    </Card>

                    {/* Informasi Berkala */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-emerald-200 to-emerald-300 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                            <Clock className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Berkala
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-emerald-900 mb-2">
                                {items.filter((i) => i.attributes.kategori === "Informasi Berkala").length}
                            </div>
                            <p className="text-xs text-emerald-700">Dijadwalkan</p>
                        </CardContent>
                    </Card>

                    {/* Informasi Setiap Saat */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-purple-200 to-purple-300 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                            <Building className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Setiap Saat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-purple-900 mb-2">
                                {items.filter((i) => i.attributes.kategori === "Informasi Setiap Saat").length}
                            </div>
                            <p className="text-xs text-purple-700">Tersedia</p>
                        </CardContent>
                    </Card>

                    {/* Kategori Lainnya */}
                    <Card className="relative overflow-hidden bg-linear-to-br from-amber-200 to-amber-300 border-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                            <BookOpen className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Lainnya
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-amber-900 mb-2">
                                {
                                    items.filter(
                                        (i) =>
                                            !["Informasi Berkala", "Informasi Setiap Saat"].includes(
                                                i.attributes.kategori || ""
                                            )
                                    ).length
                                }
                            </div>
                            <p className="text-xs text-amber-700">Berkategori lain</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan judul atau deskripsi..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(null)}
                                    size="sm"
                                    className={cn(
                                        "transition-colors",
                                        selectedCategory === null ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                                    )}
                                >
                                    Semua
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(category)}
                                        size="sm"
                                        className={cn(
                                            "transition-colors",
                                            selectedCategory === category
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : ""
                                        )}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <InformasiPublikDataNotAvailable onRetry={fetchData} />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => {
                            const attrs = item.attributes;
                            const title = attrs.nama || "Tanpa Judul";
                            const description = attrs.keterangan || "Tidak ada deskripsi";
                            const category = attrs.kategori || "Lainnya";
                            const date = attrs.tgl_upload;
                            const pdfUrl = attrs.satuan;
                            const hasPdf = !!pdfUrl;

                            return (
                                <Card
                                    key={item.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1">{getCategoryBadge(category)}</div>
                                            {attrs.tahun && (
                                                <Badge variant="outline" className="text-xs">
                                                    {attrs.tahun}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2 leading-tight">{title}</CardTitle>
                                    </CardHeader>

                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="space-y-3 flex-1">
                                            {attrs.attr && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                                        Detail Informasi:
                                                    </p>
                                                    <div className="text-sm text-gray-600">
                                                        {(() => {
                                                            try {
                                                                const attrData = JSON.parse(attrs.attr);
                                                                return (
                                                                    <div className="space-y-1">
                                                                        {attrData.no_kep_kades && (
                                                                            <p>
                                                                                <span className="font-medium">
                                                                                    No. Kep. Kades:
                                                                                </span>{" "}
                                                                                {attrData.no_kep_kades}
                                                                            </p>
                                                                        )}
                                                                        {attrData.tgl_kep_kades && (
                                                                            <p>
                                                                                <span className="font-medium">
                                                                                    Tgl. Kep. Kades:
                                                                                </span>{" "}
                                                                                {attrData.tgl_kep_kades}
                                                                            </p>
                                                                        )}
                                                                        {attrData.uraian && (
                                                                            <p>
                                                                                <span className="font-medium">
                                                                                    Uraian:
                                                                                </span>{" "}
                                                                                {attrData.uraian}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            } catch {
                                                                return null;
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(date)}</span>
                                            </div>

                                            {hasPdf && (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <FileText className="h-4 w-4" />
                                                    <span>Dokumen PDF tersedia</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mt-4 pt-4 border-t">
                                            {hasPdf ? (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => {
                                                            window.open(pdfUrl, "_blank");
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Unduh PDF
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Lihat PDF
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button variant="outline" size="sm" className="flex-1" disabled>
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Data Belum Tersedia
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* PPID Info Section */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <UserCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Pejabat Pengelola Informasi dan Dokumentasi (PPID)
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    PPID adalah pejabat yang bertanggung jawab di bidang penyimpanan, pendokumentasian,
                                    penyediaan, dan/atau pelayanan informasi di setiap badan publik. Jika Anda
                                    memerlukan informasi publik yang tidak tersedia di website ini, silakan hubungi kami
                                    melalui mekanisme permintaan informasi publik.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Jenis Informasi:</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                            <li>Informasi Berkala</li>
                                            <li>Informasi Setiap Saat</li>
                                            <li>Informasi Sukarela</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Permohonan Informasi:</h4>
                                        <p className="text-sm text-gray-600">
                                            Dilayani sesuai mekanisme yang diatur dalam Perda Kab. Sleman tentang
                                            Keterbukaan Informasi Publik
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PDF Viewer Modal */}
                {selectedItem && selectedItem.attributes.satuan && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold truncate pr-4">{selectedItem.attributes.nama}</h2>
                                    <p className="text-sm text-gray-600">
                                        Kategori: {selectedItem.attributes.kategori} | Tahun:{" "}
                                        {selectedItem.attributes.tahun}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(selectedItem.attributes.satuan!, "_blank")}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Unduh
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSelectedItem(null)}
                                        className="rounded-full"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto bg-gray-100">
                                <iframe
                                    src={selectedItem.attributes.satuan}
                                    className="w-full h-[calc(90vh-120px)] border-0"
                                    title={selectedItem.attributes.nama}
                                />
                            </div>

                            <div className="border-t bg-gray-50 p-4">
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium mb-1">Detail Informasi:</p>
                                    {selectedItem.attributes.attr && (
                                        <div className="grid md:grid-cols-2 gap-2">
                                            {(() => {
                                                try {
                                                    const attrData = JSON.parse(selectedItem.attributes.attr!);
                                                    return (
                                                        <>
                                                            {attrData.no_kep_kades && (
                                                                <p>
                                                                    <span className="font-medium">No. Kep. Kades:</span>{" "}
                                                                    {attrData.no_kep_kades}
                                                                </p>
                                                            )}
                                                            {attrData.tgl_kep_kades && (
                                                                <p>
                                                                    <span className="font-medium">
                                                                        Tgl. Kep. Kades:
                                                                    </span>{" "}
                                                                    {attrData.tgl_kep_kades}
                                                                </p>
                                                            )}
                                                            {attrData.uraian && (
                                                                <p className="md:col-span-2">
                                                                    <span className="font-medium">Uraian:</span>{" "}
                                                                    {attrData.uraian}
                                                                </p>
                                                            )}
                                                        </>
                                                    );
                                                } catch {
                                                    return null;
                                                }
                                            })()}
                                        </div>
                                    )}
                                    <p className="mt-2">
                                        <span className="font-medium">Upload Date:</span>{" "}
                                        {formatDate(selectedItem.attributes.tgl_upload)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
