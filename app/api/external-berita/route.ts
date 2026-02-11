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
        "&#8216;": "\u2018",
        "&#8217;": "\u2019",
        "&#8220;": "\u201c",
        "&#8221;": "\u201d",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entityMap[entity] || entity);
}

function stripUnsafeHtml(html: string) {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
}

function extractDivInnerHtmlByClass(html: string, classNeedle: string): string | null {
    const re = new RegExp(`<div[^>]+class=[\"'][^\"']*\\b${classNeedle}\\b[^\"']*[\"'][^>]*>`, "i");
    const match = html.match(re);
    if (!match?.[0] || match.index === undefined) return null;

    const startTag = match[0];
    const startIndex = match.index;
    const contentStart = startIndex + startTag.length;

    let depth = 1;
    let i = contentStart;
    const lower = html.toLowerCase();

    while (i < html.length) {
        const nextOpen = lower.indexOf("<div", i);
        const nextClose = lower.indexOf("</div", i);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth += 1;
            i = nextOpen + 4;
            continue;
        }

        depth -= 1;
        const closeEnd = lower.indexOf(">", nextClose);
        if (closeEnd === -1) break;

        if (depth === 0) {
            const inner = html.slice(contentStart, nextClose);
            const cleaned = stripUnsafeHtml(inner).trim();
            return cleaned || null;
        }

        i = closeEnd + 1;
    }

    return null;
}

function extractJsonLdArticleBody(html: string): string | null {
    const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
        (m) => m[1]
    );

    for (const raw of scripts) {
        const jsonText = raw.trim();
        if (!jsonText) continue;
        try {
            const parsed = JSON.parse(jsonText) as unknown;
            const candidates = Array.isArray(parsed) ? parsed : [parsed];
            for (const c of candidates) {
                if (typeof c !== "object" || c === null) continue;
                const obj = c as Record<string, unknown>;
                const body = obj.articleBody;
                if (typeof body === "string" && body.trim()) {
                    const escaped = body
                        .split(/\n+/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
                        .join("");
                    return escaped || null;
                }
            }
        } catch {}
    }

    return null;
}

function sanitizeContentHtml(contentHtml: string): string {
    if (!contentHtml) return contentHtml;
    let html = contentHtml;

    html = html.replace(
        /<img\b[^>]*\bsrc=["'](?:https?:\/\/sijenggung-banjarnegara\.desa\.id)?\/wp-content\/uploads\/[^"']+["'][^>]*>/gi,
        ""
    );
    html = html.replace(
        /<source\b[^>]*\bsrcset=["'](?:https?:\/\/sijenggung-banjarnegara\.desa\.id)?\/wp-content\/uploads\/[^"']+["'][^>]*>/gi,
        ""
    );

    return html;
}

function extractContentHtml(html: string): string {
    const isiContent = extractDivInnerHtmlByClass(html, "isicontent");
    if (isiContent && isiContent.length >= 100) return isiContent;

    const fromJsonLd = extractJsonLdArticleBody(html);
    if (fromJsonLd) return fromJsonLd;

    const patterns: RegExp[] = [
        /<div[^>]+class=["'][^"']*\bpost-content\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]+class=["'][^"']*\bentry-content\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
        /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    ];

    for (const re of patterns) {
        const match = html.match(re);
        if (!match?.[1]) continue;
        const cleaned = stripUnsafeHtml(match[1]).trim();
        if (cleaned.length >= 200) return cleaned;
    }

    const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch?.[1]) {
        return stripUnsafeHtml(bodyMatch[1]).trim();
    }

    return "";
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

        const baseUrl = "https://sijenggung-banjarnegara.desa.id";
        const categoryUrl = `${baseUrl}/artikel/kategori/berita-desa`;

        const categoryRes = await fetch(categoryUrl, {
            method: "GET",
            headers: { Accept: "text/html" },
            next: { revalidate: 3600, tags: ["opensid-berita-desa"] },
            signal: AbortSignal.timeout(30000),
        });
        if (!categoryRes.ok) {
            throw new Error(`Failed to fetch category page: ${categoryRes.status}`);
        }

        const categoryHtml = await categoryRes.text();
        const urlMatches = [...categoryHtml.matchAll(/\/artikel\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]+)/gi)]
            .map((m) => {
                const path = m[0].toLowerCase();
                const year = Number(m[1]);
                const month = Number(m[2]);
                const day = Number(m[3]);
                const s = m[4].toLowerCase();
                const dateKey = `${m[1]}-${m[2]}-${m[3]}`;
                return { path, slug: s, year, month, day, dateKey };
            })
            .filter((x) => x.slug === slug && x.year >= 2000 && x.month >= 1 && x.month <= 12 && x.day >= 1 && x.day <= 31)
            .sort((a, b) => (a.dateKey < b.dateKey ? 1 : a.dateKey > b.dateKey ? -1 : 0));

        const picked = urlMatches[0];
        if (!picked) {
            return NextResponse.json({ success: false, error: "Berita tidak ditemukan", data: null }, { status: 404 });
        }

        const articleUrl = `${baseUrl}${picked.path}`;
        const articleRes = await fetch(articleUrl, {
            method: "GET",
            headers: { Accept: "text/html" },
            next: { revalidate: 3600, tags: ["opensid-berita-desa"] },
            signal: AbortSignal.timeout(30000),
        });
        if (!articleRes.ok) {
            throw new Error(`Failed to fetch article page: ${articleRes.status}`);
        }

        const htmlRaw = await articleRes.text();
        const html = htmlRaw.replace(/\u0000/g, "");

        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["'][^>]*>/i);
        const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const titleRaw = ogTitleMatch?.[1] ?? titleTagMatch?.[1] ?? slug.replace(/-/g, " ");
        const title = decodeHtmlEntities(titleRaw).trim();

        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i);
        const featuredImage = ogImageMatch?.[1] ?? null;

        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
        const excerptRaw = decodeHtmlEntities(descMatch?.[1] ?? "").trim();
        const excerpt = excerptRaw ? `${excerptRaw.substring(0, 240)}...` : "";

        const publishedAt = new Date(Date.UTC(picked.year, picked.month - 1, picked.day, 0, 0, 0)).toISOString();
        const contentHtml = sanitizeContentHtml(extractContentHtml(html));

        return NextResponse.json({
            success: true,
            data: {
                id: `${picked.dateKey}-${slug}`,
                title,
                slug,
                excerpt,
                content: contentHtml,
                featuredImage,
                author: { name: "Admin Desa", avatar: "/images/default-avatar.png" },
                category: "Berita Desa",
                publishedAt,
                link: articleUrl,
            },
        });
    } catch {
        return NextResponse.json(
            { success: false, error: "Failed to fetch berita", data: null },
            {
                status: 500,
            }
        );
    }
}

