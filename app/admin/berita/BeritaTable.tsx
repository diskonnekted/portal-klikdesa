"use client";

import React from "react";
import { Berita } from "@prisma/client";
import { CustomDataTable } from "@/components/ui/custom/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Pencil, Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteBerita } from "@/app/actions/berita";
import { showToast } from "@/components/ui/custom/CustomToast";

interface BeritaTableProps {
    data: Berita[];
}

export function BeritaTable({ data }: BeritaTableProps) {
    const router = useRouter();

    const columns = [
        {
            key: "judul" as keyof Berita,
            label: "Judul",
            render: (value: any) => <span className="font-medium">{value}</span>,
        },
        {
            key: "kategori" as keyof Berita,
            label: "Kategori",
            render: (value: any) => <span className="capitalize">{value}</span>,
        },
        {
            key: "status" as keyof Berita,
            label: "Status",
            render: (value: any) => (
                <Badge variant={value === "PUBLISHED" ? "default" : "secondary"}>
                    {value}
                </Badge>
            ),
        },
        {
            key: "createdAt" as keyof Berita,
            label: "Tanggal",
            render: (value: any) => format(new Date(value), "d MMMM yyyy", { locale: id }),
        },
    ];

    const actions = (item: Berita) => [
        {
            label: "Lihat",
            icon: Eye,
            onClick: () => window.open(`/berita/${item.slug}`, "_blank"),
        },
        {
            label: "Edit",
            icon: Pencil,
            onClick: () => router.push(`/admin/berita/${item.id}/edit`),
        },
        {
            label: "Hapus",
            icon: Trash,
            variant: "destructive" as const,
            separator: true,
            onClick: async () => {
                if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
                    try {
                        await deleteBerita(item.id);
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
