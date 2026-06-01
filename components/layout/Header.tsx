"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Bell,
    ChevronDown,
    User,
    Home,
    AlertTriangle,
    Building2,
    BarChart3,
    FileText,
    Globe,
    MessageSquare,
    BookCheck,
    Newspaper,
    Users,
    Heart,
    Shield,
    CreditCard,
    GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/useTranslation";
import { Logo, LogoVariant } from "@/components/ui/custom/Logo";

export function Header() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const mainNavItems = [
        { href: "/", label: "Beranda", icon: Home },
        {
            href: "/klikdesa/kesehatan",
            label: "Kesehatan",
            icon: Heart,
            subItems: [
                { href: "https://posyandu-sijenggung.smartdesa.net/", label: "Posyandu", external: true },
                { href: "/klikdesa/kesehatan", label: "KB" },
            ]
        },
        {
            href: "/klikdesa/kemiskinan",
            label: "Pengentasan Kemiskinan",
            icon: CreditCard,
            subItems: [
                { href: "/klikdesa/kemiskinan", label: "Pemetaan Desil" },
            ]
        },
        {
            href: "/klikdesa/pemberdayaan",
            label: "Pemberdayaan Masyarakat",
            icon: Users,
            subItems: [
                { href: "/klikdesa/pemberdayaan?tab=sidara", label: "Sidara" },
                { href: "/klikdesa/pemberdayaan?tab=ttg", label: "TTG" },
            ]
        },
        {
            href: "/klikdesa/tata-kelola",
            label: "Tata Kelola",
            icon: Building2,
            subItems: [
                { href: "/klikdesa/tata-kelola", label: "Layanan Mandiri Desa" },
                { href: "/pengaduan", label: "Penegakkan Disiplin Aparat (Gadis Desa)" },
            ]
        },
        {
            href: "/klikdesa/bencana",
            label: "Ketahanan Bencana",
            icon: AlertTriangle,
            subItems: [
                { href: "/klikdesa/bencana#cctv", label: "CCTV" },
                { href: "/klikdesa/bencana#pemetaan", label: "Pemetaan" },
                { href: "/klikdesa/bencana#ews", label: "Ews" },
            ]
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            // TODO: Implement actual search functionality
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="bg-primary text-white fixed top-0 left-0 right-0 z-50 transition-transform duration-300">
            {/* Top Header Bar */}
            <div
                className={`bg-[#0097A7] transition-opacity duration-300 ${
                    isScrolled ? "opacity-0 h-0" : "opacity-100 h-16"
                } overflow-hidden`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section - Left Side */}
                        <div className="flex items-center flex-shrink-0">
                            <Link
                                href="/"
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <Logo {...LogoVariant.light} size={40} />
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-bold text-white">Klikdesa</h1>
                                    <p className="text-xs text-primary-100">Dispermades PPKB Banjarnegara</p>
                                </div>
                                <div className="block sm:hidden">
                                    <h1 className="text-lg font-bold text-white">Klikdesa</h1>
                                    <p className="text-xs text-primary-100">Banjarnegara</p>
                                </div>
                            </Link>
                        </div>

                        {/* Search Bar - Center with flexible space */}
                        <div className="hidden lg:flex flex-1 justify-center px-6">
                            <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                                <Input
                                    type="search"
                                    placeholder={t("navigation.cari")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 bg-white/10 border-secondary-300/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-primary-800/40"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                                <Button
                                    type="submit"
                                    className="absolute right-0 top-0 bottom-0 px-3 rounded-l-none h-auto bg-[#0097A7] hover:bg-[#00838F] text-white"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Right Section - Right Side */}
                        <div className="flex items-center flex-shrink-0 space-x-4">
                            {/* Mobile Search Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-white hover:bg-primary-600! hover:text-white! cursor-pointer"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild id="header-notifications-trigger">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative text-white hover:text-white! hover:bg-primary-600! cursor-pointer"
                                    >
                                        <Bell className="h-5 w-5" />
                                        <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-[#f87171] text-white text-xs rounded-full p-0 flex items-center justify-center">
                                            3
                                        </Badge>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <span>Pengumuman Baru</span>
                                        <Badge variant="destructive">Baru</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <span>Update APBDes</span>
                                        <Badge variant="secondary">Info</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center justify-between data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <span>Jadwal Kegiatan</span>
                                        <Badge variant="outline">Reminder</Badge>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <Link href="/notifikasi" className="w-full cursor-pointer">
                                            Lihat Semua Notifikasi
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Account */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild id="header-account-trigger">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-white! hover:bg-primary-600! cursor-pointer px-0! ml-4! sm:ml-0!"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">Account</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <Link href="/profile" className="w-full cursor-pointer">
                                            Profil Saya
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        <Link href="/admin" className="w-full cursor-pointer">
                                            Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 data-highlighted:bg-primary-600 data-highlighted:text-white">
                                        {t("navigation.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="lg:hidden border-t border-primary-950/30 p-4">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Input
                                type="search"
                                placeholder={t("navigation.cari")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-white/10 border-secondary-400/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-[#00838F]/40"
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                                <Button
                                    type="submit"
                                    className="absolute right-0 top-0 bottom-0 px-3 rounded-l-none h-auto bg-[#0097A7] hover:bg-[#00838F] text-white"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                )}
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden lg:block bg-[#00ACC1]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-1 h-12">
                        {/* Main Navigation Items */}
                        {mainNavItems.map((item) => {
                            const IconComponent = item.icon;
                            if (item.subItems) {
                                return (
                                    <DropdownMenu key={item.label}>
                                        <DropdownMenuTrigger asChild>
                                            <button className="px-4 py-2 text-sm text-white hover:bg-white/20 hover:text-white! rounded-md transition-colors cursor-pointer flex items-center focus:outline-hidden">
                                                <IconComponent className="h-4 w-4 mr-2" />
                                                {item.label}
                                                <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 bg-white text-slate-800">
                                            {item.subItems.map((sub) => {
                                                if (sub.external) {
                                                    return (
                                                        <DropdownMenuItem key={sub.label} asChild className="data-highlighted:bg-[#00ACC1] data-highlighted:text-white">
                                                            <a href={sub.href} target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer">
                                                                {sub.label}
                                                            </a>
                                                        </DropdownMenuItem>
                                                    );
                                                }
                                                return (
                                                    <DropdownMenuItem key={sub.label} asChild className="data-highlighted:bg-[#00ACC1] data-highlighted:text-white">
                                                        <Link href={sub.href} className="w-full cursor-pointer">
                                                            {sub.label}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2 text-sm text-white hover:bg-white/20 hover:text-white! rounded-md transition-colors cursor-pointer flex items-center"
                                >
                                    <IconComponent className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </header>
    );
}
