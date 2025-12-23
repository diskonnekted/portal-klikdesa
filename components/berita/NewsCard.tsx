"use client";

import Link from "next/link";
import { Eye, Calendar, Timer } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ImageFallback from "@/components/ui/custom/ImageFallback";
import type { Post } from "@/lib/opensid";

interface NewsCardProps {
    post: Post;
    showExcerpt?: boolean;
    showAuthor?: boolean;
    showDate?: boolean;
    showViews?: boolean;
    showCategories?: boolean;
    className?: string;
}

export default function NewsCard({
    post,
    showExcerpt = true,
    showAuthor = true,
    showDate = true,
    showViews = true,
    showCategories = true,
    className = "",
}: NewsCardProps) {
    // Format date
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Jakarta",
        };
        return date.toLocaleDateString("id-ID", options);
    }

    // Format relative time
    function getRelativeTime(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Baru saja";
        if (diffInHours < 24) return `${diffInHours} jam lalu`;
        if (diffInHours < 48) return "Kemarin";

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} hari lalu`;

        return formatDate(dateString);
    }

    return (
        <Card
            className={`group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer pt-0 ${className}`}
        >
            {/* Featured Image */}
            <div className="relative aspect-video overflow-hidden">
                <Link href={`/berita/${post.slug}`} className="cursor-pointer">
                    <ImageFallback
                        src={post.featuredImage}
                        alt={post.featuredImageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                        priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
            </div>

            <CardHeader className="pb-3">
                {/* Categories */}
                {showCategories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {post.categories.slice(0, 3).map((category) => (
                            <Link
                                key={category.id}
                                href={`/berita?category=${category.slug}`}
                                className="cursor-pointer"
                            >
                                <Badge
                                    variant="outline"
                                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    {category.name}
                                </Badge>
                            </Link>
                        ))}
                        {post.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{post.categories.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Title */}
                <Link href={`/berita/${post.slug}`} className="cursor-pointer">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {showAuthor && (
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <ImageFallback
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 rounded-full object-cover"
                                    iconSize={12}
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-secondary-100 rounded-full border-2 border-white" />
                            </div>
                            <span>{post.author.name}</span>
                        </div>
                    )}

                    {showDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span title={formatDate(post.date)}>{getRelativeTime(post.date)}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <span>{post.readingTime} menit</span>
                    </div>

                    {showViews && (
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount.toLocaleString("id-ID")}</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            {/* Excerpt */}
            {showExcerpt && (
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>

                    {/* Read more link */}
                    <Link
                        href={`/berita/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mt-3 transition-colors"
                    >
                        Baca selengkapnya
                        <svg
                            className="w-3 h-3 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </CardContent>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
                <CardContent className="pt-0 border-t">
                    <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 4).map((tag) => (
                            <Link key={tag.id} href={`/berita?tag=${tag.slug}`}>
                                <Badge
                                    variant="secondary"
                                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    #{tag.name}
                                </Badge>
                            </Link>
                        ))}
                        {post.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                                +{post.tags.length - 4}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

// Skeleton version for loading state with better mobile optimization
export function NewsCardSkeleton({ className = "" }: { className?: string }) {
    return (
        <Card className={`overflow-hidden group animate-pulse ${className}`}>
            <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <CardHeader className="pb-3">
                {/* Category badges skeleton */}
                <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Title skeleton */}
                <div className="space-y-2 mb-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>

                {/* Meta information skeleton */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-muted rounded-full border-2 border-muted-foreground/20" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                    <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                {/* Excerpt skeleton */}
                <div className="space-y-2 mb-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>

                {/* Tags skeleton */}
                <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-12 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-14 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}
