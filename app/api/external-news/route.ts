import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openSidData } from "@/lib/regionsData";

// Decode HTML entities like &nbsp;, &amp;, &hellip;, etc.
function decodeHtmlEntities(text: string): string {
    const entityMap: { [key: string]: string } = {
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",
        "&hellip;": "…",
        "&mdash;": "—",
        "&ndash;": "–",
        "&lsquo;": "‘",
        "&rsquo;": "’",
        "&ldquo;": "“",
        "&rdquo;": "”",
        "&#34;": '"',
        "&#160;": " ",
        "&#8211;": "–",
        "&#8212;": "—",
        "&#8216;": "‘",
        "&#8217;": "’",
        "&#8220;": "“",
        "&#8221;": "”",
        "&#8230;": "…",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        return entityMap[entity] || entity;
    });
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

async function fetchWordPressFallback(limit: number): Promise<any[]> {
    try {
        const wpApiUrl = `https://dispermadesppkb.banjarnegarakab.go.id/wp-json/wp/v2/posts?per_page=${limit}&_embed`;
        const res = await fetch(wpApiUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
            next: { revalidate: 3600, tags: ["dispermades-berita"] },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) return [];
        const posts = await res.json();
        if (!Array.isArray(posts)) return [];

        return posts.map((item: any) => {
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

            return {
                id: item.id ? String(item.id) : item.slug,
                title,
                slug: item.slug,
                excerpt,
                content: item.content?.rendered || "",
                featuredImage,
                readingTime: Math.max(1, Math.ceil((excerpt.split(/\s+/).filter(Boolean).length || 1) / 220)),
                author: {
                    name: "Admin Dispermades",
                    avatar: "/images/default-avatar.png",
                },
                category: "Berita Dispermades",
                categories: [
                    {
                        id: 1,
                        name: "Berita Dispermades",
                        slug: "berita-dispermades",
                    },
                ],
                tags: [],
                publishedAt,
                updatedAt: publishedAt,
                link: item.link || `https://dispermadesppkb.banjarnegarakab.go.id/${item.slug}/`,
                readTime: Math.max(1, Math.ceil((excerpt.split(/\s+/).filter(Boolean).length || 1) / 220)),
                isBreaking: false,
                isFeatured: false,
                isPinned: false,
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                shareCount: 0,
                isBookmarked: false,
            };
        });
    } catch {
        return [];
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = Math.max(1, Math.min(100, limitParam ? Number(limitParam) : 10));

        // 1. Gather all online desas
        const onlineDesas = Object.values(openSidData)
            .flat()
            .filter((desa) => desa.status === "Online" && desa.web && desa.web.trim() !== "")
            .map((desa) => ({
                name: desa.name.replace(/^Desa\s+/, ""),
                web: desa.web.replace(/\/$/, ""),
            }));

        if (onlineDesas.length === 0) {
            const fallback = await fetchWordPressFallback(limit);
            return NextResponse.json({ success: true, data: fallback, total: fallback.length });
        }

        // 2. Select target desas to query (Sijenggung + 8 random ones)
        const primaryDesa = onlineDesas.find((d) => d.web.toLowerCase().includes("sijenggung")) || {
            name: "Sijenggung",
            web: "https://sijenggung-banjarnegara.desa.id",
        };

        const otherDesas = onlineDesas.filter((d) => !d.web.toLowerCase().includes("sijenggung"));

        const randomDesas = [];
        const pool = [...otherDesas];
        const numToSelect = Math.min(8, pool.length);

        for (let i = 0; i < numToSelect; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            randomDesas.push(pool.splice(randomIndex, 1)[0]);
        }

        const targetDesas = [primaryDesa, ...randomDesas];

        // 3. Query desas in parallel
        const fetchResults = await Promise.allSettled(
            targetDesas.map(async (desa) => {
                const res = await fetch(`${desa.web}/internal_api/arsip`, {
                    method: "GET",
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        Accept: "application/json",
                        "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
                    },
                    next: { revalidate: 3600 },
                    signal: AbortSignal.timeout(3500),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                return { desa, data };
            })
        );

        // 4. Map and Aggregate articles
        const allArticles: any[] = [];

        for (const result of fetchResults) {
            if (result.status === "fulfilled" && result.value?.data?.data) {
                const { desa, data } = result.value;
                const articles = data.data;

                if (Array.isArray(articles)) {
                    for (const article of articles) {
                        if (!article.attributes) continue;

                        const attr = article.attributes;
                        const rawTitle = attr.judul || "";
                        const title = decodeHtmlEntities(rawTitle).trim();
                        if (!title) continue;

                        const rawExcerpt = attr.isi || "";
                        const excerptClean = stripHtml(rawExcerpt);
                        const excerpt = excerptClean ? `${excerptClean.substring(0, 200)}...` : "";

                        const publishedAt = parseOpenSIDDate(attr.tgl_upload);
                        const hostname = new URL(desa.web).hostname;
                        const originalSlug = attr.slug || attr.url_slug?.split("/").pop() || "";
                        const slug = `${hostname}_${originalSlug}`;

                        const featuredImage = normalizeImageUrl(attr.gambar, desa.web);
                        const authorName = attr.author?.nama || `Pemerintah Desa ${desa.name}`;

                        allArticles.push({
                            id: `${hostname}_${article.id}`,
                            title,
                            slug,
                            excerpt,
                            content: attr.isi || "",
                            featuredImage: featuredImage || null,
                            readingTime: Math.max(1, Math.ceil((excerpt.split(/\s+/).filter(Boolean).length || 1) / 220)),
                            author: {
                                name: authorName,
                                avatar: attr.author?.foto
                                    ? `${desa.web}/desa/upload/user_pamong/${attr.author.foto}`
                                    : "/images/default-avatar.png",
                            },
                            category: `Berita ${desa.name}`,
                            categories: [
                                {
                                    id: Number(attr.category?.id || 1),
                                    name: `Berita ${desa.name}`,
                                    slug: `berita-${desa.name.toLowerCase().replace(/\s+/g, "-")}`,
                                },
                            ],
                            tags: [],
                            publishedAt,
                            updatedAt: publishedAt,
                            link: attr.url_slug || `${desa.web}/artikel/${originalSlug}`,
                            readTime: Math.max(1, Math.ceil((excerpt.split(/\s+/).filter(Boolean).length || 1) / 220)),
                            isBreaking: false,
                            isFeatured: false,
                            isPinned: false,
                            viewCount: Number(attr.hit || 0),
                            likeCount: 0,
                            commentCount: 0,
                            shareCount: 0,
                            isBookmarked: false,
                        });
                    }
                }
            }
        }

        // 5. Sort by published date descending
        allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        // 6. If no articles aggregated, fallback to WordPress
        if (allArticles.length === 0) {
            const fallback = await fetchWordPressFallback(limit);
            return NextResponse.json({ success: true, data: fallback, total: fallback.length });
        }

        const slicedArticles = allArticles.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: slicedArticles,
            total: slicedArticles.length,
        });
    } catch (error: any) {
        console.error("Error aggregating OpenSID news:", error);
        // On error, try WordPress fallback
        try {
            const { searchParams: errorSearchParams } = new URL(request.url);
            const limitParam = errorSearchParams.get("limit");
            const limit = Math.max(1, Math.min(100, limitParam ? Number(limitParam) : 10));
            const fallback = await fetchWordPressFallback(limit);
            return NextResponse.json({ success: true, data: fallback, total: fallback.length });
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message || "Failed to aggregate news",
                    data: [],
                },
                { status: 500 }
            );
        }
    }
}
