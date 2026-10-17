# Hasil validasi — 15 Oktober 2026

## Sudah diperiksa

- `npm test`: 17 tes lulus. Mencakup penjadwalan dua arah, replay deterministik, review idempotent, konflik edit, tombstone, reset jadwal, batas kartu baru, backup, zona waktu, pemisahan IndexedDB per akun, penulisan bersamaan, dan acknowledgment yang mempertahankan operasi tertunda.
- `npm run build`: build produksi Next.js berhasil.
- Browser pada `http://127.0.0.1:3000`: menambahkan contoh, membuat kata manual, mencari dan membuka detail, membuka jawaban, menilai Good, berpindah arah, lalu memuat ulang. Kata dan review tetap tersimpan.
- Mode terang/malam diperiksa pada tampilan mobile. Label tombol tambah diperbaiki untuk pembaca layar.
- Pembaruan service worker melalui tombol Perbarui aplikasi berhasil.
- Server lokal dihentikan sementara, halaman dimuat ulang, kemudian Koleksi dibuka: keempat kata tetap tersedia. Ini membuktikan cache shell dan IndexedDB bekerja ketika server tidak tersedia; bukan pengujian airplane mode pada ponsel.
- Server dihidupkan kembali setelah pemeriksaan.

Browser lokal berisi tiga kata contoh dan satu kata uji manual (thoughtful), serta satu review uji. Tidak ada data lama yang dihapus.

## Belum dapat dinyatakan lulus

Supabase dan OpenRouter belum dikonfigurasi: autentikasi/pemulihan email nyata, SQL/RLS dua akun, sinkronisasi lintas perangkat, kuota database, kualitas keluaran AI, generasi gambar dan media privat masih perlu diuji sesudah setup. Tes penyimpanan lokal bukan bukti RLS server.

Pemasangan PWA di Android/iOS, offline jaringan sesungguhnya, aksesibilitas menyeluruh, target performa PRD, backup melalui dialog file lintas perangkat, dan deployment HTTPS belum diuji. Pelafalan saat ini memakai suara browser; audio tersimpan/offline sesuai PRD belum selesai.

Ikuti SETUP.md untuk langkah konfigurasi. Implementasi ini merupakan build development yang dapat digunakan lokal, belum rilis produksi penuh sesuai seluruh PRD.

## Pembaruan alur AI

AI mengisi 1–4 makna umum sekaligus dalam satu kartu. Penjelasan, contoh Inggris, dan terjemahan diberi nomor yang sama; tidak ada langkah memilih satu arti. IPA dan panduan baca perkiraan diminta dari AI dan tetap bisa diedit. Makna langka tidak dijamin tercakup. Untuk sumber Indonesia, terjemahan Inggris pertama menjadi pertanyaan utama; alternatif dijelaskan dalam isi kartu.

Konfigurasi lokal gambar telah diaktifkan dengan google/gemini-2.5-flash-image. Tombol Buat gambar menggunakan kredit OpenRouter dan mewakili makna pertama/konteks utama. Model dan flag tetap harus disetel terpisah pada hosting. Referensi endpoint: https://openrouter.ai/blog/tutorials/image-generation-models/

Validasi pembaruan: 19 tes otomatis lulus, build produksi berhasil, endpoint status melaporkan akun/teks/gambar aktif. Ini memverifikasi konfigurasi tersedia, bukan keberhasilan permintaan AI atau upload Storage nyata. Pengujian tersebut memerlukan sesi pengguna yang masuk.

Pelafalan diperbarui menjadi satu transkripsi IPA ringkas, termasuk tampilan kartu lama. 21 tes lulus. Pemeriksaan langsung endpoint gambar mendapati HTTP 402: akun OpenRouter belum pernah membeli kredit; model ditemukan di katalog. Pesan aplikasi kini membedakan masalah kredit, key, izin, model, dan rate limit. Gambar belum berhasil dihasilkan karena kredit.

