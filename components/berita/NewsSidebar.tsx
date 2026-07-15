"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, TrendingUp, Tag, Folder, Archive, ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, Category, Tag as TagType, ArchiveDate } from "@/lib/opensid";

interface NewsSidebarProps {
    currentCategory?: number;
    currentTag?: number;
    className?: string;
    posts?: Post[];
    loading?: boolean;
}

export default function NewsSidebar({ 
    currentCategory, 
    currentTag, 
    className = "", 
    posts, 
    loading: externalLoading 
}: NewsSidebarProps) {
    const [popularPosts, setPopularPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [archives, setArchives] = useState<ArchiveDate[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);

    const loading = posts ? (externalLoading ?? false) : internalLoading;

    // Collapsible sections for mobile
    const [expandedSections, setExpandedSections] = useState({
        popular: true,
        categories: true,
        tags: true,
        archives: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Calculate sidebar data when posts are passed directly
    useEffect(() => {
        if (posts) {
            // 1. Popular posts sorted by views descending
            const popular = [...posts]
                .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                .slice(0, 7);

            // 2. Aggregate categories
            const categoryCounts = new Map<string, Category>();
            for (const p of posts) {
                const cat = p.categories[0];
                if (cat) {
                    const existing = categoryCounts.get(cat.slug);
                    if (existing) {
                        existing.count++;
                    } else {
                        categoryCounts.set(cat.slug, {
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            description: "",
                            count: 1,
                        });
                    }
                }
            }

            // 3. Aggregate archive months
            const archiveCounts = new Map<string, number>();
            for (const p of posts) {
                const d = new Date(p.date);
                const y = d.getFullYear();
                const m = d.getMonth() + 1;
                const key = `${y}-${String(m).padStart(2, "0")}`;
                archiveCounts.set(key, (archiveCounts.get(key) ?? 0) + 1);
            }

            const monthNames = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            const archiveList: ArchiveDate[] = Array.from(archiveCounts.entries())
                .map(([key, count]) => {
                    const [yearStr, monthStr] = key.split("-");
                    const y = Number(yearStr);
                    const m = Number(monthStr);
                    return {
                        key,
                        year: y,
                        month: m,
                        monthName: monthNames[m - 1] ?? "",
                        count,
                        displayText: `${monthNames[m - 1] ?? ""} ${y}`,
                    };
                })
                .sort((a, b) => b.key.localeCompare(a.key))
                .slice(0, 12);

            setPopularPosts(popular);
            setCategories(Array.from(categoryCounts.values()).sort((a, b) => b.count - a.count));
            setArchives(archiveList);
            setTags([]);
        }
    }, [posts]);

    // Fallback fetch if posts are not provided (e.g. single article details page)
    useEffect(() => {
        if (posts) return;

        async function loadSidebarData() {
            try {
                setInternalLoading(true);
                const res = await fetch("/api/external-news?limit=100");
                const json = await res.json();
                
                if (json.success && Array.isArray(json.data)) {
                    const articles = json.data;
                    
                    // Map to Post structure
                    const mappedPosts: Post[] = articles.map((n: any, index: number) => {
                        const date = new Date(n.publishedAt);
                        const numericId = Math.floor(date.getTime() / 1000) + index;
                        return {
                            id: numericId,
                            title: n.title,
                            content: n.content,
                            excerpt: n.excerpt,
                            slug: n.slug,
                            date: n.publishedAt,
                            modified: n.updatedAt,
                            link: `/berita/${n.slug}`,
                            status: "publish",
                            readingTime: n.readTime || 1,
                            author: {
                                id: 0,
                                name: n.author?.name ?? "Admin Desa",
                                avatar: n.author?.avatar ?? "/images/default-avatar.png",
                            },
                            featuredImage: n.featuredImage ?? "",
                            featuredImageAlt: n.title,
                            categories: [
                                {
                                    id: n.categories?.[0]?.id || 1,
                                    name: n.category || "Berita Desa",
                                    slug: n.categories?.[0]?.slug || "berita-desa",
                                },
                            ],
                            tags: [],
                            viewCount: n.viewCount ?? 0,
                        };
                    });

                    const popular = [...mappedPosts]
                        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                        .slice(0, 7);

                    const categoryCounts = new Map<string, Category>();
                    for (const p of mappedPosts) {
                        const cat = p.categories[0];
                        if (cat) {
                            const existing = categoryCounts.get(cat.slug);
                            if (existing) {
                                existing.count++;
                            } else {
                                categoryCounts.set(cat.slug, {
                                    id: cat.id,
                                    name: cat.name,
                                    slug: cat.slug,
                                    description: "",
                                    count: 1,
                                });
                            }
                        }
                    }

                    const archiveCounts = new Map<string, number>();
                    for (const p of mappedPosts) {
                        const d = new Date(p.date);
                        const y = d.getFullYear();
                        const m = d.getMonth() + 1;
                        const key = `${y}-${String(m).padStart(2, "0")}`;
                        archiveCounts.set(key, (archiveCounts.get(key) ?? 0) + 1);
                    }

                    const monthNames = [
                        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                    ];
                    const archiveList: ArchiveDate[] = Array.from(archiveCounts.entries())
                        .map(([key, count]) => {
                            const [yearStr, monthStr] = key.split("-");
                            const y = Number(yearStr);
                            const m = Number(monthStr);
                            return {
                                key,
                                year: y,
                                month: m,
                                monthName: monthNames[m - 1] ?? "",
                                count,
                                displayText: `${monthNames[m - 1] ?? ""} ${y}`,
                            };
                        })
                        .sort((a, b) => b.key.localeCompare(a.key))
                        .slice(0, 12);

                    setPopularPosts(popular);
                    setCategories(Array.from(categoryCounts.values()).sort((a, b) => b.count - a.count));
                    setArchives(archiveList);
                    setTags([]);
                }
            } catch (err) {
                console.error("Failed to load news sidebar data:", err);
            } finally {
                setInternalLoading(false);
            }
        }

        loadSidebarData();
    }, [posts]);

    // Format date untuk popular posts
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString("id-ID", { month: "short" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Popular News */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("popular")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Berita Populer
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.popular ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.popular ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : popularPosts.length > 0 ? (
                        <div className="space-y-4">
                            {popularPosts.map((post, index) => (
                                <div key={post.id} className="group">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/berita/${post.slug}`}
                                                prefetch={false}
                                                className="block hover:text-primary transition-colors"
                                            >
                                                <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:underline">
                                                    {post.title}
                                                </h4>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(post.date)}</span>
                                                <span>•</span>
                                                <span>{post.viewCount} views</span>
                                            </div>
                                        </div>
                                    </div>
                                    {index < popularPosts.length - 1 && <div className="mt-4 border-b border-border" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada berita populer</p>
                    )}
                </CardContent>
            </Card>

            {/* Categories */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("categories")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-primary" />
                            Kategori
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.categories ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.categories ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/berita?category=${category.slug}`}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                        currentCategory === category.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                                >
                                    {category.name}
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        {category.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada kategori</p>
                    )}
                </CardContent>
            </Card>

            {/* Tags */}
            {!loading && tags.length > 0 && (
                <Card>
                    <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("tags")}>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                Tags
                            </div>
                            <div className="sm:hidden">
                                {expandedSections.tags ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={expandedSections.tags ? "block" : "hidden sm:block"}>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/berita?tag=${tag.slug}`}
                                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs border transition-colors ${
                                        currentTag === tag.id
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:border-primary hover:bg-primary/5"
                                    }`}
                                >
                                    #{tag.name}
                                    <span className="ml-1 text-muted-foreground">({tag.count})</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Archives */}
            <Card>
                <CardHeader className="cursor-pointer sm:cursor-default" onClick={() => toggleSection("archives")}>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                            <Archive className="h-5 w-5 text-primary" />
                            Arsip
                        </div>
                        <div className="sm:hidden">
                            {expandedSections.archives ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={expandedSections.archives ? "block" : "hidden sm:block"}>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-6 w-full" />
                            ))}
                        </div>
                    ) : archives.length > 0 ? (
                        <div className="space-y-1">
                            {archives.map((archive) => (
                                <Link
                                    key={archive.key}
                                    href={`/berita?archive=${archive.key}`}
                                    className="flex items-center justify-between py-2 px-2 rounded-md text-sm hover:bg-accent transition-colors"
                                >
                                    <span>{archive.displayText}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {archive.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Belum ada arsip</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
