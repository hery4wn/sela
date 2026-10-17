# Arsitektur awal

## Pemisahan tanggung jawab

- `app/`: Next.js server routes dan shell. UI client berada di `components/`.
- `lib/schema.mjs`: validasi Zod untuk entri, operasi, backup dan hasil AI.
- `lib/engine.mjs`: reduksi operasi, replay FSRS, statistik, deteksi duplikat, antrian latihan. Tidak memanggil AI.
- `lib/storage.mjs`: transaksi IndexedDB per akun, acknowledgment sinkronisasi, cache media.
- `supabase/001_initial.sql`: operation log append-only dengan RLS, request AI dengan kuota atomik, bucket privat.

## Data dan sinkronisasi

Model memakai operasi append-only untuk mempertahankan review offline. Deck dan entri direduksi dari operasi, bukan disimpan sebagai snapshot last-write-wins. Setiap operasi memiliki UUID dan logical sequence. Sequence adalah maksimum yang diketahui + 1. Urutan stabil menggunakan sequence lalu UUID.

Cloud menggabungkan UUID unik; riwayat review dihitung ulang secara deterministik menurut timestamp review dan UUID. Setiap arah memiliki state FSRS sendiri. Reviews ditulis ke IndexedDB sebelum kartu berikutnya. Pengiriman ulang operasi tidak menambah aktivitas dua kali.

Edit isi membawa `base` version. Jika versi dasar sudah berbeda, edit disimpan sebagai konflik untuk dipilih di Pengaturan. Tombstone mencegah edit tertunda menghidupkan kembali entri terhapus. Resolusi mempertahankan operasi asli dalam backup. Pemindahan deck mempertahankan histori; reset makna eksplisit mengganti generasi jadwal dan menyimpan histori lama sebagai aktivitas.

Data baru dari perangkat lain ditemukan saat sync awal, perubahan lokal, koneksi kembali, fokus tab, dan polling 60 detik pada tab aktif. Data dipisahkan menurut user ID di IndexedDB. Ruang `local` tidak otomatis diunggah ke akun. API memverifikasi token melalui Supabase Auth, tidak menerima user ID dari payload klien.

Untuk koleksi besar, replay dan penarikan seluruh operation log perlu diganti snapshot/checkpoint dengan cursor server. Implementasi awal cocok untuk koleksi pribadi; belum dibenchmark terhadap puluhan ribu review. Clock drift antarperangkat juga perlu pengujian operasional sebelum publikasi.

## AI dan biaya

Kunci OpenRouter/service_role hanya di server. AI memerlukan akun. Kuota disimpan di database, dijaga advisory transaction lock, mencakup gagal dan pending agar tidak bisa dibypass dengan retry. Request UUID terikat hash input. Respons sukses disimpan agar pengiriman ID sama bisa mengambil hasil tanpa pemanggilan model ulang.

Model teks gratis default masih perlu quality gate. Image API nonaktif sampai model dan biaya ditentukan. Gambar bukan kebutuhan untuk menyimpan atau melatih kartu teks. Penyedia suara browser tidak mendukung ekspor audio; keputusan penyedia cacheable belum selesai.

## Aset visual

`public/art/sela-sprites.png` dibuat dengan imagegen bawaan untuk proyek ini: lembar empat ilustrasi transparan, maskot rubah mint membaca buku, bunga mekar, kursi cozy, dan danau serene. Digunakan sebagai CSS sprite; bukan tangkapan layar konsep. Prompt ringkas: "four isolated soft clay illustrations in a transparent 2x2 grid, mint fox reading an apricot book, orange blooming flower, cozy chair, serene lake". Konsep Style 4B adalah referensi visual pengguna.
