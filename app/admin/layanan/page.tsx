import { prisma } from "@/lib/prisma";
import { LayananTable } from "./LayananTable";

export default async function AdminLayananPage() {
  const layananList = await prisma.layananPermohonan.findMany({
    orderBy: { tanggalPengajuan: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Manajemen Layanan</h2>
      </div>

      <div className="bg-white rounded-md border p-4">
        <LayananTable data={layananList} />
      </div>
    </div>
  );
}
