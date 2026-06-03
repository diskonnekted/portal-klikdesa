# Dokumen Handover: Proyek Portal KlikDesa Banjarnegara

**Tanggal:** 3 Juni 2026  
**Status:** Stabil & Berjalan (Development & Production Ready)

---

## 1. Ringkasan Proyek & Pencapaian
Sesi pengembangan kali ini berfokus pada pembangunan fitur geospasial terintegrasi dan koneksi ke API eksternal (OpenData dan OpenSID) untuk portal profil desa tingkat Kabupaten Banjarnegara. Kita telah berhasil membangun *dashboard* berbasis React (Next.js) yang dinamis, modern, dan sangat tangguh terhadap kegagalan koneksi (*graceful fallback*).

### Fitur Utama yang Diselesaikan:
- **Sistem Peta Geospasial (Leaflet + Turf.js)**:
  - Rendering peta tingkat Kecamatan dan tingkat Desa menggunakan poligon *GeoJSON*.
  - Tiga pilihan *Basemap* (Standard/OSM, Satelit/Esri, Dark/Carto).
  - Peta dapat berubah lapisannya secara interaktif (Analisis Stunting, Sebaran Home Industri, Peta Akseptor KB, dan Status Kesejahteraan).
  - Opasitas *overlay* peta diatur secara proporsional agar tekstur satelit dan jalan tetap terlihat.

- **Integrasi OpenData Banjarnegara & OpenSID**:
  - Pembuatan **API Proxy Backend** (`/api/opendata-desa-list` dan `/api/opendata-kependudukan`) untuk mengakali restriksi *CORS* pada portal kabupaten.
  - Pembuatan *React Hooks* (`useOpenDataKependudukan`, `useOpenDataDesaStunting`) untuk normalisasi respon JSON dari server pemerintah ke format yang bisa dibaca UI.
  - *Data Mapping* cerdas yang mampu menyesuaikan struktur nama desa (seperti penambahan "Desa " atau huruf kapital/kecil) dari OpenData agar sinkron dengan peta geospasial lokal.

- **UI/UX Profil Desa Modern**:
  - Halaman profil desa individual di- *route* secara dinamis (`/desa/[kecamatan]/[nama]`).
  - Pembuatan komponen **Ringkasan Penduduk** secara *real-time* dan rendering grafik visual yang ciamik menggunakan pustaka **Recharts** (Grafik Usia, Pendidikan, Pekerjaan).
  - Penanganan kondisi khusus di mana desa belum terhubung ke sistem Kabupaten (seperti Pagentan) dengan UI pesan/keterangan kegagalan yang bersahabat (*Shield Check*) tanpa membuat aplikasi *crash*.

---

## 2. Struktur Arsitektur Baru
Beberapa *file* dan komponen kunci yang ditulis atau direvisi:
- `components/ui/custom/LeafletMap.tsx`: Otak utama rendering peta dengan manajemen *layer control* secara kustom.
- `app/desa/[kecamatan]/[nama]/page.tsx`: Halaman utama profil desa, menampung seluruh *layout dashboard* termasuk grafik *Recharts* dan peta spasial mini.
- `hooks/useOpenDataKependudukan.ts`: Fungsi perantara sisi *client* untuk melacak sinkronisasi data dengan *proxy server*.
- `lib/opendata-config.ts`: Konfigurasi *Resource ID* dataset agar aplikasi tahu URL API JSON mana yang harus dipanggil untuk stunting masing-masing kecamatan.

---

## 3. Pending Issues & Tugas Selanjutnya (To-Do List)
Saat kita kembali melanjutkan proyek, hal-hal berikut menjadi prioritas utama:

1. **Pemutihan Jalur Cloudflare (Whitelisting)**: 
   - Server kependudukan OpenSID untuk beberapa desa (seperti *Gumingsir, Kecamatan Pagentan*) dilapisi pelindung *Cloudflare* (Status 403 Forbidden). 
   - **Tindakan**: IP peladen Next.js kita harus didaftarkan (*whitelist*) di *Cloudflare* OpenSID tersebut.
2. **Koordinasi dengan Tim OpenData**: 
   - Data agregat Kecamatan Pagentan di *endpoint* utama `opendata.banjarnegarakab.go.id/api/desa?kecamatan=pagentan` masih berstatus HTTP 500 (Internal Server Error) dari sisi Dinas/Kabupaten. Harus lapor ke Admin OpenData agar mereka menambahkan basis datanya ke API.
3. **Pengujian Skala (*Scaling*)**:
   - Jika nanti ada penambahan wilayah/kecamatan baru, pastikan untuk mendaftarkan *Resource ID* di `lib/opendata-config.ts`.

---

## 4. Perintah Umum untuk Melanjutkan
Untuk mulai menjalankan aplikasi ini saat Anda kembali:
```bash
# Menjalankan server lokal
npm run dev

# Melakukan kompilasi untuk memastikan tidak ada error syntax
npm run build
```

Semua pekerjaan (*commits*) telah dipublikasikan ke cabang `main`. 
*Selamat beristirahat, tim KlikDesa!*
