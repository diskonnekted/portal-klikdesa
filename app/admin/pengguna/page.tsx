import { prisma } from "@/lib/prisma";
import { PenggunaTable } from "./PenggunaTable";

export default async function PenggunaPage() {
  const penggunaList = await prisma.pengguna.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Pengguna</h2>
      </div>

      <div className="bg-white rounded-md border p-4">
        <PenggunaTable data={penggunaList} />
      </div>
    </div>
  );
}
