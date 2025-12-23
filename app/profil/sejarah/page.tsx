import Link from "next/link";
import { History, ArrowLeft, Calendar, Users, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SejarahPage() {
    // Historical data from Maklumat Gubernur DIY
    const sejarahData = {
        tahunMaklumat: "1948",
        nomorMaklumat: "05",
        deskripsi:
            "Sesuai dengan Maklumat Gubernur DIY Sri Sultan Hamengkubuwono ke IX pada Nomor : 05 Tahun 1948, Desa Sijenggung dulunya terbagi menjadi 2 (dua) Desa yaitu:",
        DesaLama: [
            {
                nama: "Desa Ngentak",
                dusun: ["Ngentak", "Plotengan", "Badalan", "Jlopo", "Karanglo", "Dukuh"],
                pusatPemerintahan: "Plotengan",
            },
            {
                nama: "Desa Glagahombo",
                dusun: ["Jlapan", "Babadan (Banjarharjo)", "Glagahombo", "Jenengan", "Watupecah", "Balan/Mlesen"],
                pusatPemerintahan: "Babadan (Banjarharjo)",
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Back button */}
            <Link href="/profil">
                <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Profil Desa
                </Button>
            </Link>

            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <History className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Sejarah Desa Sijenggung</h1>
                <p className="text-xl text-gray-600">
                    Menelusuri perjalanan panjang Desa Sijenggung dari masa ke masa
                </p>
            </div>

            {/* Main Content */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Asal-usul Pembentukan Desa</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Historical Reference */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    Maklumat Gubernur DIY Sri Sultan Hamengkubuwono ke IX
                                </h3>
                                <p className="text-sm text-blue-800">
                                    <span className="font-medium">
                                        Nomor: {sejarahData.nomorMaklumat} Tahun {sejarahData.tahunMaklumat}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 text-center max-w-4xl mx-auto">{sejarahData.deskripsi}</p>

                    {/* The Two Former Desas */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {sejarahData.DesaLama.map((Desa, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-900">{Desa.nama}</h3>
                                </div>

                                {/* Pusat Pemerintahan */}
                                <div className="mb-4 p-3 bg-white/70 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Pusat Pemerintahan:</h4>
                                    <p className="text-gray-900 font-medium">{Desa.pusatPemerintahan}</p>
                                </div>

                                {/* Daftar Dusun */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Dusun yang Termasuk:</h4>
                                    <div className="space-y-1">
                                        {Desa.dusun.map((dusun, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{dusun}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modern-day note */}
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-2">
                            <Users className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-900 mb-1">Desa Terkini</h3>
                                <p className="text-sm text-green-800">
                                    Kedua Desa tersebut kemudian bergabung menjadi{" "}
                                    <strong>Desa Sijenggung</strong> seperti yang kita kenal today, dengan 9
                                    dusun yang membawahi 20 RW dan 47 RT.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Historical Context */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-xl">Konteks Sejarah</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Periode 1948</h3>
                            <p className="text-sm text-gray-700">
                                Tahun 1948 merupakan periode penting dalam sejarah Jawa, terutama setelah masa
                                kemerdekaan Indonesia. Maklumat ini menjadi dasar legal pembentukan struktur
                                pemerintahan Desa di wilayah Daerah Istimewa Yogyakarta.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Warisan Administratif</h3>
                            <p className="text-sm text-gray-700">
                                Jejak historis dari kedua Desa lama masih terlihat dalam penamaan dusun-dusun dan
                                struktur sosial masyarakat hingga saat ini. Hal ini menjadi bagian dari kekayaan budaya
                                dan identitas Desa Sijenggung.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

