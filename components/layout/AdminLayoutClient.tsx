"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Newspaper, Users, LogOut, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { logOut } from "@/app/lib/actions";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader className="border-b px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <div className="bg-primary text-primary-foreground rounded-lg p-1">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <span>Admin Panel</span>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="px-2 py-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/admin"} tooltip="Dashboard">
                                    <Link href="/admin">
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/berita")} tooltip="Berita">
                                    <Link href="/admin/berita">
                                        <Newspaper />
                                        <span>Berita</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/pengguna")} tooltip="Pengguna">
                                    <Link href="/admin/pengguna">
                                        <Users />
                                        <span>Pengguna</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Halaman Utama">
                                    <Link href="/" target="_blank">
                                        <Home />
                                        <span>Lihat Website</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter className="border-t p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <form action={logOut}>
                                    <SidebarMenuButton className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start">
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </form>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 w-full bg-slate-50/50">
                    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">
                                {pathname === "/admin" && "Dashboard"}
                                {pathname.includes("/admin/berita") && "Manajemen Berita"}
                                {pathname.includes("/admin/pengguna") && "Manajemen Pengguna"}
                            </h1>
                        </div>
                    </header>
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
}
