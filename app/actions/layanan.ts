"use server";

import { prisma } from "@/lib/prisma";
import { StatusPermohonan } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateLayananStatus(id: number, status: StatusPermohonan) {
  await prisma.layananPermohonan.update({
    where: { id },
    data: { statusPermohonan: status },
  });

  revalidatePath("/admin/layanan");
}

export async function deleteLayanan(id: number) {
  await prisma.layananPermohonan.delete({
    where: { id },
  });

  revalidatePath("/admin/layanan");
}
