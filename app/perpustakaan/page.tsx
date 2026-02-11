import Image from "next/image";
import { BookOpen, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BookType = "Fisik" | "E-Book";

type LibraryBook = {
    type: BookType;
    title: string;
    author: string;
    isBorrowed: boolean;
    coverUrl: string | null;
};

async function fetchInternetCoverUrl(title: string, author: string): Promise<string | null> {
    const params = new URLSearchParams();
    params.set("title", title);
    params.set("author", author);
    params.set("limit", "1");

    const url = `https://openlibrary.org/search.json?${params.toString()}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
            },
            next: { revalidate: 60 * 60 * 24 * 7 },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { docs?: Array<{ cover_i?: number; isbn?: string[] }> };
        const first = json.docs?.[0];
        if (!first) return null;

        if (typeof first.cover_i === "number" && Number.isFinite(first.cover_i)) {
            return `https://covers.openlibrary.org/b/id/${first.cover_i}-L.jpg`;
        }

        const isbn = first.isbn?.find((x) => typeof x === "string" && x.trim());
        if (isbn) {
            return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg`;
        }
        return null;
    } catch {
        return null;
    }
}

function decodeHtmlEntities(text: string): string {
    const entityMap: Record<string, string> = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
    };
    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entityMap[entity] ?? entity);
}

function htmlToLines(html: string): string[] {
    const withoutScripts = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");

    const withNewlines = withoutScripts
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(div|p|li|h[1-6]|tr|td|th|section|article|header|footer)>/gi, "\n");

    const text = decodeHtmlEntities(withNewlines.replace(/<[^>]+>/g, " ")).replace(/\u00a0/g, " ");

    return text
        .split(/\r?\n+/)
        .map((l) => l.replace(/\s+/g, " ").trim())
        .filter(Boolean);
}

function normalizeBookKey(text: string): string {
    return decodeHtmlEntities(text).replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function parseCoverMap(html: string, baseOrigin: string): Record<string, string> {
    const map: Record<string, string> = {};
    const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    for (const tag of imgTags) {
        const rawSrc = decodeHtmlEntities(tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? "").trim();
        const rawAlt = decodeHtmlEntities(tag.match(/\balt=["']([^"']+)["']/i)?.[1] ?? "").trim();
        if (!rawSrc || !rawAlt) continue;

        let absolute = "";
        try {
            absolute = new URL(rawSrc, baseOrigin).toString();
        } catch {
            continue;
        }

        const key = normalizeBookKey(rawAlt);
        if (!map[key]) {
            map[key] = absolute;
        }
    }
    return map;
}

function parseTakadisaIndex(html: string): { headline: string; name: string; description: string; books: LibraryBook[] } {
    const baseOrigin = "https://takadisa.smartdesa.net";
    const lines = htmlToLines(html);
    const coverByTitle = parseCoverMap(html, baseOrigin);

    const headline = lines.find((l) => l.toLowerCase().includes("selamat datang di perpustakaan")) ?? "Perpustakaan Desa";
    const name = lines.find((l) => l.trim().toUpperCase() === "TAKADISA") ?? "TAKADISA";
    const description =
        lines.find((l) => l.toLowerCase().includes("koleksi buku") && l.toLowerCase().includes("desa")) ??
        "Koleksi buku fisik dan digital Desa Sijenggung";

    const books: LibraryBook[] = [];

    let pendingBorrowed = false;
    for (let i = 0; i < lines.length; i += 1) {
        const current = lines[i];
        if (current.toUpperCase() === "DIPINJAM") {
            pendingBorrowed = true;
            continue;
        }

        const normalized = current.toLowerCase();
        const isType = normalized === "fisik" || normalized === "e-book" || normalized === "ebook";
        if (!isType) continue;

        const type: BookType = normalized === "fisik" ? "Fisik" : "E-Book";
        let j = i + 1;
        while (j < lines.length && lines[j].trim().toLowerCase() === "lihat detail") {
            j += 1;
        }

        const title = lines[j]?.trim();
        const author = lines[j + 1]?.trim();
        const authorLower = author?.toLowerCase() ?? "";
        if (!title || !author) continue;
        if (authorLower === "fisik" || authorLower === "e-book" || authorLower === "ebook" || authorLower === "lihat detail") continue;

        books.push({
            type,
            title,
            author,
            isBorrowed: pendingBorrowed,
            coverUrl: coverByTitle[normalizeBookKey(title)] ?? null,
        });

        pendingBorrowed = false;
        i = j + 1;
    }

    const uniqueBooks = books.filter((b, idx) => books.findIndex((x) => x.type === b.type && x.title === b.title && x.author === b.author) === idx);

    return { headline, name, description, books: uniqueBooks };
}

export const dynamic = "force-dynamic";

export default async function PerpustakaanPage() {
    const sourceUrl = "https://takadisa.smartdesa.net/index.php";

    let data: { headline: string; name: string; description: string; books: LibraryBook[] } | null = null;
    try {
        const res = await fetch(sourceUrl, {
            headers: { Accept: "text/html" },
            next: { revalidate: 3600 },
        });
        if (res.ok) {
            const html = await res.text();
            data = parseTakadisaIndex(html);
        }
    } catch {
        data = null;
    }

    const books = data?.books ?? [];
    const shownBooks = books.slice(0, 24);
    const coverCache = new Map<string, string | null>();
    const shownBooksWithInternetCover = await Promise.all(
        shownBooks.map(async (b) => {
            if (b.coverUrl) return b;
            const key = `${normalizeBookKey(b.title)}|${normalizeBookKey(b.author)}`;
            if (coverCache.has(key)) {
                return { ...b, coverUrl: coverCache.get(key) ?? null };
            }

            const fetched = await fetchInternetCoverUrl(b.title, b.author);
            coverCache.set(key, fetched);
            return { ...b, coverUrl: fetched };
        })
    );

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-200 rounded-full mb-4">
                    <BookOpen className="h-10 w-10 text-gray-900" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{data?.name ?? "Perpustakaan Desa"}</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{data?.description ?? "Koleksi buku fisik dan digital"}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                            Buka TAKADISA <ExternalLink className="h-4 w-4" />
                        </Button>
                    </a>
                </div>
            </div>

            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-xl">{data?.headline ?? "Perpustakaan Desa"}</CardTitle>
                        <Badge variant="secondary">{books.length ? `${books.length} buku` : "Belum ada data"}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {!books.length ? (
                        <div className="text-gray-600">
                            Gagal mengambil data dari TAKADISA. Silakan buka langsung dari tautan di atas.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {shownBooksWithInternetCover.map((b) => (
                                <Card key={`${b.type}-${b.title}-${b.author}`} className="overflow-hidden">
                                    <div className="aspect-[2/3] bg-muted overflow-hidden relative">
                                        {b.coverUrl ? (
                                            <Image
                                                src={
                                                    b.coverUrl.startsWith("https://takadisa.smartdesa.net/uploads/covers/")
                                                        ? `/api/takadisa-image?url=${encodeURIComponent(b.coverUrl)}`
                                                        : b.coverUrl
                                                }
                                                alt={b.title}
                                                fill
                                                unoptimized={b.coverUrl.startsWith("https://takadisa.smartdesa.net/uploads/covers/")}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                                Tidak ada sampul
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge variant="outline">{b.type}</Badge>
                                            {b.isBorrowed ? (
                                                <Badge className="bg-red-100 text-red-800">Dipinjam</Badge>
                                            ) : (
                                                <Badge className="bg-secondary-200 text-gray-900">Tersedia</Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-base leading-snug">{b.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-gray-600">{b.author}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {books.length > shownBooks.length && (
                        <div className="mt-4 text-sm text-gray-500">
                            Menampilkan {shownBooks.length} dari {books.length} buku. Lihat lengkap di TAKADISA.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
