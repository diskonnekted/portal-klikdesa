import { AlertCircle } from "lucide-react";
import { env } from "process";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-warning" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Tidak Ada Koneksi Internet</h1>
                    <p className="text-muted-foreground">
                        Sepertinya Anda sedang offline. Beberapa konten mungkin tidak tersedia.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {env.APP_NAME || "Portal Desa Sijenggung"} akan otomatis menyegarkan ketika koneksi
                        kembali.
                    </p>
                </div>

                {/* Action */}
                <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                        <p>Halaman yang sudah diakses tetap tersedia secara offline.</p>
                        <p>Kunjungi kembali saat terhubung ke internet untuk konten terbaru.</p>
                        <p>Refresh halaman ini untuk mencoba koneksi lagi.</p>
                    </div>
                </div>

                {/* Branding */}
                <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-primary">{env.APP_NAME || "Portal Desa Sijenggung"}</p>
                    <p className="text-xs text-muted-foreground">Kabupaten Banjarnegara, Jawa Tengah</p>
                </div>
            </div>
        </div>
    );
}

