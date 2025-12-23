import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createNotFoundResponse, createErrorResponse } from "@/lib/api-response";

// Mock data (should be in a shared file or database)
const mockBerita = [
    {
        id: 1,
        judul: "Peluncuran Portal Web Kalurahan Sijenggung",
        slug: "peluncuran-portal-web-kalurahan-sijenggung",
        ringkasan: "Portal web resmi Kalurahan Sijenggung telah diluncurkan untuk meningkatkan pelayanan masyarakat.",
        konten: "Portal web resmi Kalurahan Sijenggung telah diluncurkan dengan berbagai fitur canggih untuk meningkatkan pelayanan masyarakat...",
        gambar: "/images/berita/portal-launch.jpg",
        kategori: "Teknologi",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T10:00:00Z",
        createdAt: "2025-10-24T09:30:00Z",
        updatedAt: "2025-10-24T10:00:00Z",
        penulis: "Admin Kalurahan",
        views: 150,
    },
    {
        id: 2,
        judul: "Program Pembangunan Infrastruktur Tahun 2025",
        slug: "program-pembangunan-infrastruktur-tahun-2025",
        ringkasan:
            "Pemerintah Desa Sijenggung mengalokasikan dana untuk pembangunan infrastruktur jalan dan drainase.",
        konten: "Pemerintah Desa Sijenggung dalam tahun anggaran 2025 mengalokasikan dana pembangunan sebesar Rp 2.5 Miliar...",
        gambar: "/images/berita/infrastruktur.jpg",
        kategori: "Pembangunan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T14:30:00Z",
        createdAt: "2025-10-23T13:00:00Z",
        updatedAt: "2025-10-23T14:30:00Z",
        penulis: "Bagian Pembangunan",
        views: 89,
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
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID berita tidak valid"), { status: 400 });
        }

        const berita = mockBerita.find((b) => b.id === id);

        if (!berita) {
            return NextResponse.json(createNotFoundResponse("Berita tidak ditemukan"), { status: 404 });
        }

        // Increment view count (in a real implementation, this would update the database)
        berita.views += 1;

        return NextResponse.json(createSuccessResponse(berita, "Berita berhasil dimuat"));
    } catch {
        return NextResponse.json(createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memuat berita"), {
            status: 500,
        });
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
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID berita tidak valid"), { status: 400 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.judul || !body.konten) {
            return NextResponse.json(createErrorResponse("VALIDATION_ERROR", "Judul dan konten wajib diisi"), {
                status: 400,
            });
        }

        const beritaIndex = mockBerita.findIndex((b) => b.id === id);

        if (beritaIndex === -1) {
            return NextResponse.json(createNotFoundResponse("Berita tidak ditemukan"), { status: 404 });
        }

        // Update berita
        const updatedBerita = {
            ...mockBerita[beritaIndex],
            judul: body.judul,
            slug: body.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            ringkasan: body.ringkasan ?? mockBerita[beritaIndex].ringkasan,
            konten: body.konten,
            gambar: body.gambar !== undefined ? body.gambar : mockBerita[beritaIndex].gambar,
            kategori: body.kategori ?? mockBerita[beritaIndex].kategori,
            status: body.status ?? mockBerita[beritaIndex].status,
            updatedAt: new Date().toISOString(),
        };

        mockBerita[beritaIndex] = updatedBerita;

        return NextResponse.json(createSuccessResponse(updatedBerita, "Berita berhasil diperbarui"));
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memperbarui berita"),
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
            return NextResponse.json(createErrorResponse("INVALID_REQUEST", "ID berita tidak valid"), { status: 400 });
        }

        const beritaIndex = mockBerita.findIndex((b) => b.id === id);

        if (beritaIndex === -1) {
            return NextResponse.json(createNotFoundResponse("Berita tidak ditemukan"), { status: 404 });
        }

        // Remove berita from array (in a real implementation, this would delete from database)
        mockBerita.splice(beritaIndex, 1);

        return NextResponse.json(createSuccessResponse(null, "Berita berhasil dihapus"));
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat menghapus berita"),
            { status: 500 }
        );
    }
}
