"use client";

import React from "react";
import { Pengumuman } from "@prisma/client";
import { CustomDataTable } from "@/components/ui/custom/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Pencil, Trash, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePengumuman } from "@/app/actions/pengumuman";
import { showToast } from "@/components/ui/custom/CustomToast";

interface PengumumanTableProps {
    data: Pengumuman[];
}

export function PengumumanTable({ data }: PengumumanTableProps) {
    const router = useRouter();

    const columns = [
        {
            key: "judul" as keyof Pengumuman,
            label: "Judul",
            render: (value: any) => <span className="font-medium">{value}</span>,
        },
        {
            key: "prioritas" as keyof Pengumuman,
            label: "Prioritas",
            render: (value: any) => {
                const colors: Record<string, string> = {
                    RENDAH: "bg-blue-100 text-blue-800",
                    NORMAL: "bg-gray-100 text-gray-800",
                    TINGGI: "bg-orange-100 text-orange-800",
                    PENTING: "bg-red-100 text-red-800",
                };
                return (
                    <Badge variant="outline" className={colors[value] || ""}>
                        {value}
                    </Badge>
                );
            },
        },
        {
            key: "status" as keyof Pengumuman,
            label: "Status",
            render: (value: any) => (
                <Badge variant={value === "PUBLISHED" ? "default" : "secondary"}>
                    {value}
                </Badge>
            ),
        },
        {
            key: "createdAt" as keyof Pengumuman,
            label: "Tanggal",
            render: (value: any) => format(new Date(value), "d MMM yy", { locale: id }),
        },
    ];

    const actions = (item: Pengumuman) => [
        {
            label: "Edit",
            icon: Pencil,
            onClick: () => router.push(`/admin/pengumuman/${item.id}/edit`),
        },
        {
            label: "Hapus",
            icon: Trash,
            variant: "destructive" as const,
            separator: true,
            onClick: async () => {
                if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
                    try {
                        await deletePengumuman(item.id);
                        showToast.dataDihapus();
                    } catch (error) {
                        showToast.terjadiKesalahan();
                    }
                }
            },
        },
    ];

    return (
        <CustomDataTable
            data={data}
            columns={columns}
            actions={actions}
        />
    );
}
