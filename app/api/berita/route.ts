import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@/lib/api-response";

import { mockBerita } from "@/lib/mockData";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("halaman") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "10");
        const kategori = searchParams.get("kategori");
        const search = searchParams.get("search");

        // Filter berita based on parameters
        let filteredBerita = mockBerita.filter((berita) => berita.status === "PUBLISHED");

        if (kategori) {
            filteredBerita = filteredBerita.filter(
                (berita) => berita.kategori.toLowerCase() === kategori.toLowerCase()
            );
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredBerita = filteredBerita.filter(
                (berita) =>
                    berita.judul.toLowerCase().includes(searchLower) ||
                    berita.ringkasan.toLowerCase().includes(searchLower) ||
                    berita.konten.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const total = filteredBerita.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const berita = filteredBerita.slice(startIndex, endIndex);

        const meta = {
            total,
            halaman: page,
            perHalaman: limit,
            totalHalaman: totalPages,
        };

        return NextResponse.json(createSuccessResponse(berita, "Daftar berita berhasil dimuat", meta));
    } catch {
        return NextResponse.json(createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memuat berita"), {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const body = await request.json();

        // Basic validation
        const validationErrors: Record<string, string> = {};
        if (!body.judul) validationErrors.judul = "Judul wajib diisi";
        if (!body.konten) validationErrors.konten = "Konten wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json(createValidationErrorResponse(validationErrors), { status: 400 });
        }

        // Mock creating a new berita
        const newBerita = {
            id: mockBerita.length + 1,
            judul: body.judul,
            slug: body.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            ringkasan: body.ringkasan ?? "",
            konten: body.konten,
            gambar: body.gambar ?? null,
            kategori: body.kategori ?? "umum",
            status: body.status ?? "DRAFT",
            publishedAt: body.status === "PUBLISHED" ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            penulis: body.penulis ?? "Admin",
            views: 0,
        };

        mockBerita.push(newBerita);

        return NextResponse.json(createSuccessResponse(newBerita, "Berita berhasil dibuat"), { status: 201 });
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat membuat berita"),
            { status: 500 }
        );
    }
}

