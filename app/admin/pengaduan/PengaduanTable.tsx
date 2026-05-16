"use client";

import React from "react";
import { Pengaduan, StatusPengaduan } from "@prisma/client";
import { CustomDataTable } from "@/components/ui/custom/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Trash, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { updatePengaduanStatus, deletePengaduan } from "@/app/actions/pengaduan";
import { showToast } from "@/components/ui/custom/CustomToast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface PengaduanTableProps {
    data: Pengaduan[];
}

export function PengaduanTable({ data }: PengaduanTableProps) {
    const [selectedPengaduan, setSelectedPengaduan] = React.useState<Pengaduan | null>(null);

    const columns = [
        {
            key: "tiketId" as keyof Pengaduan,
            label: "Tiket ID",
            render: (value: any) => <span className="font-mono text-xs font-bold">{value}</span>,
        },
        {
            key: "nama" as keyof Pengaduan,
            label: "Pelapor",
        },
        {
            key: "kategori" as keyof Pengaduan,
            label: "Kategori",
        },
        {
            key: "subjek" as keyof Pengaduan,
            label: "Subjek",
            render: (value: any) => <span className="line-clamp-1">{value}</span>,
        },
        {
            key: "status" as keyof Pengaduan,
            label: "Status",
            render: (value: any) => {
                const s = value as StatusPengaduan;
                // Map warning/success to shadcn compatible variants or use custom styling
                // Since Badge variant is limited, we'll use a mix
                return (
                    <Badge variant={s === "DITOLAK" ? "destructive" : s === "SELESAI" ? "default" : "outline"}>
                        {s}
                    </Badge>
                );
            },
        },
        {
            key: "createdAt" as keyof Pengaduan,
            label: "Tanggal",
            render: (value: any) => format(new Date(value), "d MMM yy", { locale: id }),
        },
    ];

    const actions = (item: Pengaduan) => [
        {
            label: "Lihat Detail",
            icon: Eye,
            onClick: () => setSelectedPengaduan(item),
        },
        {
            label: "Proses",
            icon: Clock,
            onClick: async () => {
                try {
                    await updatePengaduanStatus(item.id, "DIPROSES");
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
                    await updatePengaduanStatus(item.id, "SELESAI");
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
                    await updatePengaduanStatus(item.id, "DITOLAK");
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
                if (confirm("Apakah Anda yakin ingin menghapus pengaduan ini?")) {
                    try {
                        await deletePengaduan(item.id);
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

            <Dialog open={!!selectedPengaduan} onOpenChange={(open) => !open && setSelectedPengaduan(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Pengaduan - {selectedPengaduan?.tiketId}</DialogTitle>
                        <DialogDescription>
                            Informasi lengkap pengaduan dari warga
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPengaduan && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Pelapor</h4>
                                    <p>{selectedPengaduan.nama}</p>
                                    <p className="text-sm text-muted-foreground">{selectedPengaduan.email}</p>
                                    <p className="text-sm text-muted-foreground">{selectedPengaduan.telepon}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Kategori</h4>
                                    <p>{selectedPengaduan.kategori}</p>
                                    <h4 className="text-sm font-semibold text-muted-foreground mt-2">Status</h4>
                                    <Badge>{selectedPengaduan.status}</Badge>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Subjek</h4>
                                <p className="font-medium">{selectedPengaduan.subjek}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground">Pesan</h4>
                                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                                    {selectedPengaduan.pesan}
                                </div>
                            </div>
                            {selectedPengaduan.lokasi && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground">Lokasi</h4>
                                    <p className="text-sm">{selectedPengaduan.lokasi}</p>
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground pt-4 border-t">
                                Dilaporkan pada: {format(new Date(selectedPengaduan.createdAt), "d MMMM yyyy HH:mm", { locale: id })}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
