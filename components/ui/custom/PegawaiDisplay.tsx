"use client";

import * as React from "react";
import { Users, Mail, Phone, MapPin, Calendar, UserCheck, Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProtectedContact } from "./ProtectedContact";

interface Pegawai {
    pamong_id: number;
    pamong_nama: string;
    pamong_nik: string;
    pamong_tempatlahir: string;
    pamong_tanggallahir: string;
    pamong_sex: number;
    pamong_pendidikan: number;
    pamong_agama: number;
    foto: string;
    nama_jabatan: string;
    pamong_nosk: string;
    pamong_tglsk: string;
    pamong_masajab: string | null;
    status_kehadiran: string;
    tanggal: string | null;
    foto_staff: string;
    penduduk: {
        alamat_wilayah: string;
        jenis_kelamin: {
            nama: string;
        };
        agama: {
            nama: string;
        };
        pendidikan_k_k: {
            nama: string;
        };
        pekerjaan: {
            nama: string;
        };
        usia: string;
        telepon: string | null;
        email: string | null;
    };
    jabatan: {
        nama: string;
        tupoksi: string;
    };
}

interface PegawaiData {
    data: Array<{
        type: string;
        id: string;
        attributes: Pegawai;
    }>;
}

interface PegawaiDisplayProps {
    className?: string;
}

// Function to fetch Pegawai data from API
const fetchPegawaiData = async (): Promise<PegawaiData | null> => {
    try {
        const response = await fetch(`/api/pemerintah`);

        if (!response.ok) {
            throw new Error(`Failed to fetch pegawai data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch pegawai data:", error);
        return null;
    }
};

export function PegawaiDisplay({ className }: PegawaiDisplayProps) {
    const [data, setData] = React.useState<PegawaiData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchPegawaiData(), timeoutPromise]);
                setData(result as PegawaiData);
            } catch (error) {
                console.error("Failed to load pegawai data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Get photo URL
    const getPhotoUrl = (fotoPath: string, fotoStaff: string) => {
        // Try foto first (direct URL)
        if (fotoPath && fotoPath.startsWith("http")) {
            return fotoPath;
        }
        // Try foto_staff (construct URL from filename)
        if (fotoStaff) {
            return `https://pondokrejo.sleman-desa.id/storage-desa?path=upload/user_pict/${fotoStaff}&signature=placeholder`;
        }
        // Fallback to foto with constructed URL
        if (fotoPath) {
            return `https://pondokrejo.sleman-desa.id/storage-desa?path=${fotoPath}&signature=placeholder`;
        }
        return null;
    };

    if (loading) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-primary" />
                            Pegawai & Perangkat Desa
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

    if (!data || !data.data) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-primary" />
                            Pegawai & Perangkat Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data pegawai saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const pegawaiList = data.data.map((item) => item.attributes);

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Pegawai & Perangkat Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Total: {pegawaiList.length} orang</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {pegawaiList.map((pegawai) => {
                            const photoUrl = getPhotoUrl(pegawai.foto, pegawai.foto_staff);

                            return (
                                <Card
                                    key={pegawai.pamong_id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow pt-0"
                                >
                                    <div className="relative w-full h-[316px] bg-gradient-to-br from-sky-100 to-blue-200 overflow-hidden">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={pegawai.pamong_nama}
                                                className="w-full h-full object-cover object-top scale-102"
                                                style={{
                                                    objectFit: "cover",
                                                    objectPosition: "top center",
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Users className="h-20 w-20 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4 pt-0 pb-0 space-y-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-primary mb-1">
                                                {pegawai.pamong_nama}
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {pegawai.nama_jabatan}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Briefcase className="h-4 w-4" />
                                                <span>{pegawai.penduduk.pekerjaan?.nama || "-"}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <UserCheck className="h-4 w-4" />
                                                <span>
                                                    {pegawai.penduduk.jenis_kelamin?.nama} â€¢ {pegawai.penduduk.usia}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{pegawai.penduduk.alamat_wilayah}</span>
                                            </div>

                                            {pegawai.penduduk.telepon && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <ProtectedContact value={pegawai.penduduk.telepon} type="phone" />
                                                </div>
                                            )}

                                            {pegawai.penduduk.email && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                    <ProtectedContact value={pegawai.penduduk.email} type="email" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>SK: {formatDate(pegawai.pamong_tglsk)}</span>
                                            </div>
                                        </div>

                                        {pegawai.penduduk.pendidikan_k_k?.nama && (
                                            <div className="pt-2 border-t">
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="font-semibold">Pendidikan:</span>{" "}
                                                    {pegawai.penduduk.pendidikan_k_k.nama}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

