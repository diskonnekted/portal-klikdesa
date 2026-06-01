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

export async function createPengaduanAction(data: {
  nama: string;
  email: string;
  telepon: string;
  kategori: string;
  subjek: string;
  pesan: string;
  lokasi: string;
  gambar?: string;
}) {
  const tiketId = "TRK-" + Math.floor(100000 + Math.random() * 900000);
  await prisma.pengaduan.create({
    data: {
      nama: data.nama,
      email: data.email,
      telepon: data.telepon,
      kategori: data.kategori,
      subjek: data.subjek,
      pesan: data.pesan,
      lokasi: data.lokasi,
      gambar: data.gambar || null,
      status: "MENUNGGU",
      tiketId: tiketId,
    },
  });
  revalidatePath("/admin/pengaduan");
  return { success: true, tiketId };
}
