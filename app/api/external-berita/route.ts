import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function decodeHtmlEntities(text: string): string {
    const entityMap: Record<string, string> = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",
        "&hellip;": "…",
        "&mdash;": "—",
        "&ndash;": "–",
        "&#8230;": "…",
        "&#8211;": "–",
        "&#8212;": "—",
        "&#8216;": "‘",
        "&#8217;": "’",
        "&#8220;": "“",
        "&#8221;": "”",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entityMap[entity] || entity);
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, "").trim();
}

function parseOpenSIDDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    try {
        const parts = dateStr.trim().split(/\s+/);
        if (!parts[0]) return new Date().toISOString();

        const dateParts = parts[0].split("-");
        const timeParts = parts[1] ? parts[1].split(":") : ["00", "00", "00"];

        let day, month, year;
        if (dateParts[0].length === 4) {
            year = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            day = parseInt(dateParts[2], 10);
        } else {
            day = parseInt(dateParts[0], 10);
            month = parseInt(dateParts[1], 10) - 1;
            year = parseInt(dateParts[2], 10);
        }

        const hour = parseInt(timeParts[0] || "0", 10);
        const minute = parseInt(timeParts[1] || "0", 10);
        const second = parseInt(timeParts[2] || "0", 10);

        const d = new Date(year, month, day, hour, minute, second);
        return d.toISOString();
    } catch {
        return new Date().toISOString();
    }
}

function normalizeImageUrl(gambar: string, baseUrl: string): string {
    if (!gambar) return "";
    let urlStr = gambar.trim();
    urlStr = urlStr.replace(/^[)\s]+|[)\s]+$/g, "");
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
        return urlStr.replace(/^http:\/\//i, "https://");
    }
    if (urlStr.startsWith("/")) {
        return `${baseUrl}${urlStr}`;
    }
    return `${baseUrl}/desa/upload/artikel/sedang_${urlStr}`;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = (searchParams.get("slug") ?? "").trim().toLowerCase();
        if (!slug) {
            return NextResponse.json(
                { success: false, error: "Missing slug", data: null },
                { status: 400 }
            );
        }

        let targetHost = "";
        let originalSlug = slug;

        if (slug.includes("_")) {
            const parts = slug.split("_");
            targetHost = parts[0];
            originalSlug = parts.slice(1).join("_");
        }

        // Case A: OpenSID Article (from specific village site)
        if (targetHost) {
            const baseUrl = `https://${targetHost}`;
            const res = await fetch(`${baseUrl}/internal_api/arsip`, {
                method: "GET",
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    Accept: "application/json",
                },
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(10000),
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch from OpenSID village site: ${res.status}`);
            }

            const data = await res.json();
            const articles = data.data;

            if (!Array.isArray(articles)) {
                return NextResponse.json({ success: false, error: "Format data tidak valid dari situs desa", data: null }, { status: 404 });
            }

            const article = articles.find(
                (a: any) =>
                    a.attributes?.slug?.toLowerCase() === originalSlug ||
                    (a.attributes?.url_slug?.split("/").pop() || "").toLowerCase() === originalSlug
            );

            if (!article) {
                return NextResponse.json({ success: false, error: "Berita tidak ditemukan di situs desa", data: null }, { status: 404 });
            }

            const attr = article.attributes;
            const rawTitle = attr.judul || "";
            const title = decodeHtmlEntities(rawTitle).trim();
            const rawExcerpt = attr.isi || "";
            const excerptClean = stripHtml(rawExcerpt);
            const excerpt = excerptClean ? `${excerptClean.substring(0, 200)}...` : "";
            const publishedAt = parseOpenSIDDate(attr.tgl_upload);
            const featuredImage = normalizeImageUrl(attr.gambar, baseUrl);

            // Derive a readable village name from hostname
            const desaSubdomain = targetHost.split(".")[0] || "";
            const desaBaseName = desaSubdomain.split("-")[0] || "Desa";
            const villageName = desaBaseName.charAt(0).toUpperCase() + desaBaseName.slice(1);

            const authorName = attr.author?.nama || `Pemerintah Desa ${villageName}`;

            return NextResponse.json({
                success: true,
                data: {
                    id: `${targetHost}_${article.id}`,
                    title,
                    slug,
                    excerpt,
                    content: attr.isi || "",
                    featuredImage: featuredImage || null,
                    author: {
                        name: authorName,
                        avatar: attr.author?.foto
                            ? `${baseUrl}/desa/upload/user_pamong/${attr.author.foto}`
                            : "/images/default-avatar.png",
                    },
                    category: `Berita ${villageName}`,
                    publishedAt,
                    link: attr.url_slug || `${baseUrl}/artikel/${originalSlug}`,
                },
            });
        }

        // Case B: Legacy / WordPress fallback (from Dispermades website)
        const wpApiUrl = `https://dispermadesppkb.banjarnegarakab.go.id/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;

        const res = await fetch(wpApiUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
            next: { revalidate: 3600, tags: ["dispermades-berita"] },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch from Dispermades: ${res.status}`);
        }

        const posts = await res.json();
        if (!Array.isArray(posts) || posts.length === 0) {
            return NextResponse.json({ success: false, error: "Berita tidak ditemukan", data: null }, { status: 404 });
        }

        const item = posts[0];

        const rawTitle = item.title?.rendered || "";
        const title = decodeHtmlEntities(rawTitle).trim();

        const rawExcerpt = item.excerpt?.rendered || item.content?.rendered || "";
        const excerptClean = stripHtml(rawExcerpt);
        const excerpt = excerptClean ? `${excerptClean.substring(0, 200)}...` : "";

        const publishedAt = item.date ? new Date(item.date).toISOString() : new Date().toISOString();

        let featuredImage = null;
        if (item._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
            featuredImage = item._embedded["wp:featuredmedia"][0].source_url;
        }

        return NextResponse.json({
            success: true,
            data: {
                id: item.id ? String(item.id) : slug,
                title,
                slug,
                excerpt,
                content: item.content?.rendered || "",
                featuredImage,
                author: { name: "Admin Dispermades", avatar: "/images/default-avatar.png" },
                category: "Berita Dispermades",
                publishedAt,
                link: item.link || `https://dispermadesppkb.banjarnegarakab.go.id/${slug}/`,
            },
        });
    } catch (error: any) {
        console.error("Error fetching single Dispermades/OpenSID news:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch berita", data: null },
            { status: 500 }
        );
    }
}
