"use client";

import { createPengumuman } from "@/app/actions/pengumuman";
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

export default function CreatePengumumanPage() {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="mb-4">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/admin/pengumuman">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Buat Pengumuman Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPengumuman} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Pengumuman</Label>
              <Input id="judul" name="judul" required placeholder="Masukkan judul pengumuman..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioritas">Prioritas</Label>
              <Select name="prioritas" required defaultValue="NORMAL">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENDAH">Rendah</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="TINGGI">Tinggi</SelectItem>
                  <SelectItem value="PENTING">Penting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Isi Pengumuman</Label>
              <Textarea id="konten" name="konten" required className="min-h-[150px]" placeholder="Detail pengumuman..." />
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
              <Label htmlFor="expiresAt">Berlaku Hingga (Opsional)</Label>
              <Input id="expiresAt" name="expiresAt" type="date" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
               <Button variant="outline" asChild>
                <Link href="/admin/pengumuman">Batal</Link>
               </Button>
               <Button type="submit">Simpan Pengumuman</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
