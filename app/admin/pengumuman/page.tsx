import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PengumumanTable } from "./PengumumanTable";

export default async function PengumumanPage() {
  const pengumumanList = await prisma.pengumuman.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengumuman</h2>
        <Button asChild>
          <Link href="/admin/pengumuman/create">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-md border p-4">
        <PengumumanTable data={pengumumanList} />
      </div>
    </div>
  );
}