Pixabay setelah key diisi: pencarian flower mengembalikan 12 hasil; unduhan JPEG 66976 byte berhasil; bucket sela-media terverifikasi privat. Server dimulai ulang. Upload melalui sesi pengguna dan pemasangan gambar ke kartu belum diuji karena browser masih mode lokal.

Pencarian otomatis: output AI memiliki imageQuery untuk kata kunci visual sesuai konteks. Setelah hasil AI diterima, picker mencari Pixabay otomatis; pencarian manual tetap tersedia. Respons pencarian yang sudah usang diabaikan. 23 tes regresi dan build produksi lulus; alur AI-ke-Pixabay melalui sesi pengguna belum diuji pada pembaruan ini.

Impor APKG: 27 tes lulus, termasuk fixture legacy, Zstandard, duplikat catatan dengan dua kartu, paket invalid dan cloze. Build produksi lulus. Browser berhasil membaca example.apkg dan menampilkan pemetaan Front/Back serta ringkasan satu draf. Paket pengguna nyata dan berbagai template pihak ketiga belum diuji.


## Peningkatan scheduling Anki — 17 Oktober 2026
34 tes lulus dan build produksi lulus. Mencakup due calendar/offset, filtered original due, single direction, suspension, reset, backup roundtrip, review lanjutan independen, pemetaan terbalik, modern unicase/protobuf, dan ukuran batch sinkronisasi.
File pengguna All Decks.apkg diuji secara lokal: 1.277 catatan, 2.452 kartu, 33.234 baris riwayat; 0 dilewati. Sebanyak 102 catatan tetap satu arah. Konversi sekitar 1,1 detik, materialisasi 145 ms pada mesin pengujian. Semua kartu diuji menghasilkan empat opsi review berikutnya; backup lolos validasi. Tidak menyimpan atau menyinkronkan koleksi pengguna saat pengujian.
Batasan: jadwal pertama dipertahankan, penjadwalan selanjutnya menggunakan FSRS Sela; learning steps Anki tidak diemulasi. Media, cloze, template khusus belum didukung.
## Optimasi koleksi besar dan review mobile — 17 Oktober 2026
- 36 tes lulus, termasuk commit review atomik saat penulisan bersamaan, konteks progres yang memisahkan kosakata/review, dan autentikasi endpoint AI progres.
- File Anki 1.277 catatan / 33.234 riwayat: stats cold 78 ms, warm 67 ms, antrean 5 ms, reducer + stats setelah review 211 ms. Ini benchmark logika Node, bukan latency end-to-end browser/mobile.
- Koleksi menampilkan 40 kartu bertahap; statistik kalender memakai cache formatter/day-key dan indeks kartu. Commit review memakai satu transaksi IndexedDB; tidak menunggu cloud.
- Review mobile memakai tinggi viewport, konten kartu dapat digulir, rating tetap di bawah. Placeholder gambar tidak ditampilkan dalam review; detail penjelasan/contoh dapat dibuka terpisah.
- Tanya Progres teruji dengan OpenRouter pada akun aktif: pertanyaan jumlah kata menghasilkan trained=5 sesuai data. Tidak menulis review percobaan ke akun pengguna.
- AI progres mengirim ringkasan aktivitas dan maksimum 3.000 entri teks (tanpa gambar, kunci, email). Kategori idiom adalah estimasi dan cakupan parsial harus diungkap. Memakai autentikasi dan kuota AI teks yang sudah ada.

Dropdown dan konfirmasi kustom: build produksi lulus. Browser mobile memverifikasi panel arah latihan, pemilihan Inggris → Indonesia, dialog akhir sesi dan tombol Lanjut belajar. Seluruh select pada SelaApp/AnkiImport diganti; konfirmasi hapus, generate ulang dan akhir sesi memakai dialog Sela. Prompt generasi kartu kembali menjelaskan makna dan contoh secara lengkap; detail review tetap dapat dilipat.
