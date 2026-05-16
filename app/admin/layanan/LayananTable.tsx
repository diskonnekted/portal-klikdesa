"use client";

import React from "react";
import { LayananPermohonan, StatusPermohonan } from "@prisma/client";
import { CustomDataTable } from "@/components/ui/custom/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Trash, CheckCircle, Clock, XCircle, Eye, Download } from "lucide-react";
import { updateLayananStatus, deleteLayanan } from "@/app/actions/layanan";
import { showToast } from "@/components/ui/custom/CustomToast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LayananTableProps {
    data: LayananPermohonan[];
}

export function LayananTable({ data }: LayananTableProps) {
    const [selectedLayanan, setSelectedLayanan] = React.useState<LayananPermohonan | null>(null);

    const columns = [
        {
            key: "idPelacakan" as keyof LayananPermohonan,
            label: "ID Tracking",
            render: (value: any) => <span className="font-mono text-xs font-bold">{value}</span>,
        },
        {
            key: "namaPemohon" as keyof LayananPermohonan,
            label: "Pemohon",
        },
        {
            key: "jenisLayanan" as keyof LayananPermohonan,
            label: "Jenis",
            render: (value: any) => <span className="text-xs uppercase font-medium">{value.replace(/_/g, " ")}</span>,
        },
        {
            key: "statusPermohonan" as keyof LayananPermohonan,
            label: "Status",
            render: (value: any) => {
                const s = value as StatusPermohonan;
                return (
                    <Badge variant={s === "DITOLAK" ? "destructive" : s === "SELESAI" ? "default" : "outline"}>
                        {s}
                    </Badge>
                );
            },
        },
        {
            key: "tanggalPengajuan" as keyof LayananPermohonan,
            label: "Tanggal",
            render: (value: any) => format(new Date(value), "d MMM yy", { locale: id }),
        },
    ];

    const actions = (item: LayananPermohonan) => [
        {
            label: "Lihat Detail",
            icon: Eye,
            onClick: () => setSelectedLayanan(item),
        },
        {
            label: "Proses",
            icon: Clock,
            onClick: async () => {
                try {
                    await updateLayananStatus(item.id, "DIPROSES");
                    showToast.berhasil("Status diperbarui menjadi DIPROSES");
                } catch (error) {
                    showToast.terjadiKesalahan();
                }
            },
        },
        {
            label: "Selesaikan",
            icon: CheckCircle,
            onClick: async () => {
                try {
                    await updateLayananStatus(item.id, "SELESAI");
                    showToast.berhasil("Status diperbarui menjadi SELESAI");
                } catch (error) {
                    showToast.terjadiKesalahan();
                }
            },
        },
        {
            label: "Tolak",
            icon: XCircle,
            onClick: async () => {
                try {
                    await updateLayananStatus(item.id, "DITOLAK");
                    showToast.berhasil("Status diperbarui menjadi DITOLAK");
                } catch (error) {
                    showToast.terjadiKesalahan();
                }
            },
        },
        {
            label: "Hapus",
            icon: Trash,
            variant: "destructive" as const,
            separator: true,
            onClick: async () => {
                if (confirm("Apakah Anda yakin ingin menghapus permohonan ini?")) {
                    try {
                        await deleteLayanan(item.id);
                        showToast.dataDihapus();
                    } catch (error) {
                        showToast.terjadiKesalahan();
                    }
                }
            },
        },
    ];

    return (
        <>
            <CustomDataTable
                data={data}
                columns={columns}
                actions={actions}
            />

            <Dialog open={!!selectedLayanan} onOpenChange={(open) => !open && setSelectedLayanan(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Permohonan Layanan</DialogTitle>
                        <DialogDescription>
                            ID Tracking: {selectedLayanan?.idPelacakan}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLayanan && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Pemohon</h4>
                                    <p className="font-medium">{selectedLayanan.namaPemohon}</p>
                                    <p className="text-sm text-muted-foreground">NIK: {selectedLayanan.nikPemohon}</p>
                                    <p className="text-sm text-muted-foreground">{selectedLayanan.emailPemohon}</p>
                                    <p className="text-sm text-muted-foreground">{selectedLayanan.teleponPemohon}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Layanan</h4>
                                    <p className="font-medium">{selectedLayanan.jenisLayanan.replace(/_/g, " ")}</p>
                                    <h4 className="text-sm font-semibold text-muted-foreground mt-2">Status</h4>
                                    <Badge>{selectedLayanan.statusPermohonan}</Badge>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Alamat</h4>
                                <p className="text-sm">{selectedLayanan.alamatLengkap}</p>
                            </div>
                            {selectedLayanan.keterangan && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Keterangan</h4>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                        {selectedLayanan.keterangan}
                                    </div>
                                </div>
                            )}
                            {selectedLayanan.dokumen && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Dokumen Pendukung</h4>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={selectedLayanan.dokumen} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" /> Lihat Dokumen
                                        </a>
                                    </Button>
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground pt-4 border-t">
                                Diajukan pada: {format(new Date(selectedLayanan.tanggalPengajuan), "d MMMM yyyy HH:mm", { locale: id })}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
