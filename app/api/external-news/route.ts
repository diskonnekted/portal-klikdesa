import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openSidData } from "@/lib/regionsData";

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    categories: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
    publishedAt: string;
    updatedAt: string;
    link: string;
    readTime: number;
    isBreaking: boolean;
    isFeatured: boolean;
    isPinned: boolean;
    viewCount: number;
    likeCount: number;
    readingTime?: number;
    commentCount?: number;
    shareCount?: number;
    isBookmarked?: boolean;
}

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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = Math.max(1, Math.min(100, limitParam ? Number(limitParam) : 10));

        // Static list of known working desas that bypass Cloudflare and have active news
        const STATIC_WORKING_DESAS = [
            { name: "Prendengan", web: "https://prendengan-banjarmangu.sistemdata.id" },
            { name: "Clapar", web: "https://clapar-madukara.webdeva.io" },
            { name: "Karekan", web: "https://karekan-banjarnegara.desa.id" },
            { name: "Pagentan", web: "https://pagentan-banjarnegara.desa.id" },
            { name: "Pingit Lor", web: "https://pingitlor-pandanarum.webdeva.io" },
            { name: "Pringamba", web: "https://pringamba-pandanarum.webdeva.io" },
            { name: "Susukan", web: "https://susukan-wanayasa.webdeva.io" },
            { name: "Pagak", web: "https://pagak.layanandesa.cloud" }
        ];

        // 1. Gather all online desas (fetch dynamically from Clasnet portal pages 1 and 2 in parallel)
        let onlineDesas: Array<{ name: string; web: string }> = [];

        try {
            const pages = [1, 2];
            const listResponses = await Promise.all(
                pages.map(p =>
                    fetch(`https://sid.clasnet.co.id/desa.php?page=${p}&q=&kec=&sid=&berita=&db=&dev=&per=200`, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
                        },
                        signal: AbortSignal.timeout(8000),
                    })
                )
            );

            for (const listRes of listResponses) {
                if (listRes.ok) {
                    const html = await listRes.text();
                    // Tag-bounded regex to prevent cross-row mismatching
                    const regex = /data-desa="([^"]+)"[^>]*?data-website="([^"]+)"/g;
                    let match;
                    while ((match = regex.exec(html)) !== null) {
                        const name = match[1].replace(/^Desa\s+/, "").trim();
                        const web = match[2].trim();
                        if (web.startsWith("http")) {
                            onlineDesas.push({
                                name,
                                web: web.replace(/\/$/, ""),
                            });
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch dynamic online desas, using fallback:", err);
        }

        // Fallback to local regionsData if dynamic fetch failed or returned empty
        if (onlineDesas.length === 0) {
            onlineDesas = Object.values(openSidData)
                .flat()
                .filter((desa) => desa.status === "Online" && desa.web && desa.web.trim() !== "")
                .map((desa) => ({
                    name: desa.name.replace(/^Desa\s+/, ""),
                    web: desa.web.replace(/\/$/, ""),
                }));
        }

        // Explicitly allowed .desa.id domains that bypass Cloudflare and work
        const allowedDesaIdHosts = [
            "sijenggung-banjarnegara.desa.id",
            "karekan-banjarnegara.desa.id",
            "pagentan-banjarnegara.desa.id"
        ];

        // Filter out desas that are behind Cloudflare (which ends in .desa.id except our allowed hosts)
        const nonCfDesas = onlineDesas.filter((desa) => {
            try {
                const hostname = new URL(desa.web).hostname;
                if (allowedDesaIdHosts.includes(hostname)) return true;
                if (hostname.endsWith("desa.id")) return false;
                return true;
            } catch {
                return false;
            }
        });

        // Merge with our STATIC_WORKING_DESAS to guarantee they are included and have correct names
        const desaMap = new Map<string, { name: string; web: string }>();
        for (const d of nonCfDesas) {
            try {
                const hostname = new URL(d.web).hostname;
                desaMap.set(hostname, d);
            } catch {}
        }
        for (const d of STATIC_WORKING_DESAS) {
            try {
                const hostname = new URL(d.web).hostname;
                desaMap.set(hostname, d);
            } catch {}
        }

        const finalDesasList = Array.from(desaMap.values());

        if (finalDesasList.length === 0) {
            return NextResponse.json({ success: true, data: [], total: 0 });
        }

        // 2. Select target desas to query (always include priority/active desas, fill up to 25 with others)
        const priorityHostnames = new Set(STATIC_WORKING_DESAS.map(d => {
            try { return new URL(d.web).hostname; } catch { return ""; }
        }).filter(Boolean));

        const priorityDesas: Array<{ name: string; web: string }> = [];
        const otherDesas: Array<{ name: string; web: string }> = [];

        for (const d of finalDesasList) {
            try {
                const hostname = new URL(d.web).hostname;
                if (priorityHostnames.has(hostname)) {
                    priorityDesas.push(d);
                } else {
                    otherDesas.push(d);
                }
            } catch {
                otherDesas.push(d);
            }
        }

        const shuffledOthers = [...otherDesas];
        for (let i = shuffledOthers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOthers[i], shuffledOthers[j]] = [shuffledOthers[j], shuffledOthers[i]];
        }

        const targetDesas = [
            ...priorityDesas,
            ...shuffledOthers.slice(0, Math.max(0, 25 - priorityDesas.length))
        ];

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
                    signal: AbortSignal.timeout(4000),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                // Protect against Cloudflare challenge responses
                const serverHeader = res.headers.get("server") || "";
                if (serverHeader.toLowerCase().includes("cloudflare")) {
                    throw new Error("Cloudflare blocked");
                }

                const data = await res.json();
                return { desa, data };
            })
        );

        // 4. Map and Aggregate articles
        const allArticles: Article[] = [];

        for (const result of fetchResults) {
            if (result.status === "fulfilled" && result.value?.data?.data) {
                const { desa, data } = result.value;
                const articles = data.data;

                if (Array.isArray(articles)) {
                    // Limit to 10 latest articles per village to ensure rich content across the feed
                    const villageArticles = articles.slice(0, 10);
                    
                    for (const article of villageArticles) {
                        if (!article.attributes) continue;

                        const attr = article.attributes;
                        const rawTitle = attr.judul || "";
                        const title = decodeHtmlEntities(rawTitle).trim();
                        if (!title) continue;

                        // Filter out default OpenSID placeholder articles to keep the feed fresh and dynamic
                        const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
                        const isPlaceholder = [
                            "pembangunan desa menuju kemajuan dan kemandirian",
                            "kegiatan warga desa",
                            "mata pencaharian masyarakat desa",
                            "penduduk desa",
                            "potensi alam desa",
                            "potensi wilayah",
                            "potensi wilayah desa",
                            "visi dan misi",
                            "sejarah desa",
                            "profil wilayah desa",
                            "pemerintah desa",
                            "awal mula sid",
                            "profil desa",
                            "profil masyarakat desa",
                            "profil wilayah",
                            "kontak kami",
                            "badan permusyawaratan desa",
                            "lembaga kemasyarakatan",
                            "undang undang",
                            "peraturan pemerintah",
                            "peraturan desa",
                            "peraturan kepala desa",
                            "keputusan kepala desa",
                            "panduan",
                            "pengaduan",
                            "profil potensi desa",
                            "lkmd",
                            "karang taruna",
                            "rt rw",
                            "lpmd",
                            "pemberdayaan kesejahteraan keluarga",
                            "posyandu",
                            "informasi publik",
                            "struktur organisasi",
                            "wilayah administratif",
                            "peta desa",
                            "dusun"
                        ].map(p => p.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim())
                         .includes(cleanTitle);

                        if (isPlaceholder) continue;

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

        const slicedArticles = allArticles.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: slicedArticles,
            total: slicedArticles.length,
        });
    } catch (error) {
        console.error("Error aggregating OpenSID news:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to aggregate news";
        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                data: [],
            },
            { status: 500 }
        );
    }
}
