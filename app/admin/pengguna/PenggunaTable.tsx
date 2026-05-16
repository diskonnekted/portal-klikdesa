"use client";

import React from "react";
import { Pengguna } from "@prisma/client";
import { CustomDataTable } from "@/components/ui/custom/CustomDataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Pencil, Trash, UserCheck, UserX } from "lucide-react";
import { showToast } from "@/components/ui/custom/CustomToast";

interface PenggunaTableProps {
    data: any[]; // Using any because of potential prisma return type nuances with enums
}

export function PenggunaTable({ data }: PenggunaTableProps) {
    const columns = [
        {
            key: "namaLengkap" as keyof Pengguna,
            label: "Nama",
            render: (value: any) => <span className="font-medium">{value}</span>,
        },
        {
            key: "email" as keyof Pengguna,
            label: "Email",
        },
        {
            key: "peran" as keyof Pengguna,
            label: "Peran",
            render: (value: any) => (
                <Badge variant="outline" className="capitalize">
                    {value.toLowerCase()}
                </Badge>
            ),
        },
        {
            key: "aktif" as keyof Pengguna,
            label: "Status",
            render: (value: any) => (
                <Badge variant={value ? "default" : "secondary"}>
                    {value ? "AKTIF" : "NONAKTIF"}
                </Badge>
            ),
        },
        {
            key: "createdAt" as keyof Pengguna,
            label: "Terdaftar",
            render: (value: any) => format(new Date(value), "d MMMM yyyy", { locale: id }),
        },
    ];

    const actions = (item: any) => [
        {
            label: item.aktif ? "Nonaktifkan" : "Aktifkan",
            icon: item.aktif ? UserX : UserCheck,
            onClick: () => {
                showToast.informasi("Fitur perubahan status pengguna segera hadir");
            },
        },
        {
            label: "Edit",
            icon: Pencil,
            onClick: () => {
                showToast.informasi("Fitur edit pengguna segera hadir");
            },
        },
        {
            label: "Hapus",
            icon: Trash,
            variant: "destructive" as const,
            separator: true,
            onClick: () => {
                if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
                    showToast.kesalahan("Fitur hapus pengguna belum diimplementasikan");
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
