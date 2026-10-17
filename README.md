# Sela — AI Flashcards Inggris ↔ Indonesia

Sela adalah aplikasi web untuk menyimpan kosakata, memahami berbagai makna dengan bantuan AI, dan berlatih menggunakan spaced repetition. Dibangun dengan Next.js, React, Supabase, OpenRouter, dan FSRS; dirancang untuk ponsel dengan tema Mint & Apricot serta mode malam.

## Fitur

- **Kosakata dengan bantuan AI:** beberapa makna, penjelasan penggunaan, contoh dan terjemahan, serta IPA singkat. Penjelasan dan contoh dapat dibuka saat review.
- **Deck dan koleksi:** pencarian, bintang, draf, edit, pindah deck, serta penghapusan dengan konfirmasi.
- **Latihan FSRS:** jadwal independen untuk setiap arah, Again/Hard/Good/Easy, batas kartu baru dan sesi, tombol penilaian tetap terlihat di HP.
- **Impor Anki `.apkg`:** format SQLite lama dan Zstandard modern, pemetaan kolom Basic, kartu balik asli, opsi mempertahankan jatuh tempo, interval, reps/lapses, dan riwayat review.
- **Gambar:** AI menyarankan kata pencarian Pixabay; pengguna memilih gambar yang cocok. Generasi gambar OpenRouter tersedia bila diaktifkan.
- **Tanya Progres:** AI menjawab berdasarkan ringkasan aktivitas dan teks koleksi. Hitungan kategori seperti idiom merupakan estimasi AI.
- **Penyimpanan:** IndexedDB untuk mode lokal/offline, akun Supabase, sinkronisasi operation log, penanganan konflik, backup JSON dan media opsional.
- **PWA:** cache aplikasi produksi, mode malam, navigasi bawah dengan tombol Tambah, dropdown dan dialog kustom, dukungan keyboard.

## Jalankan lokal

Gunakan **Node.js 22.15+ atau Node.js 24 LTS** dan npm. Versi dependensi dikunci melalui `package-lock.json`.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Pada PowerShell, gunakan `Copy-Item .env.example .env.local` untuk menyiapkan konfigurasi. Jangan menimpa `.env.local` yang sudah berisi konfigurasi.

Buka [Sela lokal](http://127.0.0.1:3000). Tanpa konfigurasi layanan, kartu manual dan latihan tetap tersedia dalam mode lokal.

Untuk menjalankan build produksi:

```sh
npm run build
npm start
```

Service worker offline hanya aktif pada build produksi.

## Konfigurasi layanan

Isi `.env.local` berdasarkan `.env.example`. Panduan langkah demi langkah tersedia di [docs/SETUP.md](docs/SETUP.md).

| Variabel | Kegunaan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key untuk browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Key backend untuk media dan kuota AI |
| `OPENROUTER_API_KEY` | Key backend OpenRouter |
| `OPENROUTER_TEXT_MODEL` | Model teks; default `openrouter/free` |
| `ALLOW_PAID_TEXT` | Izin model teks berbayar; default `false` |
| `AI_DAILY_LIMIT` / `AI_GLOBAL_DAILY_LIMIT` | Batas permintaan AI per akun / global |
| `PIXABAY_API_KEY` | Pencarian gambar Pixabay dari server |
| `ENABLE_IMAGE_GENERATION` | Mengaktifkan generasi gambar opsional |
| `OPENROUTER_IMAGE_MODEL` | Model gambar yang mendukung endpoint yang dipakai |

Jalankan [supabase/001_initial.sql](supabase/001_initial.sql) pada SQL Editor proyek Supabase untuk membuat tabel, kuota, bucket privat, dan kebijakan RLS. Atur Site URL dan Redirect URLs pada Supabase Auth sesuai URL aplikasi.

Key rahasia harus berada di backend; jangan memakai awalan `NEXT_PUBLIC_` untuk service-role/OpenRouter/Pixabay. `.env.local`, log, build, dan file koleksi pribadi dikecualikan dari Git.

AI dan pencarian gambar memerlukan login serta koneksi internet. Ketersediaan model gratis dan batas penyedia dapat berubah. Saat bertanya tentang progres, ringkasan aktivitas dan teks koleksi dikirim ke OpenRouter; aplikasi tidak mengirim gambar atau kunci layanan sebagai konteks.

## Impor dari Anki

1. Ekspor deck ke `.apkg` dengan **Include scheduling information** jika ingin melanjutkan progres.
2. Buka **Profil → Impor Anki**, pilih berkas, lalu periksa pemetaan Inggris/Indonesia.
3. Biarkan **Pertahankan jadwal & riwayat Anki** aktif. Samakan zona waktu dan jam pergantian hari dengan Anki.
4. Periksa ringkasan, lalu konfirmasi impor.

Batas: 50 MB per paket, database terurai 80 MB, 2.000 catatan dan 100.000 baris riwayat per impor. GUID dan tipe catatan yang sudah ada dilewati agar impor ulang tidak menimpa progres.

Jadwal awal dipertahankan; review selanjutnya memakai FSRS Sela sehingga interval berikutnya bisa berbeda dari Anki. Parameter memori diperkirakan dari riwayat bila tidak tersedia. Cloze, image occlusion, media APKG, template khusus, dan learning steps Anki belum sepenuhnya didukung. Kartu suspended/buried tidak masuk antrean; kontrol pemulihannya belum tersedia.

## Deployment

Aplikasi memerlukan hosting yang mendukung **Next.js dan server Node.js**, misalnya Vercel atau server Node. Hosting file statis saja tidak menjalankan endpoint AI, akun, dan sinkronisasi.

1. Import repository ke platform hosting. Root aplikasi adalah root repository ini.
2. Gunakan `npm ci`, build `npm run build`, dan atur seluruh environment variables pada platform.
3. Untuk server Node sendiri, jalankan Next.js dengan host/port yang sesuai platform; script `npm start` lokal mengikat `127.0.0.1:3000`, sehingga biasanya ditempatkan di belakang reverse proxy.
4. Tambahkan URL HTTPS produksi pada Site URL dan Redirect URLs Supabase Auth.
5. Uji login, pembuatan kartu AI, gambar, sinkronisasi dua perangkat, backup, dan offline sebelum digunakan secara luas.

Variabel `NEXT_PUBLIC_` dibundel pada waktu build; perubahan nilainya memerlukan build ulang. Menyimpan kode di GitHub tidak otomatis mempublikasikan aplikasi.

## Pengujian

```sh
npm test
npm run build
```

Suite mencakup replay FSRS, jadwal dua arah, deduplikasi, konflik, penghapusan, backup, impor Anki lama/modern dan scheduling, isolasi akun, commit bersamaan, validasi gambar, konteks progres, serta autentikasi endpoint. Lihat [catatan validasi](docs/VALIDATION.md) untuk pengujian dan batasnya. Tidak semua skenario lintas perangkat/penyedia merupakan tes otomatis.

## Struktur

```text
app/            Halaman, tema, dan API routes Next.js
components/     UI aplikasi, review, impor, serta kontrol kustom
lib/            Engine FSRS, schema, penyimpanan, dan integrasi
supabase/       Migrasi SQL dan kebijakan akses
public/         Manifest PWA, service worker, dan pembaca SQLite
tests/         Tes Node dan fixture sintetis
docs/          Setup, arsitektur, PRD, dan validasi
```

Lihat [arsitektur](docs/ARCHITECTURE.md) dan [PRD](docs/PRD.md). Library SQLite pihak ketiga memiliki lisensi di [public/vendor/sql-js-LICENSE.txt](public/vendor/sql-js-LICENSE.txt).

