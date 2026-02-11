import { useState, useEffect, useCallback } from "react";

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    author: {
        name: string;
        avatar: string | null;
    };
    category: string;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    publishedAt: string;
    updatedAt: string;
    link: string;
    readTime: number;
    isBreaking: boolean;
    isFeatured: boolean;
    isPinned: boolean;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isBookmarked: boolean;
}

interface NewsResponse {
    success: boolean;
    data: NewsItem[];
    total: number;
    error?: string;
}

export function useExternalNews(limit: number = 10) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/external-news?limit=${encodeURIComponent(String(limit))}`, { signal });
            const data: NewsResponse = await response.json();

            if (data.success) {
                // Limit the results and sort by date (newest first)
                const limitedNews = data.data
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .slice(0, limit);
                setNews(limitedNews);
            } else {
                setError(data.error ?? "Failed to fetch news");
            }
        } catch (error) {
            if (signal?.aborted) return;
            if (error instanceof DOMException && error.name === "AbortError") return;
            setError("Failed to connect to news server");
        } finally {
            if (signal?.aborted) return;
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        const controller = new AbortController();
        fetchNews(controller.signal);
        return () => controller.abort();
    }, [fetchNews]);

    return { news, loading, error, refetch: fetchNews };
}
