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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = (searchParams.get("slug") ?? "").trim().toLowerCase();
        if (!slug) {
            return NextResponse.json(
                { success: false, error: "Missing slug", data: null },
                {
                    status: 400,
                }
            );
        }

        // Pindah ambil berita ke https://dispermadesppkb.banjarnegarakab.go.id menggunakan slug
        const wpApiUrl = `https://dispermadesppkb.banjarnegarakab.go.id/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;

        const res = await fetch(wpApiUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
            next: { revalidate: 3600, tags: ["dispermades-berita"] },
            signal: AbortSignal.timeout(30000),
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
        console.error("Error fetching single Dispermades news:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch berita", data: null },
            {
                status: 500,
            }
        );
    }
}
