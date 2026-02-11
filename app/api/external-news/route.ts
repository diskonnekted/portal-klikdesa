import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Decode HTML entities like &nbsp;, &amp;, &hellip;, etc.
function decodeHtmlEntities(text: string): string {
    const entityMap: { [key: string]: string } = {
        // Common punctuation and symbols
        "&nbsp;": " ",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&apos;": "'",

        // Extended punctuation
        "&hellip;": "…",
        "&mdash;": "—",
        "&ndash;": "–",
        "&lsquo;": "\u2018",
        "&rsquo;": "\u2019",
        "&ldquo;": "\u201c",
        "&rdquo;": "\u201d",
        "&sbquo;": "‚",
        "&bdquo;": "„",
        "&lsaquo;": "‹",
        "&rsaquo;": "›",
        "&laquo;": "«",
        "&raquo;": "»",
        "&prime;": "′",
        "&Prime;": "″",

        // Common special characters
        "&copy;": "©",
        "&reg;": "®",
        "&trade;": "™",
        "&euro;": "€",
        "&pound;": "£",
        "&yen;": "¥",
        "&cent;": "¢",

        // Accented characters (common ones)
        "&aacute;": "á",
        "&Aacute;": "Á",
        "&eacute;": "é",
        "&Eacute;": "É",
        "&iacute;": "í",
        "&Iacute;": "Í",
        "&oacute;": "ó",
        "&Oacute;": "Ó",
        "&uacute;": "ú",
        "&Uacute;": "Ú",
        "&ntilde;": "ñ",
        "&Ntilde;": "Ñ",
        "&uuml;": "ü",
        "&Uuml;": "Ü",

        // Mathematical symbols
        "&times;": "×",
        "&divide;": "÷",
        "&plusmn;": "±",
        "&deg;": "°",
        "&micro;": "µ",

        // Other common entities
        "&bull;": "•",
        "&middot;": "·",
        "&not;": "¬",
        "&shy;": "",
        "&circ;": "ˆ",
        "&tilde;": "˜",
        "&dagger;": "†",
        "&Dagger;": "‡",

        // Numeric entities (common ones)
        "&#34;": '"',
        "&#160;": " ",
        "&#161;": "¡",
        "&#162;": "¢",
        "&#163;": "£",
        "&#164;": "¤",
        "&#165;": "¥",
        "&#166;": "¦",
        "&#167;": "§",
        "&#168;": "¨",
        "&#169;": "©",
        "&#170;": "ª",
        "&#171;": "«",
        "&#172;": "¬",
        "&#173;": "",
        "&#174;": "®",
        "&#175;": "¯",
        "&#176;": "°",
        "&#177;": "±",
        "&#178;": "²",
        "&#179;": "³",
        "&#180;": "´",
        "&#185;": "¹",
        "&#186;": "º",
        "&#187;": "»",
        "&#188;": "¼",
        "&#189;": "½",
        "&#190;": "¾",
        "&#191;": "¿",
        "&#192;": "À",
        "&#193;": "Á",
        "&#194;": "Â",
        "&#195;": "Ã",
        "&#196;": "Ä",
        "&#197;": "Å",
        "&#198;": "Æ",
        "&#199;": "Ç",
        "&#200;": "È",
        "&#201;": "É",
        "&#202;": "Ê",
        "&#203;": "Ë",
        "&#204;": "Ì",
        "&#205;": "Í",
        "&#206;": "Î",
        "&#207;": "Ï",
        "&#208;": "Ð",
        "&#209;": "Ñ",
        "&#210;": "Ò",
        "&#211;": "Ó",
        "&#212;": "Ô",
        "&#213;": "Õ",
        "&#214;": "Ö",
        "&#215;": "×",
        "&#216;": "Ø",
        "&#217;": "Ù",
        "&#218;": "Ú",
        "&#219;": "Û",
        "&#220;": "Ü",
        "&#221;": "Ý",
        "&#222;": "Þ",
        "&#223;": "ß",
        "&#224;": "à",
        "&#225;": "á",
        "&#226;": "â",
        "&#227;": "ã",
        "&#228;": "ä",
        "&#229;": "å",
        "&#230;": "æ",
        "&#231;": "ç",
        "&#232;": "è",
        "&#233;": "é",
        "&#234;": "ê",
        "&#235;": "ë",
        "&#236;": "ì",
        "&#237;": "í",
        "&#238;": "î",
        "&#239;": "ï",
        "&#240;": "ð",
        "&#241;": "ñ",
        "&#242;": "ò",
        "&#243;": "ó",
        "&#244;": "ô",
        "&#245;": "õ",
        "&#246;": "ö",
        "&#247;": "÷",
        "&#248;": "ø",
        "&#249;": "ù",
        "&#250;": "ú",
        "&#251;": "û",
        "&#252;": "ü",
        "&#253;": "ý",
        "&#254;": "þ",
        "&#255;": "ÿ",
        "&#8230;": "…",
        "&#8211;": "–",
        "&#8212;": "—",
        "&#8216;": "\u2018",
        "&#8217;": "\u2019",
        "&#8220;": "\u201c",
        "&#8221;": "\u201d",
        "&#8249;": "‹",
        "&#8250;": "›",
        "&#8242;": "′",
        "&#8243;": "″",
    };

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        return entityMap[entity] || entity;
    });
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = Math.max(1, Math.min(100, limitParam ? Number(limitParam) : 10));

        const baseUrl = "https://sijenggung-banjarnegara.desa.id";
        const categoryUrl = `${baseUrl}/artikel/kategori/berita-desa`;

        const categoryRes = await fetch(categoryUrl, {
            method: "GET",
            headers: {
                Accept: "text/html",
            },
            next: {
                revalidate: 3600,
                tags: ["opensid-berita-desa"],
            },
            signal: AbortSignal.timeout(30000),
        });

        if (!categoryRes.ok) {
            throw new Error(`Failed to fetch category page: ${categoryRes.status}`);
        }

        const categoryHtml = await categoryRes.text();
        const urlMatches = [...categoryHtml.matchAll(/\/artikel\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]+)/gi)];
        const uniqueUrls = Array.from(
            new Map(
                urlMatches.map((m) => {
                    const path = m[0].toLowerCase();
                    const year = Number(m[1]);
                    const month = Number(m[2]);
                    const day = Number(m[3]);
                    const slug = m[4].toLowerCase();
                    const dateKey = `${m[1]}-${m[2]}-${m[3]}`;
                    return [path, { path, slug, year, month, day, dateKey }];
                })
            ).values()
        )
            .filter((x) => x.year >= 2000 && x.month >= 1 && x.month <= 12 && x.day >= 1 && x.day <= 31)
            .sort((a, b) => (a.dateKey < b.dateKey ? 1 : a.dateKey > b.dateKey ? -1 : a.slug.localeCompare(b.slug)))
            .slice(0, limit);

        async function fetchArticleMeta(path: string) {
            const url = `${baseUrl}${path}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "text/html",
                },
                next: {
                    revalidate: 3600,
                    tags: ["opensid-berita-desa"],
                },
                signal: AbortSignal.timeout(30000),
            });
            if (!res.ok) {
                throw new Error(`Failed to fetch article page: ${res.status}`);
            }
            const html = await res.text();

            const ogTitleMatch = html.match(/<meta\s+property=[\"']og:title[\"']\s+content=[\"']([^\"']+)[\"'][^>]*>/i);
            const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            const titleRaw = ogTitleMatch?.[1] ?? titleTagMatch?.[1] ?? "";

            const ogImageMatch = html.match(/<meta\s+property=[\"']og:image[\"']\s+content=[\"']([^\"']+)[\"'][^>]*>/i);
            const imageRaw = ogImageMatch?.[1] ?? null;

            const descMatch = html.match(/<meta\s+name=[\"']description[\"']\s+content=[\"']([^\"']*)[\"'][^>]*>/i);
            const descRaw = descMatch?.[1] ?? "";

            const cleanTitle = decodeHtmlEntities(titleRaw).trim();
            const cleanDesc = decodeHtmlEntities(descRaw).trim();

            return { title: cleanTitle, image: imageRaw, description: cleanDesc, url };
        }

        const metas: Array<{ path: string; slug: string; dateKey: string; year: number; month: number; day: number; meta?: Awaited<ReturnType<typeof fetchArticleMeta>> }> =
            [];

        for (const item of uniqueUrls) {
            try {
                const meta = await fetchArticleMeta(item.path);
                metas.push({ ...item, meta });
            } catch {
                metas.push({ ...item });
            }
        }

        const transformedPosts = metas.map((item) => {
            const isoDate = new Date(Date.UTC(item.year, item.month - 1, item.day, 0, 0, 0)).toISOString();
            const title = item.meta?.title || item.slug.replace(/-/g, " ");
            const excerpt = item.meta?.description ? `${item.meta.description.substring(0, 200)}...` : "";

            return {
                id: `${item.dateKey}-${item.slug}`,
                title,
                slug: item.slug,
                excerpt,
                content: "",
                featuredImage: item.meta?.image || null,
                readingTime: Math.max(1, Math.ceil((excerpt.split(/\s+/).filter(Boolean).length || 1) / 220)),
                author: {
                    name: "Admin Desa",
                    avatar: "/images/default-avatar.png",
                },
                category: "Berita Desa",
                categories: [
                    {
                        id: 0,
                        name: "Berita Desa",
                        slug: "berita-desa",
                    },
                ],
                tags: [],
                publishedAt: isoDate,
                updatedAt: isoDate,
                link: item.meta?.url || `${baseUrl}${item.path}`,
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
    } catch {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch news from OpenSID",
                data: [],
            },
            { status: 500 }
        );
    }
}
