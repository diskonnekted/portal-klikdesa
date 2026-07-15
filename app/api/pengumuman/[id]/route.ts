import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createNotFoundResponse, createErrorResponse } from "@/lib/api-response";

import { mockPengumuman } from "@/lib/mockData";

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

        // Return pengumuman with temporary incremented views without mutating the shared in-memory object permanently
        const response = {
            ...pengumuman,
            views: pengumuman.views + 1,
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
