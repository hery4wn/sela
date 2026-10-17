# Deploy Sela ke Vercel

Target domain: **https://sela.habit-h.my.id**.

## Project

1. Login Vercel; bila belum punya akun, pemilik akun menyelesaikan pendaftaran dan persetujuan ketentuan layanan.
2. Import repository private **hery4wn/sela**. Jika Vercel meminta akses GitHub, batasi ke repository sela bila pilihan tersebut tersedia.
3. Framework **Next.js**, root **./**, Node.js **24.x**, install `npm ci`, build `npm run build`. Gunakan preset serverless Vercel, bukan startup.cjs yang khusus cPanel.
4. Sebelum Deploy, tambahkan environment variables dari konfigurasi lokal. Kunci rahasia hanya disimpan dalam Project Environment Variables, tidak dalam repository. Untuk produksi gunakan environment Production; jangan membagikan key melalui chat.

Variabel sesuai `.env.example`:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENROUTER_API_KEY
- OPENROUTER_TEXT_MODEL
- ALLOW_PAID_TEXT
- AI_DAILY_LIMIT
- AI_GLOBAL_DAILY_LIMIT
- PIXABAY_API_KEY
- ENABLE_IMAGE_GENERATION
- OPENROUTER_IMAGE_MODEL

Nilai NEXT_PUBLIC_ harus tersedia ketika build. Perubahannya memerlukan redeploy. Ikuti konfigurasi biaya/model yang dipakai lokal; jangan aktifkan penyedia berbayar tambahan tanpa keputusan pemilik.

## Subdomain

Setelah deployment Ready:

1. Project → Settings → Domains → tambah **sela.habit-h.my.id** untuk Production.
2. Salin nama/target record persis yang ditampilkan Vercel. Untuk subdomain biasanya CNAME; target dapat spesifik proyek dan jangan ditebak.
3. Pada DNS provider yang authoritative untuk habit-h.my.id, ubah record **sela** sesuai instruksi tersebut. Jika DNS memang dikelola di hosting, gunakan cPanel Zone Editor. Bila nameserver berada pada provider lain, perubahan harus di provider itu.
4. CNAME tidak dapat berdampingan dengan A/AAAA pada nama yang sama. Periksa record lama sela, ubah yang diperlukan untuk subdomain ini saja. Domain utama dan layanan email tetap memakai record mereka.
5. Tunggu Vercel menunjukkan konfigurasi valid dan HTTPS terbit. Bila ada verifikasi kepemilikan, tambahkan TXT yang benar-benar diberikan Vercel.

Tidak perlu upload ZIP ke cPanel atau memasang Node.js di paket hosting. DNS subdomain yang diarahkan ke Vercel menghubungkan nama domain dengan aplikasi.

## Supabase Auth

Pada proyek Supabase yang sudah dipakai:

- Site URL: `https://sela.habit-h.my.id`
- Additional Redirect URLs: tambahkan `https://sela.habit-h.my.id` dan URL preview/produksi Vercel yang diperlukan.
- Pertahankan redirect lokal jika masih dipakai untuk development.

Tidak perlu mengganti proyek database atau mengimpor ulang koleksi hanya untuk pindah hosting. Login akun yang sama mengambil koleksi yang sudah tersinkron. Data IndexedDB yang hanya ada di localhost memerlukan ekspor/impor backup.

## Pemeriksaan

- Deployment Ready tanpa error build.
- Halaman, aset dan manifest merespons normal melalui domain HTTPS.
- Status layanan menunjukkan konfigurasi yang diaktifkan.
- Login, AI teks, Pixabay, review, backup dan sinkronisasi diuji sesuai akses akun.
- Tidak ada kunci rahasia dalam source atau response API.

## Referensi resmi

- https://vercel.com/docs/git
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/functions/limitations

