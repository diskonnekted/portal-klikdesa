"use client";

// =============================================================================
// BERITA PAGE - OpenSID Integration
// =============================================================================
// This page uses OpenSID API for news content management
// =============================================================================

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Calendar, FileText, RefreshCw, RotateCcw } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import NewsCard, { NewsCardSkeleton } from "@/components/berita/NewsCard";
import NewsSidebar from "@/components/berita/NewsSidebar";
import type { Post, Category } from "@/lib/opensid";

// SearchParams component untuk handle URL parameters
function NewsSearchContent() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get("category");
    const archiveKey = searchParams.get("archive");
    const searchQuery = searchParams.get("search");

    return <NewsContent categorySlug={categorySlug} archiveKey={archiveKey} searchQuery={searchQuery} />;
}

function NewsContent({
    categorySlug,
    archiveKey,
    searchQuery,
}: {
    categorySlug?: string | null;
    archiveKey?: string | null;
    searchQuery?: string | null;
}) {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [archives, setArchives] = useState<Array<{ key: string; displayText: string; count: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [, setTotalPosts] = useState(0);

    // Filter state
    const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug ?? "all");
    const [selectedArchive, setSelectedArchive] = useState<string>(archiveKey ?? "all");
    const [selectedSort, setSelectedSort] = useState<string>("terbaru");
    const [searchTerm, setSearchTerm] = useState(searchQuery ?? "");
    const [searchInput, setSearchInput] = useState(searchQuery ?? "");

    // Sync state with URL parameters when they change
    useEffect(() => {
        setSelectedCategory(categorySlug ?? "all");
        setSelectedArchive(archiveKey ?? "all");
        setSearchTerm(searchQuery ?? "");
        setSearchInput(searchQuery ?? "");
        setCurrentPage(1); // Reset to first page when URL changes
    }, [categorySlug, archiveKey, searchQuery]);

    // Fixed posts per page: 9 on desktop (lg:), 5 on mobile
    const [postsPerPage, setPostsPerPage] = useState(9);

    // Update posts per page based on screen size
    useEffect(() => {
        const updatePostsPerPage = () => {
            // Use CSS media query approach - check if window is large screen
            const isLargeScreen = window.innerWidth >= 1024;
            const newPostsPerPage = isLargeScreen ? 9 : 5;
            setPostsPerPage((prev) => {
                if (prev !== newPostsPerPage) {
                    setCurrentPage(1); // Reset to page 1 when posts per page changes
                }
                return newPostsPerPage;
            });
        };

        // Set initial value
        updatePostsPerPage();
        // Listen for resize
        window.addEventListener("resize", updatePostsPerPage);
        return () => window.removeEventListener("resize", updatePostsPerPage);
    }, []);

    // Load categories and archives for dropdowns
    useEffect(() => {
        async function loadFilters() {
            try {
                setCategories([
                    {
                        id: 1,
                        name: "Berita Desa",
                        slug: "berita-desa",
                        description: "",
                        count: 0,
                    },
                ]);
                setArchives([]);
            } catch {}
        }

        loadFilters();
    }, []);

    // Load posts
    useEffect(() => {
        const controller = new AbortController();
        async function loadPosts() {
            try {
                setLoading(true);
                setError(null);

                let allPosts: Post[] = [];

                const newsRes = await fetch("/api/external-news?limit=100", { signal: controller.signal });
                const newsJson = (await newsRes.json()) as {
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
                        categories: Array<{ id: number; name: string; slug: string }>;
                        publishedAt: string;
                        updatedAt: string;
                        link: string;
                        readTime: number;
                        viewCount: number;
                    }>;
                    error?: string;
                };

                if (!newsJson.success) {
                    throw new Error(newsJson.error ?? "Failed to fetch news");
                }

                function monthName(month: number) {
                    const monthNames = [
                        "Januari",
                        "Februari",
                        "Maret",
                        "April",
                        "Mei",
                        "Juni",
                        "Juli",
                        "Agustus",
                        "September",
                        "Oktober",
                        "November",
                        "Desember",
                    ];
                    return monthNames[month - 1] ?? "";
                }

                const postsFromNews: Post[] = newsJson.data.map((n, index) => {
                    const date = new Date(n.publishedAt);
                    const numericId = Math.floor(date.getTime() / 1000) + index;
                    const words = n.excerpt?.split(/\s+/).filter(Boolean).length || 1;
                    const readingTime = Math.max(1, Math.ceil(words / 220));
                    const featuredImage =
                        n.featuredImage ??
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'%3E%3Crect width='100%25' height='100%25' fill='%23006064'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='36' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EBerita%3C/text%3E%3C/svg%3E";

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
                        readingTime,
                        author: {
                            id: 0,
                            name: n.author?.name ?? "Admin Desa",
                            avatar: n.author?.avatar ?? "/images/default-avatar.png",
                        },
                        featuredImage,
                        featuredImageAlt: n.title,
                        categories: [
                            {
                                id: 1,
                                name: "Berita Desa",
                                slug: "berita-desa",
                            },
                        ],
                        tags: [],
                        viewCount: n.viewCount ?? 0,
                    };
                });

                allPosts = postsFromNews;

                const archiveCounts = new Map<string, number>();
                for (const p of allPosts) {
                    const d = new Date(p.date);
                    const y = d.getFullYear();
                    const m = d.getMonth() + 1;
                    const key = `${y}-${String(m).padStart(2, "0")}`;
                    archiveCounts.set(key, (archiveCounts.get(key) ?? 0) + 1);
                }

                const archiveList = Array.from(archiveCounts.entries())
                    .map(([key, count]) => {
                        const [yearStr, monthStr] = key.split("-");
                        const y = Number(yearStr);
                        const m = Number(monthStr);
                        return {
                            key,
                            displayText: `${monthName(m)} ${y} (${count})`,
                            count,
                        };
                    })
                    .sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0))
                    .slice(0, 24);
                setArchives(archiveList);

                // Apply filters
                let filteredPosts = allPosts;

                if (searchTerm) {
                    const q = searchTerm.toLowerCase();
                    filteredPosts = filteredPosts.filter((p) => p.title.toLowerCase().includes(q));
                }

                // Category filter
                if (selectedCategory && selectedCategory !== "all") {
                    const category = categories.find((c) => c.slug === selectedCategory);
                    if (category) {
                        if (category.id === 0) {
                            // ID 0 = uncategorized posts
                            filteredPosts = filteredPosts.filter(
                                (post) => post.categories.length === 0 || post.categories[0].id === 0
                            );
                        } else {
                            filteredPosts = filteredPosts.filter((post) =>
                                post.categories.some((cat) => cat.id === category.id)
                            );
                        }
                    }
                }

                // Archive filter
                if (selectedArchive && selectedArchive !== "all") {
                    const [year, month] = selectedArchive.split("-");
                    filteredPosts = filteredPosts.filter((post) => {
                        const postDate = new Date(post.date);
                        return postDate.getFullYear() === parseInt(year) && postDate.getMonth() + 1 === parseInt(month);
                    });
                }

                // Apply sorting
                const sortedPosts = [...filteredPosts];
                switch (selectedSort) {
                    case "terbaru":
                        sortedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        break;
                    case "terlama":
                        sortedPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        break;
                    case "terpopuler":
                        sortedPosts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                        break;
                    default:
                        // Default to newest first
                        sortedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                }

                // Apply pagination
                const startIndex = (currentPage - 1) * postsPerPage;
                const endIndex = startIndex + postsPerPage;
                const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

                if (paginatedPosts.length > 0) {
                    setPosts(paginatedPosts);
                    setTotalPosts(sortedPosts.length);
                    setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
                } else {
                    // No results - show empty state
                    setPosts([]);
                    setTotalPosts(sortedPosts.length);
                    setTotalPages(Math.ceil(sortedPosts.length / postsPerPage) || 1);
                }
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                setError("Gagal memuat berita. Silakan coba lagi.");
                setPosts([]);
                setTotalPosts(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
        return () => {
            controller.abort();
        };
    }, [currentPage, selectedCategory, selectedArchive, searchTerm, selectedSort, categories, postsPerPage]);

    // Handle search
    function handleSearch() {
        setSearchTerm(searchInput);
        setCurrentPage(1);
    }

    // Handle filter change
    function handleFilterChange(type: "category" | "archive" | "sort", value: string) {
        switch (type) {
            case "category":
                setSelectedCategory(value);
                break;
            case "archive":
                setSelectedArchive(value);
                break;
            case "sort":
                setSelectedSort(value);
                break;
        }
        setCurrentPage(1);
        if (type !== "sort") {
            setSearchTerm(""); // Clear search saat filter berubah, but not for sort changes
        }
    }

    // Get current filter info
    function getCurrentFilterInfo() {
        const filters = [];

        // Show active sort
        const sortNames = {
            terbaru: "Terbaru",
            terpopuler: "Terpopuler",
            terlama: "Terlama",
        };
        filters.push(`Urutkan: ${sortNames[selectedSort as keyof typeof sortNames]}`);

        if (selectedCategory && selectedCategory !== "all") {
            const category = categories.find((c) => c.slug === selectedCategory);
            if (category) filters.push(`${category.name}`);
        }

        if (selectedArchive && selectedArchive !== "all") {
            const [year, month] = selectedArchive.split("-");
            const monthNames = [
                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember",
            ];
            filters.push(`${monthNames[parseInt(month) - 1]} ${year}`);
        }

        if (searchTerm) {
            filters.push(`"${searchTerm}"`);
        }

        return filters;
    }

    const currentFilterInfo = getCurrentFilterInfo();
    const currentCategoryId = selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.id : undefined;

    // Helper function for pagination numbers (same as IoT page)
    function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage === 2) {
            return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage === 3) {
            return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage >= 4 && currentPage <= totalPages - 3) {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
        }

        if (currentPage === totalPages - 2) {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
        }

        if (currentPage === totalPages - 1) {
            return [1, "...", currentPage - 2, currentPage - 1, currentPage, currentPage + 1];
        }

        if (currentPage === totalPages) {
            return [1, "...", currentPage - 3, currentPage - 2, currentPage - 1, currentPage];
        }

        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t("berita.beritaUtama")}</h1>
                <p className="text-muted-foreground">{t("seo.newsPageDesc")}</p>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t("navigation.cari")}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <Select
                                value={selectedCategory}
                                onValueChange={(value) => handleFilterChange("category", value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.slug}>
                                            {category.name} ({category.count})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedArchive}
                                onValueChange={(value) => handleFilterChange("archive", value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Bulan/Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bulan</SelectItem>
                                    {archives.map((archive) => (
                                        <SelectItem key={archive.key} value={archive.key}>
                                            {archive.displayText} ({archive.count})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleSearch} disabled={loading}>
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {currentFilterInfo.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filter aktif:</span>
                            {currentFilterInfo.map((filter, index) => (
                                <Badge key={index} variant="secondary">
                                    {filter}
                                </Badge>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSelectedArchive("all");
                                    setSelectedSort("terbaru");
                                    setSearchTerm("");
                                    setSearchInput("");
                                    setCurrentPage(1);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
                {/* Main Content */}
                <div className="flex-1 w-full">
                    {/* Results Info */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                {searchTerm ? (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Hasil Pencarian
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-5 w-5" />
                                        {t("berita.terbaru")}
                                    </>
                                )}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Sort Options */}
                            <Select value={selectedSort} onValueChange={(value) => handleFilterChange("sort", value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="terbaru">Terbaru</SelectItem>
                                    <SelectItem value="terpopuler">Terpopuler</SelectItem>
                                    <SelectItem value="terlama">Terlama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <Card className="mb-6 border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <p className="text-red-600">{error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Halaman
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <NewsCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && posts.length === 0 && !error && (
                        <Card className="border-dashed">
                            <CardContent className="p-8 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    {searchTerm
                                        ? t("berita.tidakAdaHasil", {}, "Tidak Ada Hasil Pencarian")
                                        : t("berita.belumAdaBerita", {}, "Belum Ada Berita")}
                                </h3>

                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {searchTerm
                                        ? t(
                                              "berita.pesanTidakAdaHasil",
                                              { keyword: searchTerm },
                                              `Tidak ditemukan berita dengan kata kunci "${searchTerm}". Coba kata kunci lain atau periksa ejaan Anda.`
                                          )
                                        : t(
                                              "berita.pesanBelumAdaBerita",
                                              {},
                                              "Belum ada berita yang dipublikasikan dalam kategori ini. Silakan cek kembali nanti atau jelajahi kategori lain."
                                          )}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSearchInput("");
                                            setSelectedCategory("all");
                                            setSelectedArchive("all");
                                            setSelectedSort("terbaru");
                                            setCurrentPage(1);
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        {t("forms.reset")}
                                    </Button>

                                    <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        {t("forms.refresh")}
                                    </Button>
                                </div>

                                {searchTerm && (
                                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Saran Pencarian:</strong> Coba kata kunci yang lebih umum seperti
                                            pembangunan, kesehatan, atau pemerintahan
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* News Grid */}
                    {!loading && posts.length > 0 && (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <NewsCard
                                        key={post.id}
                                        post={post}
                                        showExcerpt={true}
                                        showAuthor={false}
                                        showDate={true}
                                        showViews={true}
                                        showCategories={true}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center gap-1">
                                            {/* First Page (<<) */}
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {"\u003c\u003c"}
                                            </button>

                                            {/* Previous (<) */}
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {"\u003c"}
                                            </button>

                                            {/* Page Numbers */}
                                            {getPageNumbers(currentPage, totalPages).map((pageNum, index) => (
                                                <span key={index}>
                                                    {pageNum === "..." ? (
                                                        <span className="px-3 py-2 sm:px-2 text-sm">...</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setCurrentPage(pageNum as number)}
                                                            disabled={pageNum === currentPage}
                                                            className={cn(
                                                                "h-8 w-8 border rounded-md",
                                                                pageNum === currentPage
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                            )}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    )}
                                                </span>
                                            ))}

                                            {/* Next (>) */}
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {"\u003e"}
                                            </button>

                                            {/* Last Page (>>) */}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {"\u003e\u003e"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 shrink-0 mt-8 lg:mt-0">
                    <NewsSidebar currentCategory={currentCategoryId} />
                </div>
            </div>
        </div>
    );
}

export default function BeritaPage() {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-4">
                    <div className="text-center mb-8">
                        <Skeleton className="h-10 w-48 mx-auto mb-2" />
                        <Skeleton className="h-5 w-96 mx-auto" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <NewsCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            }
        >
            <NewsSearchContent />
        </Suspense>
    );
}
