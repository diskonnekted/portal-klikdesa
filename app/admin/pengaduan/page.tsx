import { prisma } from "@/lib/prisma";
import { PengaduanTable } from "./PengaduanTable";

export default async function AdminPengaduanPage() {
  const pengaduanList = await prisma.pengaduan.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengaduan</h2>
      </div>

      <div className="bg-white rounded-md border p-4">
        <PengaduanTable data={pengaduanList} />
      </div>
    </div>
  );
}
