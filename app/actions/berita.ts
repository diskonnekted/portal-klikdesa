"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createBerita(formData: FormData) {
  const judul = formData.get("judul") as string;
  const konten = formData.get("konten") as string;
  const ringkasan = formData.get("ringkasan") as string;
  const kategori = formData.get("kategori") as string;
  const penulis = formData.get("penulis") as string || "Admin"; // Default author
  const status = formData.get("status") as string;
  
  const slug = generateSlug(judul) + "-" + Date.now();

  await prisma.berita.create({
    data: {
      judul,
      slug,
      konten,
      ringkasan,
      kategori,
      penulis,
      status: status || "DRAFT",
      dipublikasi: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function updateBerita(id: number, formData: FormData) {
  const judul = formData.get("judul") as string;
  const konten = formData.get("konten") as string;
  const ringkasan = formData.get("ringkasan") as string;
  const kategori = formData.get("kategori") as string;
  const status = formData.get("status") as string;

  await prisma.berita.update({
    where: { id },
    data: {
      judul,
      konten,
      ringkasan,
      kategori,
      status,
      dipublikasi: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/berita");
  redirect("/admin/berita");
}

export async function deleteBerita(id: number) {
  await prisma.berita.delete({
    where: { id },
  });

  revalidatePath("/admin/berita");
}
