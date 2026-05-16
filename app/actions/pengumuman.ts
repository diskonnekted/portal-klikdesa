"use server";

import { prisma } from "@/lib/prisma";
import { Status, Prioritas } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPengumuman(formData: FormData) {
  const judul = formData.get("judul") as string;
  const konten = formData.get("konten") as string;
  const prioritas = formData.get("prioritas") as Prioritas;
  const status = formData.get("status") as Status;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  await prisma.pengumuman.create({
    data: {
      judul,
      konten,
      prioritas: prioritas || "NORMAL",
      status: status || "DRAFT",
      dipublikasi: status === "PUBLISHED" ? new Date() : null,
      expiresAt,
    },
  });

  revalidatePath("/admin/pengumuman");
  redirect("/admin/pengumuman");
}

export async function updatePengumuman(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const konten = formData.get("konten") as string;
  const prioritas = formData.get("prioritas") as Prioritas;
  const status = formData.get("status") as Status;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  await prisma.pengumuman.update({
    where: { id },
    data: {
      judul,
      konten,
      prioritas,
      status,
      dipublikasi: status === "PUBLISHED" ? new Date() : null,
      expiresAt,
    },
  });

  revalidatePath("/admin/pengumuman");
  redirect("/admin/pengumuman");
}

export async function deletePengumuman(id: number) {
  await prisma.pengumuman.delete({
    where: { id },
  });

  revalidatePath("/admin/pengumuman");
}
