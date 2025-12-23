"use client";

import * as React from "react";
import { MapPin, Building, Users, Navigation, Phone, Mail, Globe, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PetaData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            desa: {
                nama_desa: string;
                kode_desa: string;
                kode_pos: number;
                nama_kecamatan: string;
                nama_kabupaten: string;
                nama_propinsi: string;
                alamat_kantor: string;
                email_desa: string;
                telepon: string;
                website: string;
                kantor_desa: string;
                logo: string;
                lat: string;
                lng: string;
            };
            dusun_gis: Array<{
                dusun: string;
                rt: string;
                rw: string;
            }>;
            rw_gis: Array<{
                rw: string;
                dusun: string;
            }>;
            rt_gis: Array<{
                rt: string;
                rw: string;
                dusun: string;
            }>;
            lokasi_pembangunan: Array<{
                judul: string;
                lokasi: string;
                tahun_anggaran: string;
                anggaran: number;
                sumber_dana: string;
                manfaat: string;
                lat: string | null;
                lng: string | null;
            }>;
        };
    }>;
}

interface PetaDisplayProps {
    className?: string;
}

// Function to fetch Peta data from API
const fetchPetaData = async (): Promise<PetaData | null> => {
    try {
        const response = await fetch(`/api/peta`);

        if (!response.ok) {
            throw new Error(`Failed to fetch peta data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch peta data:", error);
        return null;
    }
};

export function PetaDisplay({ className }: PetaDisplayProps) {
    const [data, setData] = React.useState<PetaData | null>(null);
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
                const result = await Promise.race([fetchPetaData(), timeoutPromise]);
                setData(result as PetaData);
            } catch (error) {
                console.error("Failed to load peta data:", error);
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
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Informasi Geografis & Administratif
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

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Informasi Geografis & Administratif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data peta saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const petaInfo = data.data[0].attributes;
    const uniqueDusun = Array.from(new Set(petaInfo.dusun_gis.map((d) => d.dusun)));
    const uniqueRW = Array.from(new Set(petaInfo.rw_gis.filter((rw) => rw.rw !== "-").map((rw) => rw.rw)));
    const uniqueRT = Array.from(new Set(petaInfo.rt_gis.filter((rt) => rt.rt !== "-").map((rt) => rt.rt)));
    const totalPengembangunan = petaInfo.lokasi_pembangunan.length;

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Informasi Geografis & Administratif
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Village Information */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Identitas Desa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-bold text-2xl text-primary mb-2">{petaInfo.desa.nama_desa}</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Kode Desa</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.kode_desa}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Navigation className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Kode Pos</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.kode_pos}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Alamat Kantor</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.alamat_kantor}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Telepon</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.telepon}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.email_desa}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Website</p>
                                        <p className="text-muted-foreground">{petaInfo.desa.website}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Coordinates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Koordinat Geografis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                                <p className="text-xl font-bold text-primary">{petaInfo.desa.lat}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                                <p className="text-xl font-bold text-primary">{petaInfo.desa.lng}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="font-medium">Kecamatan</p>
                                <p className="text-muted-foreground">{petaInfo.desa.nama_kecamatan}</p>
                            </div>
                            <div>
                                <p className="font-medium">Kabupaten</p>
                                <p className="text-muted-foreground">{petaInfo.desa.nama_kabupaten}</p>
                            </div>
                            <div>
                                <p className="font-medium">Provinsi</p>
                                <p className="text-muted-foreground">{petaInfo.desa.nama_propinsi}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Administrative Structure */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Struktur Administratif
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Padukuhan/Dusun */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary/40 rounded" />
                                Dusun
                            </h3>
                            <div className="space-y-2">
                                {uniqueDusun.map((dusun) => (
                                    <div key={dusun} className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium">{dusun}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold text-primary">{uniqueDusun.length}</p>
                            </div>
                        </div>

                        {/* RW */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary/40 rounded" />
                                Rukun Warga (RW)
                            </h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {uniqueRW.slice(0, 10).map((rw) => (
                                    <div key={rw} className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium">RW {rw}</p>
                                    </div>
                                ))}
                                {uniqueRW.length > 10 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        +{uniqueRW.length - 10} lainnya
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 text-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold text-primary">{uniqueRW.length}</p>
                            </div>
                        </div>

                        {/* RT */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary/40 rounded" />
                                Rukun Tetangga (RT)
                            </h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {uniqueRT.slice(0, 10).map((rt) => (
                                    <div key={rt} className="p-3 bg-muted/30 rounded-lg">
                                        <p className="font-medium">RT {rt}</p>
                                    </div>
                                ))}
                                {uniqueRT.length > 10 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        +{uniqueRT.length - 10} lainnya
                                    </p>
                                )}
                            </div>
                            <div className="mt-3 text-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold text-primary">{uniqueRT.length}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Development Projects */}
            {totalPengembangunan > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            Lokasi Pembangunan
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Total: {totalPengembangunan} proyek</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {petaInfo.lokasi_pembangunan.map((proyek, index) => (
                                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-primary">{proyek.judul}</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {proyek.lokasi || "Lokasi tidak tersedia"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Tahun {proyek.tahun_anggaran}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {proyek.sumber_dana}
                                            </Badge>
                                        </div>
                                        {proyek.anggaran && (
                                            <p className="font-semibold">
                                                Anggaran: Rp {new Intl.NumberFormat("id-ID").format(proyek.anggaran)}
                                            </p>
                                        )}
                                        {proyek.manfaat && (
                                            <p className="text-sm text-muted-foreground">Manfaat: {proyek.manfaat}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

