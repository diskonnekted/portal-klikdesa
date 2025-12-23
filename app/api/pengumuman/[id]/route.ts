import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createNotFoundResponse, createErrorResponse } from "@/lib/api-response";

// Mock data (should be in a shared file or database)
const mockPengumuman = [
    {
        id: 1,
        judul: "Libur Nasional dan Cuti Bersama Tahun 2025",
        konten: `Berdasarkan Surat Keputusan Bersama (SKB) Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 812 Tahun 2024, Nomor 1 Tahun 2024, dan Nomor 3 Tahun 2024 tentang Hari Libur Nasional dan Cuti Bersama Tahun 2025, dengan hormat mengundang seluruh masyarakat Desa Sijenggung untuk memperhatikan jadwal libur nasional dan cuti bersama.

Daftar libur nasional yang akan datang:
- 25 Desember 2025: Hari Raya Natal
- 1 Januari 2026: Tahun Baru 2026

Masyarakat diharapkan memperhatikan jadwal layanan kantor desa yang disesuaikan dengan hari libur nasional.`,
        prioritas: "TINGGI",
        kategori: "Pemerintahan",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T08:00:00Z",
        expiresAt: "2025-12-31T23:59:59Z",
        createdAt: "2025-10-23T16:00:00Z",
        updatedAt: "2025-10-24T08:00:00Z",
        penulis: "Sekretariat Desa",
        lampiran: ["/pdf/kalender-2025.pdf"],
        views: 45,
    },
    {
        id: 2,
        judul: "Pembayaran PBB dan Retribusi Sampah Triwulan IV",
        konten: `Bersama ini kami sampaikan kepada seluruh wajib Pajak Bumi dan Bangunan (PBB) dan pengguna layanan sampah di Desa Sijenggung bahwa pembayaran PBB dan retribusi sampah untuk Triwulan IV (Oktober-Desember 2025) sudah dapat dilaksanakan.

Pembayaran dapat dilakukan melalui:
1. Kantor Kas Desa Sijenggung (Senin-Jumat, 08:00-14:00 WIB)
2. Mobile Payment (QRIS yang tersedia di kantor desa)
3. Transfer Bank BPD DIY (No. Rekening: 1234567890)

Batas waktu pembayaran: 20 Desember 2025

Mohon kerjasama dari seluruh warga untuk menyelesaikan kewajiban pembayaran tepat waktu. Terima kasih atas perhatian dan kerjasamanya.`,
        prioritas: "NORMAL",
        kategori: "Keuangan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T10:00:00Z",
        expiresAt: "2025-12-20T23:59:59Z",
        createdAt: "2025-10-22T15:30:00Z",
        updatedAt: "2025-10-23T10:00:00Z",
        penulis: "Bagian Keuangan",
        lampiran: [],
        views: 28,
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID pengumuman tidak valid"), {
                status: 400,
            });
        }

        const pengumuman = mockPengumuman.find((p) => p.id === id);

        if (!pengumuman) {
            return NextResponse.json(createNotFoundResponse("Pengumuman tidak ditemukan"), { status: 404 });
        }

        // Increment view count
        pengumuman.views += 1;

        // Add status information
        const response = {
            ...pengumuman,
            isExpired: new Date() > new Date(pengumuman.expiresAt),
            daysUntilExpiry: Math.ceil(
                (new Date(pengumuman.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            ),
            isUrgent: pengumuman.prioritas === "PENTING",
        };

        return NextResponse.json(createSuccessResponse(response, "Pengumuman berhasil dimuat"));
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memuat pengumuman"),
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID pengumuman tidak valid"), {
                status: 400,
            });
        }

        const body = await request.json();

        // Basic validation
        if (!body.judul || !body.konten) {
            return NextResponse.json(createErrorResponse("VALIDATION_ERROR", "Judul dan konten wajib diisi"), {
                status: 400,
            });
        }

        const pengumumanIndex = mockPengumuman.findIndex((p) => p.id === id);

        if (pengumumanIndex === -1) {
            return NextResponse.json(createNotFoundResponse("Pengumuman tidak ditemukan"), { status: 404 });
        }

        // Update pengumuman
        const updatedPengumuman = {
            ...mockPengumuman[pengumumanIndex],
            judul: body.judul.trim(),
            konten: body.konten.trim(),
            prioritas: body.prioritas ?? mockPengumuman[pengumumanIndex].prioritas,
            kategori: body.kategori ?? mockPengumuman[pengumumanIndex].kategori,
            status: body.status ?? mockPengumuman[pengumumanIndex].status,
            expiresAt: body.expiresAt ?? mockPengumuman[pengumumanIndex].expiresAt,
            updatedAt: new Date().toISOString(),
            lampiran: body.lampiran !== undefined ? body.lampiran : mockPengumuman[pengumumanIndex].lampiran,
        };

        // Update publishedAt if status is being changed to PUBLISHED
        if (body.status === "PUBLISHED" && mockPengumuman[pengumumanIndex].status !== "PUBLISHED") {
            updatedPengumuman.publishedAt = new Date().toISOString();
        }

        mockPengumuman[pengumumanIndex] = updatedPengumuman;

        return NextResponse.json(createSuccessResponse(updatedPengumuman, "Pengumuman berhasil diperbarui"));
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memperbarui pengumuman"),
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        if (isNaN(id)) {
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID pengumuman tidak valid"), {
                status: 400,
            });
        }

        const pengumumanIndex = mockPengumuman.findIndex((p) => p.id === id);

        if (pengumumanIndex === -1) {
            return NextResponse.json(createNotFoundResponse("Pengumuman tidak ditemukan"), { status: 404 });
        }

        // Remove pengumuman from array
        mockPengumuman.splice(pengumumanIndex, 1);

        return NextResponse.json(createSuccessResponse(null, "Pengumuman berhasil dihapus"));
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat menghapus pengumuman"),
            { status: 500 }
        );
    }
}
