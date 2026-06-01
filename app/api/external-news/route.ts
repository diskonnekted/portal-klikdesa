import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = Math.max(1, Math.min(100, limitParam ? Number(limitParam) : 10));

        // Pindah ambil berita ke https://dispermadesppkb.banjarnegarakab.go.id
        const wpApiUrl = `https://dispermadesppkb.banjarnegarakab.go.id/wp-json/wp/v2/posts?per_page=${limit}&_embed`;

        const res = await fetch(wpApiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            next: {
                revalidate: 3600,
                tags: ["dispermades-berita"],
            },
            signal: AbortSignal.timeout(30000),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch from Dispermades: ${res.status}`);
        }

        const posts = await res.json();
        
        if (!Array.isArray(posts)) {
            throw new Error("Invalid response format from Dispermades API");
        }

        const transformedPosts = posts.map((item: any) => {
            const rawTitle = item.title?.rendered || "";
            const title = decodeHtmlEntities(rawTitle).trim();
            
            const rawExcerpt = item.excerpt?.rendered || item.content?.rendered || "";
            const excerptClean = stripHtml(rawExcerpt);
            const excerpt = excerptClean ? `${excerptClean.substring(0, 200)}...` : "";

            const publishedAt = item.date ? new Date(item.date).toISOString() : new Date().toISOString();
            
            // Get featured image URL from embedded media if available
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

        return NextResponse.json({
            success: true,
            data: transformedPosts,
            total: transformedPosts.length,
        });
    } catch (error: any) {
        console.error("Error fetching Dispermades news:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch news from Dispermades",
                data: [],
            },
            { status: 500 }
        );
    }
}
