# Menghubungkan Sela ke Supabase dan OpenRouter

Saat ini Sela bisa dipakai di komputer ini tanpa akun: menambah kata manual, deck, latihan FSRS, mode malam, dan backup. Akun, sinkronisasi, serta AI memerlukan konfigurasi di bawah. Belum ada kunci rahasia yang disertakan.

## 1. Buat proyek Supabase

1. Buka https://supabase.com/dashboard dan buat akun/proyek baru. Simpan database password di password manager milikmu; aplikasi ini tidak memerlukan password database tersebut.
2. Tunggu proyek siap. Dari pengaturan proyek / dialog Connect, salin **Project URL** dan **publishable key**. Legacy `anon` key juga bisa digunakan untuk variabel publishable bila proyekmu masih memakainya.
3. Buka pengaturan API Keys. Salin **legacy service_role key** untuk backend. Jangan menggunakannya pada frontend, screenshot, chat, atau Git.
4. Buka **SQL Editor**, buat query baru, tempel seluruh isi `supabase/001_initial.sql`, lalu jalankan sekali. Ini membuat tabel operasi, riwayat penggunaan AI, bucket media privat, dan aturan akses per akun.
5. Pada Authentication / URL Configuration, isi **Site URL** `http://127.0.0.1:3000` untuk pengembangan lokal. Tambahkan `http://127.0.0.1:3000` dan `http://localhost:3000` ke Redirect URLs. Sesuaikan alamat HTTPS setelah deployment.
6. Aktifkan penyedia Email. Konfirmasi email tetap disarankan. Untuk penggunaan publik, siapkan layanan SMTP sesuai panduan Supabase; email bawaan mempunyai pembatasan.

## 2. Buat API key OpenRouter

1. Buka https://openrouter.ai dan daftar/masuk sendiri.
2. Buka https://openrouter.ai/settings/keys, buat key untuk **Sela**, dan tetapkan spending limit sesuai kebutuhanmu bila tersedia.
3. Salin key langsung ke `.env.local` pada komputer, jangan ke percakapan.
4. Konfigurasi awal memakai `openrouter/free`. Router tersebut hanya memilih model gratis; ketersediaan dan batas layanan dapat berubah. Sebelum pemakaian serius, uji kata Inggris/Indonesia, polisemi, konteks, dan kualitas contoh lalu pilih model gratis spesifik yang lolos.
5. `ALLOW_PAID_TEXT=false` mencegah pemilihan model teks berbayar lewat konfigurasi normal. Aplikasi tidak mengganti model berbayar sebagai fallback.

## 3. Isi file lokal

