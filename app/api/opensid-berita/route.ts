import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { fetchOpenSIDArsip } from "@/lib/api-helpers"; // Commented as unused
import { env } from "process";

// Type definitions for OpenSID article structure
interface OpenSIDArticle {
    id: string;
    attributes: Record<string, unknown> & {
        url_slug: string;
        isi?: string;
        gambar?: string;
    };
}

// Helper function to force HTTPS on all image URLs in HTML content
function transformToHTTPS(html: string): string {
    if (!html) return html;
    // Replace all http:// with https:// in img src, background-image, etc.
    // Using case-insensitive matching and global flag
    return html.replace(/http:\/\//gi, "https://");
}

// Normalize image URL to use configured OpenSID host and remove illegal characters
function normalizeImageUrl(raw: string): string {
    if (!raw) return raw;
    let urlStr = raw.trim();
    // Remove trailing/leading parentheses or stray characters
    urlStr = urlStr.replace(/^[)\s]+|[)\s]+$/g, "");
    // Ensure https
    urlStr = urlStr.replace(/^http:\/\//, "https://");

    const base = (env.OPENSID_API_URL ?? "https://sijenggung-banjarnegara.desa.id").replace(/^http:\/\//, "https://");
    try {
        // If relative path
        if (urlStr.startsWith("/")) {
            return `${base}${urlStr}`;
        }
        // If filename only
        if (!urlStr.includes("/")) {
            return `${base}/desa/upload/artikel/sedang_${urlStr}`;
        }
        // If absolute URL with different host, rewrite to base host
        const u = new URL(urlStr);
        const b = new URL(base);
        if (u.hostname !== b.hostname) {
            return `${b.origin}${u.pathname}`;
        }
        return u.toString();
    } catch {
        // Fallback to base host with artikel path
        return `${base}/desa/upload/artikel/${urlStr.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kategori = searchParams.get("kategori");
        const kategoriSlug = searchParams.get("kategori_slug") ?? "berita-desa";

        // Fetch news data from external API
        const response = await fetch(`${env.OPENSID_API_URL ?? "https://sijenggung-banjarnegara.desa.id"}/internal_api/arsip`, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "application/json",
                "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            },
            cache: "no-store",
            next: {
                revalidate: 0,
                tags: ["opensid-data-berita"],
            },
            signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch from OpenSID API: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data?.data) {
            return NextResponse.json({ data: [], meta: { pagination: { total: 0 } } });
        }

        let articles = data.data;

        // Sort by ID descending (latest posts first - id=25 is newer than id=1)
        articles = articles.sort((a: OpenSIDArticle, b: OpenSIDArticle) => parseInt(b.id) - parseInt(a.id));

        if (kategori) {
            articles = articles.filter((article: OpenSIDArticle) => {
                // @ts-expect-error OpenSID category shape differs by API response
                return article.attributes.category?.id === kategori;
            });
        }
        if (kategoriSlug) {
            const normalizedSlug = kategoriSlug.toLowerCase().trim();
            articles = articles.filter((article: OpenSIDArticle) => {
                // @ts-expect-error OpenSID category slug may be missing or non-string
                const categorySlug = ((article.attributes.category?.slug ?? "") as string).toLowerCase();
                // @ts-expect-error OpenSID category label may be missing or non-string
                const categoryLabel = ((article.attributes.category?.kategori ?? "") as string).toLowerCase();
                const urlSlug = ((article.attributes.url_slug as string) || "").toLowerCase();
                const hyphenatedLabel = categoryLabel.replace(/\s+/g, "-");

                const slugMatch = categorySlug === normalizedSlug || hyphenatedLabel === normalizedSlug;
                const pathMatch =
                    urlSlug.includes(`/artikel/kategori/${normalizedSlug}/`) ||
                    urlSlug.includes(`/artikel/${normalizedSlug}/`) ||
                    urlSlug.includes(`${normalizedSlug}/`);
                return slugMatch || pathMatch;
            });
        }

        // Add slug field and transform data
        articles = articles.map((article: OpenSIDArticle) => {
            // Extract slug from url_slug
            const urlSlug = (article.attributes.url_slug as string) || "";
            article.attributes.slug = urlSlug.split("/").pop() || urlSlug;

            // Transform the content HTML
            if (article.attributes.isi) {
                article.attributes.isi = transformToHTTPS(article.attributes.isi as string);
            }
            // Transform image URLs to OpenSID pattern
            if (article.attributes.gambar) {
                const imageUrl = normalizeImageUrl(article.attributes.gambar as string);
                article.attributes.gambar = imageUrl;
            }
            return article;
        });

        // Return raw data for client-side transformation
        return NextResponse.json({
            data: articles,
            meta: { total: articles.length },
        });
    } catch (error) {
        return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
    }
}
