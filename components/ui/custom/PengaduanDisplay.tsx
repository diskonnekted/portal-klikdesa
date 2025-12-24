"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare, Clock, User, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ChildResponse {
    id: number;
    config_id: number;
    id_pengaduan: number;
    nik: string | null;
    nama: string;
    email: string | null;
    telepon: string | null;
    judul: string | null;
    isi: string;
    status: number;
    foto: string | null;
    ip_address: string;
    created_at: string;
    updated_at: string;
    child: unknown[];
}

interface PengaduanAttributes {
    config_id: number;
    id_pengaduan: string | null;
    nik: string;
    nama: string;
    email: string;
    telepon: string | null;
    judul: string;
    isi: string;
    status: number;
    foto: string | null;
    ip_address: string;
    created_at: string;
    updated_at: string;
    child_count: number;
    child: ChildResponse[];
}

interface PengaduanItem {
    type: string;
    id: string;
    attributes: PengaduanAttributes;
}

interface PengaduanData {
    data: PengaduanItem[];
    meta?: {
        pagination: {
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
        prev?: string;
        next?: string;
    };
}

interface PengaduanDisplayProps {
    className?: string;
}

const fetchPengaduanData = async (): Promise<PengaduanData | null> => {
    try {
        const response = await fetch(`/api/pengaduan`);
        if (!response.ok) throw new Error(`Failed to fetch pengaduan data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch pengaduan data:", error);
        return null;
    }
};

const getStatusBadge = (status: number) => {
    switch (status) {
        case 0:
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Belum Ditanggapi
                </Badge>
            );
        case 1:
            return (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Menunggu
                </Badge>
            );
        case 2:
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Sedang Diproses
                </Badge>
            );
        case 3:
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Selesai
                </Badge>
            );
        default:
            return <Badge variant="secondary">Status {status}</Badge>;
    }
};

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
        }).format(date);
    } catch {
        return dateString;
    }
};

export function PengaduanDisplay({ className }: PengaduanDisplayProps) {
    const [data, setData] = React.useState<PengaduanData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedPengaduan, setSelectedPengaduan] = React.useState<PengaduanItem | null>(null);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchPengaduanData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                if (!result) throw new Error("Gagal mengambil data dari server");
                setData(result as PengaduanData);
            } catch (error) {
                console.error("Failed to load pengaduan data:", error);
                setError(error instanceof Error ? error.message : "Terjadi kesalahan");
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Daftar Pengaduan Masyarakat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Terjadi Kesalahan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8 text-center text-red-600 bg-red-50 rounded-lg mx-6 mb-6">
                            <div>
                                <p className="font-medium">Gagal memuat data</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Daftar Pengaduan Masyarakat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-semibold mb-2">Belum Ada Pengaduan</p>
                                <p className="text-sm">Tidak ada pengaduan yang tersedia saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Daftar Pengaduan Masyarakat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Total {data.meta?.pagination.total || data.data.length} pengaduan yang terdaftar
                    </p>
                </CardHeader>
            </Card>

            {/* Pengaduan List - Simplified Cards */}
            <div className="space-y-4">
                {data.data.map((pengaduan) => {
                    const attrs = pengaduan.attributes;
                    // Preview of content (first 150 characters)
                    const preview = attrs.isi.length > 150 ? attrs.isi.substring(0, 150) + "..." : attrs.isi;

                    return (
                        <Card
                            key={pengaduan.id}
                            className={cn(
                                "hover:shadow-lg transition-all cursor-pointer hover:border-primary",
                                attrs.child_count > 0 && "border-l-4 border-l-green-500"
                            )}
                            onClick={() => setSelectedPengaduan(pengaduan)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg hover:text-primary transition-colors">
                                                {attrs.judul}
                                            </CardTitle>
                                            {attrs.child_count > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                    {attrs.child_count}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>{attrs.nama}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(attrs.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(attrs.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Preview of complaint content */}
                                <p className="text-sm text-gray-600 line-clamp-2">{preview}</p>
                                <p className="text-xs text-primary mt-2 font-medium">Klik untuk detail lengkap →</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedPengaduan} onOpenChange={(open) => !open && setSelectedPengaduan(null)}>
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    {selectedPengaduan && (
                        <>
                            <DialogHeader className="pr-10 border-b pb-4">
                                <DialogTitle className="text-2xl font-bold text-gray-900 mb-3">
                                    {selectedPengaduan.attributes.judul}
                                </DialogTitle>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{selectedPengaduan.attributes.nama}</span>
                                    </div>
                                    {getStatusBadge(selectedPengaduan.attributes.status)}
                                </div>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                {/* Complaint Content */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Isi Pengaduan</h3>
                                    <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {selectedPengaduan.attributes.isi}
                                        </p>
                                    </div>
                                </div>

                                {/* Image if available */}
                                {selectedPengaduan.attributes.foto &&
                                    !selectedPengaduan.attributes.foto.includes("404-image-not-found") && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Foto Pendukung</h3>
                                            <div className="rounded-lg overflow-hidden border">
                                                <Image
                                                    src={selectedPengaduan.attributes.foto}
                                                    alt={`Foto pengaduan: ${selectedPengaduan.attributes.judul}`}
                                                    width={1200}
                                                    height={800}
                                                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    )}

                                {/* Timestamps */}
                                <div className="flex flex-wrap gap-4 py-3 border-y text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>Dibuat: {formatDate(selectedPengaduan.attributes.created_at)}</span>
                                    </div>
                                    {selectedPengaduan.attributes.updated_at !==
                                        selectedPengaduan.attributes.created_at && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                Diperbarui: {formatDate(selectedPengaduan.attributes.updated_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Government Responses */}
                                {selectedPengaduan.attributes.child &&
                                    selectedPengaduan.attributes.child.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <MessageSquare className="h-5 w-5 text-green-600" />
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Tanggapan Perangkat Desa
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    {selectedPengaduan.attributes.child_count} Tanggapan
                                                </Badge>
                                            </div>
                                            <div className="space-y-4">
                                                {selectedPengaduan.attributes.child.map((response, idx) => {
                                                    const hasValidResponseFoto =
                                                        response.foto && !response.foto.includes("404-image-not-found");

                                                    return (
                                                        <div
                                                            key={response.id || idx}
                                                            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <User className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="text-sm font-semibold text-gray-900">
                                                                            {response.nama || "Perangkat Desa"}
                                                                        </p>
                                                                        {getStatusBadge(response.status)}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                                                        <div className="flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            <span>
                                                                                {formatDate(response.created_at)}
                                                                            </span>
                                                                        </div>
                                                                        {response.updated_at !==
                                                                            response.created_at && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" />
                                                                                <span>
                                                                                    Diperbarui:{" "}
                                                                                    {formatDate(response.updated_at)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Response Content */}
                                                            <div className="pl-[52px]">
                                                                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                                    {response.isi}
                                                                </p>

                                                                {/* Response Image if available */}
                                                                {hasValidResponseFoto && (
                                                                    <div className="mt-3 rounded-lg overflow-hidden border border-green-300">
                                                                        <Image
                                                                            src={response.foto!}
                                                                            alt="Foto tanggapan"
                                                                            width={1200}
                                                                            height={800}
                                                                            className="w-full h-auto max-h-64 object-contain bg-white"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Pagination Info */}
            {data.meta && data.meta.pagination.total_pages > 1 && (
                <Card>
                    <CardContent className="py-4">
                        <div className="text-center text-sm text-muted-foreground">
                            Halaman {data.meta.pagination.current_page} dari {data.meta.pagination.total_pages}
                            {" • "}
                            Menampilkan {data.meta.pagination.count} dari {data.meta.pagination.total} pengaduan
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
