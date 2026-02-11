"use client";

// =============================================================================
// OPENSID VERSION - BERITA DETAIL PAGE
// =============================================================================
// This page uses OpenSID API (from /lib/opensid.ts)
// =============================================================================

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Share2, MessageSquare, Eye, Tag, Folder } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NewsSidebar from "@/components/berita/NewsSidebar";

type Post = {
    id: string | number;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    date: string;
    modified: string;
    author: { name: string; avatar: string };
    featuredImage: string;
    featuredImageAlt: string;
    categories: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
    viewCount: number;
};

// Share functionality
function shareContent(url: string, title: string) {
    if (navigator.share) {
        navigator
            .share({
                title,
                url,
            })
            .catch(() => {
                // Error sharing is expected on some platforms, fallback to clipboard
                copyToClipboard(url);
            });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text: string) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            toast.success("Link berhasil disalin!");
        })
        .catch(() => {
            toast.error("Gagal menyalin link");
        });
}

// Format date functions
function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    };
    return date.toLocaleDateString("id-ID", options);
}

function formatDateShort(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    };
    return date.toLocaleDateString("id-ID", options);
}

function getReadingTime(content: string) {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
}

// Detail page component
function NewsDetailContent() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewCount, setViewCount] = useState(0);

    // Load post and related posts
    useEffect(() => {
        const controller = new AbortController();
        async function loadPost() {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                const postRes = await fetch(`/api/external-berita?slug=${encodeURIComponent(slug)}`, {
                    signal: controller.signal,
                });
                const postJson = (await postRes.json()) as {
                    success: boolean;
                    data: null | {
                        id: string;
                        title: string;
                        slug: string;
                        excerpt: string;
                        content: string;
                        featuredImage: string | null;
                        author: { name: string; avatar: string | null };
                        category: string;
                        publishedAt: string;
                        link: string;
                    };
                    error?: string;
                };

                const postData = postJson.success ? postJson.data : null;

                if (!postData) {
                    setError(postJson.error ?? "Berita tidak ditemukan");
                    return;
                }

                const mappedPost: Post = {
                    id: postData.id,
                    title: postData.title,
                    content: postData.content,
                    excerpt: postData.excerpt,
                    slug: postData.slug,
                    date: postData.publishedAt,
                    modified: postData.publishedAt,
                    author: { name: postData.author.name, avatar: postData.author.avatar ?? "/images/default-avatar.png" },
                    featuredImage:
                        postData.featuredImage ??
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'%3E%3Crect width='100%25' height='100%25' fill='%23006064'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='36' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EBerita%3C/text%3E%3C/svg%3E",
                    featuredImageAlt: postData.title,
                    categories: [{ id: 1, name: "Berita Desa", slug: "berita-desa" }],
                    tags: [],
                    viewCount: 0,
                };

                setPost(mappedPost);
                setViewCount(0);

                const relatedRes = await fetch("/api/external-news?limit=6", { signal: controller.signal });
                const relatedJson = (await relatedRes.json()) as {
                    success: boolean;
                    data: Array<{
                        id: string;
                        title: string;
                        slug: string;
                        excerpt: string;
                        content: string;
                        featuredImage: string | null;
                        author: { name: string; avatar: string | null };
                        category: string;
                        publishedAt: string;
                        updatedAt: string;
                        link: string;
                        viewCount: number;
                    }>;
                };

                if (relatedJson.success) {
                    const mappedRelated: Post[] = relatedJson.data
                        .filter((n) => n.slug !== slug)
                        .slice(0, 3)
                        .map((n) => ({
                            id: n.id,
                            title: n.title,
                            content: n.content,
                            excerpt: n.excerpt,
                            slug: n.slug,
                            date: n.publishedAt,
                            modified: n.updatedAt,
                            author: { name: n.author.name, avatar: n.author.avatar ?? "/images/default-avatar.png" },
                            featuredImage:
                                n.featuredImage ??
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'%3E%3Crect width='100%25' height='100%25' fill='%23006064'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='36' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EBerita%3C/text%3E%3C/svg%3E",
                            featuredImageAlt: n.title,
                            categories: [{ id: 1, name: "Berita Desa", slug: "berita-desa" }],
                            tags: [],
                            viewCount: n.viewCount ?? 0,
                        }));
                    setRelatedPosts(mappedRelated);
                } else {
                    setRelatedPosts([]);
                }
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                setError("Gagal memuat berita. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        }

        loadPost();
        return () => {
            controller.abort();
        };
    }, [slug]);

    // Update view count (simulated)
    useEffect(() => {
        if (post && !loading) {
            setViewCount((prev) => prev + 1);
        }
    }, [post, loading]);

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-4">
                <div className="mb-6">
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <Card className="pt-0">
                            <div className="h-64 md:h-96 relative">
                                <Skeleton className="absolute inset-0 rounded-t-lg" />
                            </div>
                            <CardHeader className="pb-4">
                                <div className="flex gap-2 mb-3">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-8 w-full mb-2" />
                                <Skeleton className="h-8 w-3/4" />
                                <div className="flex gap-4 mt-4">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
                        <div className="space-y-4">
                            {/* Popular News Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Categories Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-24" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Skeleton key={i} className="h-8 w-full" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-4">
                <Link href="/berita">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Berita
                    </Button>
                </Link>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
                    {/* Main Content */}
                    <div className="flex-1 w-full">
                        <Card className="pt-0">
                            <CardContent className="p-4 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                                    <MessageSquare className="h-10 w-10 text-red-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {error ?? "Berita tidak ditemukan"}
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Berita yang Anda cari tidak tersedia atau telah dihapus.
                                </p>
                                <Link href="/berita">
                                    <Button>Lihat Berita Lainnya</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
                        <NewsSidebar />
                    </div>
                </div>
            </div>
        );
    }

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Back button */}
            <Link href="/berita" prefetch={false}>
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Berita
                </Button>
            </Link>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
                {/* Main Content */}
                <div className="flex-1 w-full">
                    {/* Article Header */}
                    <Card className="mb-8 overflow-hidden pt-0">
                        {/* Featured Image */}
                        <div className="relative h-64 md:h-96">
                            <Image
                                src={post.featuredImage}
                                alt={post.featuredImageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
                                className="object-cover"
                                priority={true}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Overlay categories */}
                            {post.categories.length > 0 && (
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex flex-wrap gap-2">
                                        {post.categories.slice(0, 3).map((category) => (
                                            <Badge
                                                key={category.id}
                                                variant="secondary"
                                                className="bg-white/90 backdrop-blur-sm"
                                            >
                                                <Folder className="h-3 w-3 mr-1" />
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <CardHeader className="pb-4">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{post.title}</h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(post.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{getReadingTime(post.content)} baca</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{viewCount.toLocaleString("id-ID")} views</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Link key={tag.id} href={`/berita?tag=${tag.slug}`}>
                                            <Badge
                                                variant="outline"
                                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag.name}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="pt-0">
                            {/* Share and Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => shareContent(currentUrl, post.title)}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Bagikan
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Komentar
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Diperbarui: {formatDateShort(post.modified)}
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-gray max-w-none mt-6">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                    className="article-content"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Berita Terkait</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.id}
                                            href={`/berita/${relatedPost.slug}`}
                                            prefetch={false}
                                            className="group block"
                                        >
                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                                                <Image
                                                    src={relatedPost.featuredImage}
                                                    alt={relatedPost.featuredImageAlt}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                                {relatedPost.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDateShort(relatedPost.date)}</span>
                                                <span>•</span>
                                                <Eye className="h-3 w-3" />
                                                <span>{relatedPost.viewCount}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Back to Top */}
                    <div className="text-center mt-8">
                        <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            Kembali ke Atas
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
                    <NewsSidebar
                        currentCategory={post.categories.length > 0 ? post.categories[0].id : undefined}
                        currentTag={post.tags.length > 0 ? post.tags[0].id : undefined}
                    />
                </div>
            </div>
        </div>
    );
}

export default function BeritaDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-4">
                    <div className="mb-6">
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
                        {/* Main Content */}
                        <div className="flex-1 w-full">
                            <Card>
                                <div className="h-64 md:h-96 relative">
                                    <Skeleton className="absolute inset-0 rounded-t-lg" />
                                </div>
                                <CardHeader className="pb-4">
                                    <Skeleton className="h-8 w-full mb-2" />
                                    <Skeleton className="h-8 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-4/6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
                            <div className="space-y-4">
                                {/* Popular News Skeleton */}
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-32" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Categories Skeleton */}
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-24" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Skeleton key={i} className="h-8 w-full" />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <NewsDetailContent />
        </Suspense>
    );
}
