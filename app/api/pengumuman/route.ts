import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/api-response";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@/lib/api-response";
import { mockPengumuman } from "@/lib/mockData";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("halaman") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "10");
        const prioritas = searchParams.get("prioritas");
        const kategori = searchParams.get("kategori");
        const search = searchParams.get("search");
        const aktif = searchParams.get("aktif"); // 'true' untuk hanya yang belum kadaluarsa

        // Filter pengumuman based on parameters
        let filteredPengumuman = mockPengumuman.filter((pengumuman) => {
            // Only show published announcements
            if (pengumuman.status !== "PUBLISHED") return false;

            // Filter by active status (not expired)
            if (aktif === "true") {
                const now = new Date();
                const expiresAt = new Date(pengumuman.expiresAt);
                if (now > expiresAt) return false;
            }

            return true;
        });

        if (prioritas) {
            filteredPengumuman = filteredPengumuman.filter(
                (pengumuman) => pengumuman.prioritas.toLowerCase() === prioritas.toLowerCase()
            );
        }

        if (kategori) {
            filteredPengumuman = filteredPengumuman.filter((pengumuman) =>
                pengumuman.kategori.toLowerCase().includes(kategori.toLowerCase())
            );
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredPengumuman = filteredPengumuman.filter(
                (pengumuman) =>
                    pengumuman.judul.toLowerCase().includes(searchLower) ||
                    pengumuman.konten.toLowerCase().includes(searchLower) ||
                    pengumuman.kategori.toLowerCase().includes(searchLower)
            );
        }

        // Sort by priority and publication date
        filteredPengumuman.sort((a, b) => {
            const priorityOrder = { PENTING: 4, TINGGI: 3, NORMAL: 2, RENDAH: 1 };
            const priorityDiff =
                (priorityOrder[b.prioritas as keyof typeof priorityOrder] || 0) -
                (priorityOrder[a.prioritas as keyof typeof priorityOrder] || 0);

            if (priorityDiff !== 0) return priorityDiff;

            // If same priority, sort by publication date (newest first)
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
        });

        // Pagination
        const total = filteredPengumuman.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pengumuman = filteredPengumuman.slice(startIndex, endIndex);

        // Add isExpired flag to each announcement
        const pengumumanWithStatus = pengumuman.map((item) => ({
            ...item,
            isExpired: new Date() > new Date(item.expiresAt),
            daysUntilExpiry: Math.ceil(
                (new Date(item.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            ),
        }));

        const meta = {
            total,
            halaman: page,
            perHalaman: limit,
            totalHalaman: totalPages,
        };

        return NextResponse.json(
            createSuccessResponse(pengumumanWithStatus, "Daftar pengumuman berhasil dimuat", meta)
        );
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat memuat pengumuman"),
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const body = await request.json();

        // Required fields validation
        const validationErrors: Record<string, string> = {};
        if (!body.judul) validationErrors.judul = "Judul wajib diisi";
        if (!body.konten) validationErrors.konten = "Konten wajib diisi";

        if (Object.keys(validationErrors).length > 0) {
            return NextResponse.json(createValidationErrorResponse(validationErrors), { status: 400 });
        }

        // Set default expiry date if not provided (30 days from now)
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + 30);

        // Mock creating a new pengumuman
        const newPengumuman = {
            id: mockPengumuman.length + 1,
            judul: body.judul.trim(),
            konten: body.konten.trim(),
            prioritas: body.prioritas ?? "NORMAL",
            kategori: body.kategori ?? "Umum",
            status: body.status ?? "DRAFT",
            publishedAt: body.status === "PUBLISHED" ? new Date().toISOString() : null,
            expiresAt: body.expiresAt ?? defaultExpiry.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            penulis: body.penulis ?? "Admin Desa",
            lampiran: body.lampiran ?? [],
            views: 0,
        };

        mockPengumuman.push(newPengumuman);

        return NextResponse.json(createSuccessResponse(newPengumuman, "Pengumuman berhasil dibuat"), { status: 201 });
    } catch {
        return NextResponse.json(
            createErrorResponse("INTERNAL_SERVER_ERROR", "Terjadi kesalahan saat membuat pengumuman"),
            { status: 500 }
        );
    }
}

