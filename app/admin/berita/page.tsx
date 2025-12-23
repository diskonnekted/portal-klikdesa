import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { deleteBerita } from "@/app/actions/berita";

export default async function BeritaPage() {
  const beritaList = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Berita</h2>
        <Button asChild>
          <Link href="/admin/berita/create">
            <Plus className="mr-2 h-4 w-4" /> Tambah Berita
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beritaList.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Belum ada berita. Silakan tambah berita baru.
                    </TableCell>
                </TableRow>
            ) : (
                beritaList.map((berita) => (
                  <TableRow key={berita.id}>
                    <TableCell className="font-medium">{berita.judul}</TableCell>
                    <TableCell>{berita.kategori}</TableCell>
                    <TableCell>
                      <Badge variant={berita.status === "PUBLISHED" ? "default" : "secondary"}>
                        {berita.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        {format(new Date(berita.createdAt), "d MMMM yyyy", { locale: id })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/berita/${berita.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteBerita.bind(null, berita.id)}>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" type="submit">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
