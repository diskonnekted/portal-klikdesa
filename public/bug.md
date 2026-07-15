Berikut adalah ringkasan bug yang ditemukan pada aplikasi, dikelompokkan berdasarkan tingkat keparahan:

---

## HIGH SEVERITY

### 1. IoT Stream: Resource leak (polling tidak pernah berhenti)
**File:** `app/api/iot/stream/route.ts:13,39`
`activeConnections.add(controller)` dijalankan sebelum pengecekan `activeConnections.size === 0`, sehingga `stopPolling()` tidak pernah dipanggil. Interval polling tetap berjalan selamanya meskipun tidak ada klien terhubung.

### 2. Weather Animation: Koordinat salah
**File:** `hooks/useWeatherAnimation.ts:7-8`
Koordinat `LATITUDE = -7.6654545; LONGITUDE = 110.3073412` mengacu ke Sleman/Yogyakarta, bukan Desa Sijenggung (~`-7.2929, 109.668`). Data cuaca yang ditampilkan salah lokasi.

### 3. Upload API: Tidak ada validasi keamanan
**File:** `app/api/upload/route.ts:6-44`
Tidak ada autentikasi, validasi tipe file, atau batas ukuran file. Setiap orang bisa upload file berbahaya (`.html`, `.js`, `.php`) ke `/public/uploads/pengaduan/` dan diakses secara statis — risiko stored XSS.

### 4. TTG Image Proxy: TLS verification dinonaktifkan
**File:** `app/api/ttg-image/route.ts:24`
`rejectUnauthorized: false` mengabaikan error sertifikat, membuka risiko MITM attack meskipun hostname sudah divalidasi.

### 5. Berita Detail: XSS via dangerouslySetInnerHTML
**File:** `app/berita/[slug]/page.tsx:474-478`
`post.content` dari API eksternal (OpenSID village site) dirender tanpa sanitisasi menggunakan `dangerouslySetInnerHTML`. Konten tepercaya dari pihak ketiga bisa menyisipkan script berbahaya.

### 6. Mock Data: State tidak sinkron antar route
**File:** `app/api/berita/route.ts:8` vs `app/api/berita/[id]/route.ts:8` (sama untuk `pengumuman`)
Setiap route module memiliki `mockBerita` / `mockPengumuman` mereka sendiri. `POST` menambahkan ke array di `route.ts`, tapi `GET /[id]` membaca dari array di `[id]/route.ts`. Data baru tidak bisa diambil kembali. Selain itu, `berita.views += 1` (line 61) dan `pengumuman.views += 1` (line 77) memutasi module-level state pada setiap GET — view count menumpuk secara permanen antar request.

---

## MEDIUM SEVERITY

### 7. API IDM & SDGS: Error dikembalikan dengan HTTP 200
**File:** `app/api/idm/route.ts:10` dan `app/api/sdgs/route.ts:10`
`NextResponse.json(response.success ? response.data : response, { ... })` tidak menyetel `status`. Ketika `success: false`, body error dikirim dengan status **200 OK** — klien tidak bisa mendeteksi kegagalan via status code.

### 8. parseOpenSIDDate: Tidak ada validasi input
**File:** `lib/opensid.ts:200-215`
Jika `tgl_upload` kosong atau `undefined`, `datePart=""` → `parseInt("") = NaN` → `new Date(NaN, ...)` Invalid Date → `.toISOString()` melempar `RangeError`. Satu artikel yang rusak bisa crash seluruh fetch.

### 9. IoT Page: Icon sensor yang salah
**File:** `app/iot/page.tsx:142-147`
Case `"voltage" | "current" | "power" | "energy" | "cost"` semuanya mengembalikan `<Thermometer />` — icon suhu ditampilkan untuk sensor listrik/energi.

### 10. .env: Secret lemah/default
**File:** `.env` dan `.env.production`
- `SEED_ADMIN_PASSWORD="password"` (kredensial default yang lemah)
- `NEXTAUTH_SECRET="32char_random_nextauth_secret_key"` (placeholder)
- `NEXTAUTH_SECRET="default_secret_key_for_build_purposes"` (placeholder)
Meskipun `.gitignore` melindungi, ini berisiko jika pernah di-deploy ke produksi tanpa diganti.

---

## LOW SEVERITY

### 11. Footer.tsx: UI icon inconsistency
**File:** `components/layout/Footer.tsx:106-157`
Semua `quickLinks` menampilkan icon `<ExternalLink />` meskipun tidak ada yang ditandai `external: true`. Sedangkan `layananLinks` sama sekali tidak menampilkan icon external. Inkonsistensi UI.

### 12. HomePageClient.tsx: Icon map tidak lengkap
**File:** `app/HomePageClient.tsx:77-86,95`
`iconMap` hanya mendukung 8 icon (FileText, DollarSign, Heart, GraduationCap, Building, ChartNoAxesColumnDecreasing, Phone, Download). Icon lain seperti `FileChartPie` tidak ada di map, sehingga fallback ke `FileText` padahal ada mapping SVG yang sesuai di `iconToSvg`.

### 13. external-news/route.ts: Unused variable
**File:** `app/api/external-news/route.ts:241`
`readingTime` dihitung tetapi tidak pernah digunakan dalam response object yang dikembalikan.

### 14. external-news/route.ts: Shuffle tidak merata
**File:** `app/api/external-news/route.ts:175`
`[...onlineDesas].sort(() => 0.5 - Math.random())` adalah shuffle yang bias dan tidak seragam.

### 15. .env: Placeholder secrets
**File:** `.env.production`
`NEXTAUTH_SECRET="default_secret_key_for_build_purposes"` adalah placeholder yang tidak aman untuk produksi.