File `.env.local` sudah disiapkan dalam folder `sela`, berisi slot kosong. Isi:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=publishable_atau_anon_key
SUPABASE_SERVICE_ROLE_KEY=service_role_key_backend
OPENROUTER_API_KEY=key_openrouter
OPENROUTER_TEXT_MODEL=openrouter/free
ALLOW_PAID_TEXT=false
AI_DAILY_LIMIT=20
AI_GLOBAL_DAILY_LIMIT=200
ENABLE_IMAGE_GENERATION=false
OPENROUTER_IMAGE_MODEL=
```

Hanya dua variabel `NEXT_PUBLIC_` yang dikirim ke browser. `.env.local` dikecualikan dari Git. Setelah diisi, beri tahu bahwa konfigurasi sudah siap; tidak perlu menyebut nilai key-nya.

## 4. Mulai ulang aplikasi

Jalankan dari folder `sela`:

```powershell
npm run build
npm start
```

Jika server sebelumnya masih aktif, hentikan server Sela pada port 3000 sebelum menjalankan yang baru. Jangan menghentikan seluruh proses Node di komputer. File `start-sela.ps1` di folder proyek membantu membuka server yang sudah ada atau menyalakan build yang tersedia.

Build ulang diperlukan bila variabel `NEXT_PUBLIC_` berubah. Mode pengembangan menggunakan `npm run dev`; service worker offline hanya diaktifkan untuk build produksi.

## 5. Periksa integrasi nyata

1. Daftar dengan emailmu, konfirmasi, dan masuk.
2. Buat kata `bank` dengan konteks sungai. Periksa pilihan makna serta contoh. Ulangi memakai kata Indonesia.
3. Gunakan browser/profil kedua untuk memeriksa sinkronisasi akun yang sama.
4. Gunakan akun lain untuk memastikan koleksi dan media tidak terbuka antar-akun.
5. Buka Sela online sampai status cache offline siap di Pengaturan. Putus jaringan dari DevTools, buka ulang, lakukan review, lalu sambungkan dan periksa riwayat tanpa duplikasi.
6. Uji konflik edit dari dua perangkat, penghapusan, pemulihan backup, batas kuota, email pemulihan, serta gangguan penyedia.

Data lokal tidak otomatis dicampur dengan akun. Jika ingin memindahkannya, ekspor backup dalam mode lokal lalu impor setelah masuk. Gunakan opsi menyertakan gambar jika gambar lokal perlu dipindah.

## Gambar dan audio

Generasi gambar memakai endpoint Image API OpenRouter dan bucket privat Supabase. Masih **nonaktif secara default** sampai model, biaya, izin penyimpanan, dan kualitasnya dipilih serta diuji. Isi `OPENROUTER_IMAGE_MODEL` dengan model yang mendukung Image API, lalu `ENABLE_IMAGE_GENERATION=true` hanya setelah menerima biayanya. Tidak ada fallback berbayar otomatis. Kuota gabungan gambar/teks dibatasi per akun dan global di database secara atomik.

Untuk tahap ini, pelafalan memakai SpeechSynthesis browser, bahasa `en-US` atau `id-ID`. Ketersediaan dan aksen bergantung pada suara perangkat. Tidak ada file audio untuk dibackup; audio offline tidak dijamin. Penyedia audio tersimpan perlu dipilih dan diuji sebelum versi pertama dinyatakan lengkap menurut PRD.

## Referensi resmi

- Supabase API keys: https://supabase.com/docs/guides/api/api-keys
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- OpenRouter Free Router: https://openrouter.ai/docs/guides/routing/routers/free-router
- OpenRouter structured outputs: https://openrouter.ai/docs/guides/features/structured-outputs
- OpenRouter Image API: https://openrouter.ai/docs/guides/overview/multimodal/image-generation
- FSRS scheduler: https://github.com/open-spaced-repetition/ts-fsrs

## Gambar gratis Pixabay

1. Daftar/masuk sendiri ke https://pixabay.com/ lalu buka https://pixabay.com/api/docs/ untuk melihat API key.
2. Isi `PIXABAY_API_KEY=` di `sela/.env.local`. Jangan kirim key ke chat atau memasukkannya ke variabel NEXT_PUBLIC.
3. Build ulang dan restart server Sela. Untuk hosting, tambahkan variabel yang sama di pengaturan server hosting.
4. Masuk ke akun Sela, buka Tambah/Edit kata, kemudian bagian Gambar gratis dari Pixabay. Ketik pencarian Inggris seperti `delicate flower`, tekan Cari gambar gratis, pilih hasil, lalu Simpan kartu.

Hasil pencarian diberi kredit sumber dan cache server 24 jam. Gambar terpilih diunduh server ke bucket privat sela-media; kartu tidak menggunakan hotlink Pixabay permanen. Kredit fotografer disimpan pada imageAlt dan ikut backup. Penyimpanan tunduk pada kuota Supabase. Generasi gambar OpenRouter tetap tersedia sebagai pilihan berbayar terpisah.

Status: integrasi diimplementasikan; pencarian dan upload nyata belum teruji karena PIXABAY_API_KEY belum diisi.

## Impor Anki
Buka Profil > Impor Anki (.apkg), pilih paket (maksimum 50 MB, 2.000 catatan), cocokkan kolom tiap tipe catatan, periksa ringkasan lalu konfirmasi. Teks HTML dibersihkan; skrip tidak dieksekusi. Paket collection.anki2, collection.anki21 dan database Zstandard collection.anki21b dibaca. Aktifkan Pertahankan jadwal & riwayat Anki (default aktif), lalu samakan zona waktu dan jam pergantian hari dengan Anki. Due, interval, reps, lapses, dan riwayat per kartu dipindahkan. Basic langsung siap belajar tanpa wajib penjelasan/contoh; hanya arah asli yang dibuat. Review berikutnya memakai FSRS Sela, dengan parameter dari Anki jika ada atau perkiraan replay riwayat. Hasil penjadwalan berikutnya tidak dijamin identik dengan Anki. Media/template khusus belum didukung; cloze dilewati. Kartu suspended/buried tidak masuk antrean dan belum mempunyai kontrol pemulihan di Sela. Duplikat GUID dan tipe catatan dilewati, bukan diperbarui. Gunakan JSON Sela untuk backup lengkap progres Sela.
