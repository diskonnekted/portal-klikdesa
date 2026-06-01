"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePengaduanStatus(id: number, status: string) {
  await prisma.pengaduan.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/pengaduan");
}

export async function deletePengaduan(id: number) {
  await prisma.pengaduan.delete({
    where: { id },
  });

  revalidatePath("/admin/pengaduan");
}
