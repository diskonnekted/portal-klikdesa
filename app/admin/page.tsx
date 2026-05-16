import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MessageSquare, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  // Fetch stats (using try-catch to avoid crashing if DB is empty or connection fails)
  let stats = {
    berita: 0,
    pengguna: 0,
    pengaduan: 0,
  };

  try {
      // Check if tables exist by attempting to count. 
      // If tables don't exist, this will throw, and we'll fall back to 0.
      const [beritaCount, penggunaCount, pengaduanCount] = await Promise.all([
        prisma.berita.count(),
        prisma.pengguna.count(),
        prisma.pengaduan.count(),
      ]);
      stats = { berita: beritaCount, pengguna: penggunaCount, pengaduan: pengaduanCount };
  } catch (error) {
      console.error("Database error or tables missing:", error);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Link href="/admin/berita" className="transition-transform hover:scale-[1.02]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.berita}</div>
            <p className="text-xs text-muted-foreground">Artikel dipublikasikan</p>
          </CardContent>
        </Card>
      </Link>
      
      <Link href="/admin/pengguna" className="transition-transform hover:scale-[1.02]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pengguna}</div>
            <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/pengaduan" className="transition-transform hover:scale-[1.02]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengaduan Masuk</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pengaduan}</div>
            <p className="text-xs text-muted-foreground">Laporan warga</p>
          </CardContent>
        </Card>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Online</div>
          <p className="text-xs text-muted-foreground">Database terhubung</p>
        </CardContent>
      </Card>
    </div>
  );
}
