import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const villageParam = searchParams.get("village") || "";

    try {
        const response = await fetch("https://sidara.smartvillage.center/", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            },
            next: { revalidate: 3600 }, // cache for 1 hour
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();

        // Parse potentials articles
        // An article starts with <article class="bg-slate-50... and ends with </article>
        const articles: string[] = [];
        const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
        let match;
        while ((match = articleRegex.exec(html)) !== null) {
            articles.push(match[0]);
        }

        const products = articles.map((articleHtml, idx) => {
            // Extract Image
            const imgMatch = articleHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
            const img = imgMatch ? imgMatch[1].trim() : "";

            // Extract Title
            const titleMatch = articleHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
            const name = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "").trim() : "";

            // Extract Village
            const villageMatch = articleHtml.match(/<span class="[^"]*truncate"[^>]*>[\s\S]*?<\/svg>\s*([\s\S]*?)\s*<\/span>/i);
            const village = villageMatch ? villageMatch[1].replace(/<[^>]*>/g, "").trim() : "";

            // Extract Description
            const descMatch = articleHtml.match(/<p class="[^"]*line-clamp-2"[^>]*>([\s\S]*?)<\/p>/i);
            const description = descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim() : "";

            // Extract Price
            const priceMatch = articleHtml.match(/<span class="font-semibold text-slate-900">([\s\S]*?)<\/span>/i);
            const price = priceMatch ? priceMatch[1].replace(/<[^>]*>/g, "").trim() : "Hubungi pelapak";

            // Extract Detail Link
            const linkMatch = articleHtml.match(/<a[^>]+href=["']([^"']+)["'][^>]*class="[^"]*font-semibold text-emerald-700"/i) 
                          || articleHtml.match(/<a[^>]+href=["']([^"']+)["'][^>]*>Detail<\/a>/i);
            const href = linkMatch ? linkMatch[1].trim() : "";

            // Determine Category based on title, description, or fallback
            let category = "Kuliner";
            const textToAnalyze = `${name} ${description}`.toLowerCase();
            
            if (/\b(wisata|curug|destinasi|air terjun|pantai|taman|outbound|sejarah|candi)\b/i.test(textToAnalyze)) {
                category = "Wisata";
            } else if (/\b(penginapan|homestay|hotel|villa|losmen|kamar)\b/i.test(textToAnalyze)) {
                category = "Penginapan";
            } else if (/\b(event|festival|konser|pertunjukan|pentas|pameran|upacara)\b/i.test(textToAnalyze)) {
                category = "Event";
            } else if (/\b(batik|kriya|tenun|kerajinan|lidi|tas|baju|rajut|ukiran|kayu|accessories|aksesori)\b/i.test(textToAnalyze)) {
                category = "Kriya";
            } else if (/\b(pupuk|tani|kebun|bibit|tanaman|padi|organik|kompos)\b/i.test(textToAnalyze)) {
                category = "Pertanian";
            } else if (/\b(sapi|kambing|ayam|ternak|susu|telur|domba|hewan|pakan)\b/i.test(textToAnalyze)) {
                category = "Peternakan";
            } else if (/\b(wifi|internet|jasa|cuci|bengkel|rental|agen|brilink|laundry|pulsa)\b/i.test(textToAnalyze)) {
                category = "Jasa";
            } else if (/\b(kopi|tempe|makanan|kuliner|olahan|camilan|nasi|kue|gula|goreng|mendoan|rengginan|sale|pisang|bumbu|dapoer)\b/i.test(textToAnalyze)) {
                category = "Kuliner";
            } else {
                category = "Lainnya";
            }

            // Assign unique ID
            const id = idx + 1;

            return {
                id,
                name,
                category,
                price,
                rating: (4.5 + (id % 5) * 0.1).toFixed(1), // Mock rating between 4.5 and 4.9
                img,
                description,
                village,
                href,
            };
        });

        // Filter by village if specified
        let filteredProducts = products;
        if (villageParam) {
            // Support partial match (e.g. "Sijenggung" matches "Desa Sijenggung")
            const normalizedParam = villageParam.toLowerCase().replace(/^(desa|kelurahan)\s+/i, "").trim();
            filteredProducts = products.filter(p => {
                const normalizedVillage = p.village.toLowerCase().replace(/^(desa|kelurahan)\s+/i, "").trim();
                return normalizedVillage.includes(normalizedParam);
            });
        }

        return NextResponse.json({
            success: true,
            data: filteredProducts,
        });

    } catch (error) {
        console.error("SIDARA Scraper error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to scrape data from SIDARA" },
            { status: 500 }
        );
    }
}
