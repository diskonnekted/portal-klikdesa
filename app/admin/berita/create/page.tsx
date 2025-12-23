"use client";

import { createBerita } from "@/app/actions/berita";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateBeritaPage() {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="mb-4">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/admin/berita">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Buat Berita Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBerita} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Berita</Label>
              <Input id="judul" name="judul" required placeholder="Masukkan judul berita..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select name="kategori" required defaultValue="umum">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="pemerintahan">Pemerintahan</SelectItem>
                  <SelectItem value="pembangunan">Pembangunan</SelectItem>
                  <SelectItem value="sosial">Sosial</SelectItem>
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-2">
              <Label htmlFor="ringkasan">Ringkasan</Label>
              <Textarea id="ringkasan" name="ringkasan" placeholder="Ringkasan singkat..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Konten Berita</Label>
              <Textarea id="konten" name="konten" required className="min-h-[200px]" placeholder="Isi berita lengkap..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" required defaultValue="DRAFT">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="penulis">Penulis</Label>
                <Input id="penulis" name="penulis" placeholder="Nama penulis" defaultValue="Admin" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
               <Button variant="outline" asChild>
                <Link href="/admin/berita">Batal</Link>
               </Button>
               <Button type="submit">Simpan Berita</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
