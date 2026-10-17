# Product Requirements Document
# Aplikasi Flashcard AI — Inggris ↔ Indonesia

**Versi:** 1.0  
**Tanggal:** 14 Oktober 2026  
**Status:** Draf untuk acuan desain dan pengembangan  
**Nama produk:** Belum ditentukan  
**Platform:** Website PWA, mengutamakan penggunaan di HP

---

## 1. Ringkasan produk

Aplikasi ini membantu pengguna menghafal kosakata Inggris dan Indonesia melalui flashcard dengan pengulangan terjadwal.

Pengguna cukup memasukkan kata. AI menyiapkan arti, penjelasan singkat, dan contoh penggunaan beserta terjemahannya. Pengguna dapat meminta gambar untuk membantu pemahaman dan memutar audio pelafalan melalui tombol pada kartu.

Aplikasi mempertahankan fungsi penting aplikasi flashcard: deck, bintang, pencarian, pengelolaan kartu, penilaian hafalan, serta tracking progres. Jadwal pengulangan menyesuaikan hasil latihan pengguna.

Produk dibuat untuk kebutuhan pribadi terlebih dahulu, dengan dukungan akun agar pengguna lain dapat mencobanya dan menyimpan koleksi masing-masing.

**Pengalaman utama:**

> Masukkan kata → AI menyiapkan kartu → periksa dan simpan → latihan → nilai hafalan → ulangi pada waktu yang sesuai.

## 2. Masalah yang diselesaikan

Pembuatan flashcard kosakata membutuhkan pekerjaan berulang: mencari arti, menulis penjelasan, membuat contoh kalimat, mencari gambar, dan menambahkan pelafalan.

Pekerjaan tersebut dapat mengurangi waktu belajar dan membuat pengguna enggan menambahkan kosakata baru. Sementara itu, membaca arti saja belum cukup untuk memastikan kata dapat diingat kembali.

Produk ini menggabungkan pembuatan materi dengan AI dan latihan mengingat melalui pengulangan terjadwal.

## 3. Tujuan dan ukuran keberhasilan

### Tujuan produk

1. Mengurangi pekerjaan manual dalam pembuatan flashcard.
2. Membantu pengguna memahami dan mengingat kosakata dalam dua arah.
3. Menyediakan pengalaman belajar yang cepat, sederhana, dan nyaman di HP.
4. Menjaga kartu dan progres tersedia lintas perangkat.
5. Mengendalikan penggunaan AI agar biaya dan kuota tetap terkelola.

### Ukuran keberhasilan

| Aspek | Ukuran yang dipantau |
|---|---|
| Aktivasi | Pengguna berhasil membuat kartu pertama dan menyelesaikan latihan pertama |
| Kemudahan pembuatan | Waktu dari memasukkan kata hingga kartu siap dipelajari |
| Kualitas AI | Persentase hasil yang digunakan langsung, dikoreksi, atau dibuat ulang |
| Kebiasaan belajar | Pengguna yang kembali belajar dan jumlah hari aktif belajar |
| Perkembangan hafalan | Perubahan hasil penilaian dan jumlah kosakata yang memenuhi kriteria penguasaan |
| Keandalan | Keberhasilan generasi, penyimpanan, dan sinkronisasi |
| Efisiensi | Jumlah permintaan AI per kartu yang berhasil dibuat |

Angka target adopsi dan retensi ditentukan setelah uji coba awal. Produk tidak boleh mengklaim peningkatan hafalan sebelum ada data yang mendukung.

## 4. Pengguna dan skenario penggunaan

### Pengguna utama

Pelajar mandiri yang ingin memperkaya kosakata Inggris–Indonesia tanpa membuat seluruh isi flashcard secara manual.

### Skenario utama

- Menemukan kata Inggris saat membaca, lalu menyimpannya untuk dipelajari.
- Memasukkan kata Indonesia untuk mempelajari padanan bahasa Inggrisnya.
- Menambahkan kalimat asal agar AI memahami konteks kata.
- Menyelesaikan latihan harian dari HP.
- Membuka koleksi dan melanjutkan belajar dari laptop.
- Mengulang kartu yang sudah tersimpan ketika tidak terhubung internet.

### Batas fokus

Produk berfokus pada kosakata dan frasa pendek. Kursus tata bahasa lengkap, percakapan dengan AI, dan penilaian kemampuan berbicara berada di luar versi pertama.

## 5. Cakupan versi pertama

### Fitur wajib

- Akun pengguna dan penyimpanan terpisah.
- Deck dan pengelolaan koleksi.
- Generasi arti, penjelasan, dan contoh dengan AI.
- Koreksi hasil, pemilihan makna, dan deteksi duplikat.
- Gambar sesuai permintaan.
- Audio pelafalan melalui tombol.
- Latihan dua arah dengan progres terpisah.
- Pengulangan terjadwal berdasarkan penilaian hafalan.
- Dashboard dan tracking.
- PWA dan latihan offline untuk data yang tersedia di perangkat.
- Sinkronisasi lintas perangkat.
- Backup, ekspor, dan pemulihan data.
- Pembatasan pemakaian AI serta penanganan kegagalan.

### Di luar cakupan versi pertama

- Marketplace atau berbagi deck secara publik.
- Kolaborasi mengedit deck.
- Aplikasi native Android dan iOS.
- Chat tutor AI.
- Penilaian pelafalan melalui mikrofon.
- Gamifikasi kompleks, leaderboard, dan fitur sosial.
- Dukungan bahasa di luar Inggris dan Indonesia.
- Pembayaran atau langganan.
- Kompatibilitas penuh dengan format deck Anki.

Tahapan pembangunan merupakan urutan implementasi. Gambar, audio, dan offline tetap bagian dari cakupan produk, meskipun dikerjakan setelah fondasi belajar.

## 6. Istilah dan aturan dasar

| Istilah | Definisi |
|---|---|
| Entri kosakata | Satu kata atau frasa dengan satu makna yang dipilih dan pasangan bahasanya |
| Kartu latihan | Satu arah pertanyaan dari sebuah entri kosakata |
| Deck | Kelompok entri kosakata milik pengguna |
| Review | Satu aktivitas membuka jawaban dan memberikan penilaian |
| Kartu jatuh tempo | Kartu yang telah mencapai waktu pengulangan berikutnya |
| Draf | Entri yang belum siap dilatih karena isinya belum lengkap atau belum dikonfirmasi |

Satu entri dapat menghasilkan dua kartu latihan: Inggris → Indonesia dan Indonesia → Inggris. Kedua kartu berbagi isi kosakata, tetapi mempunyai jadwal serta riwayat belajar masing-masing.

Satu kata dapat memiliki beberapa entri apabila maknanya berbeda. Karena itu, kata yang sama tidak selalu merupakan duplikat.

## 7. Alur pengguna

### 7.1 Penggunaan pertama

1. Pengguna mendaftar atau masuk.
2. Pengguna membuat deck atau menggunakan deck awal.
3. Pengguna memilih arah bahasa dan memasukkan kata.
4. AI menghasilkan isi kartu.
5. Pengguna memeriksa hasil, mengoreksi bila perlu, lalu menyimpan.
6. Pengguna memulai latihan.

**Usulan awal:** sistem menyediakan deck “Kosakata Saya” untuk mengurangi langkah saat pertama kali menggunakan aplikasi.

### 7.2 Menambahkan kosakata

1. Pilih deck dan bahasa kata yang dimasukkan.
2. Masukkan kata atau frasa pendek.
3. Tambahkan konteks jika tersedia.
4. Simpan masukan sebagai draf sebelum permintaan AI dikirim.
5. Tampilkan hasil AI untuk diperiksa.
6. Jika ada beberapa makna, pengguna memilih makna yang akan dipelajari.
7. Simpan entri yang siap dilatih.

Gambar dan audio dapat diminta setelah isi teks tersedia. Kegagalan media tidak menghalangi penyimpanan atau latihan teks.

### 7.3 Latihan harian

1. Buka dashboard dan pilih “Mulai belajar”.
2. Aplikasi menampilkan kartu jatuh tempo dan kartu baru sesuai batas sesi.
3. Pengguna mencoba mengingat jawabannya.
4. Pengguna membuka jawaban.
5. Pengguna memilih Again, Hard, Good, atau Easy.
6. Aplikasi mencatat hasil dan memperbarui jadwal.
7. Setelah sesi berakhir, aplikasi menampilkan ringkasan.

### 7.4 Latihan offline

1. Pengguna membuka aplikasi yang sebelumnya sudah dimuat di perangkat.
2. Aplikasi menggunakan kartu dan jadwal yang tersimpan secara lokal.
3. Hasil latihan disimpan di perangkat.
4. Saat koneksi kembali, aplikasi menyinkronkan aktivitas dan jadwal.

Pengguna dapat melihat apakah progres sudah tersinkron atau masih tersimpan di perangkat.

## 8. Kebutuhan fungsional

### FR-01 — Akun dan akses

- Pengguna dapat mendaftar, masuk, keluar, dan memulihkan akses akun.
- Setiap pengguna hanya dapat mengakses koleksi, media privat, dan progres miliknya.
- Pengguna dapat membuka data yang sama dari beberapa perangkat.
- Data lokal harus dipisahkan berdasarkan akun.

**Kriteria penerimaan:**

- Pengguna A tidak dapat membaca atau mengubah data pengguna B melalui antarmuka maupun permintaan langsung.
- Setelah masuk di perangkat lain dan sinkronisasi selesai, koleksi serta progres tersedia.
- Pergantian akun tidak menampilkan data lokal akun sebelumnya.

**Usulan awal:** login menggunakan email dan kata sandi. Login sosial dapat ditambahkan kemudian.

### FR-02 — Deck dan koleksi

- Pengguna dapat membuat, mengganti nama, dan menghapus deck.
- Pengguna dapat memindahkan entri antar-deck.
- Pengguna dapat mencari kata dan memfilter berdasarkan deck atau bintang.
- Pengguna dapat mengedit dan menghapus entri.
- Penghapusan yang menghilangkan isi harus menjelaskan dampaknya dan meminta konfirmasi.

**Kriteria penerimaan:**

- Memindahkan entri tidak mereset progres latihan.
- Bintang tetap tersimpan setelah aplikasi dibuka kembali.
- Penghapusan deck tidak menghilangkan entri tanpa pilihan atau konfirmasi yang jelas.

### FR-03 — Pembuatan teks dengan AI

Masukan minimum:

- Kata atau frasa pendek.
- Bahasa sumber.
- Deck tujuan.

Masukan opsional:

- Kalimat asal atau konteks penggunaan.

Keluaran minimum:

- Kata atau frasa dalam bahasa sumber.
- Padanan bahasa tujuan untuk makna yang dipilih.
- Penjelasan singkat dalam bahasa Indonesia.
- Contoh kalimat bahasa Inggris.
- Terjemahan contoh dalam bahasa Indonesia.

**Aturan:**

- Arti dan contoh harus konsisten dengan makna yang dipilih.
- Sistem memvalidasi kelengkapan hasil sebelum kartu dinyatakan siap.
- Pengguna dapat mengedit isi dan meminta pembuatan ulang.
- Pembuatan ulang tidak menimpa hasil edit pengguna secara diam-diam.
- Klik atau pengiriman ulang tidak boleh membuat entri ganda tanpa sengaja.

**Kriteria penerimaan:**

- Pengguna dapat membuat kartu tanpa mengetik arti dan contoh sendiri.
- Keluaran tidak lengkap atau gagal diproses ditampilkan sebagai kegagalan yang dapat dicoba lagi.
- Kata awal tetap tersimpan saat permintaan AI gagal.

### FR-04 — Makna dan duplikat

- Sistem memeriksa kemungkinan duplikat setelah menormalkan spasi dan kapitalisasi.
- Pemeriksaan mempertimbangkan bahasa sumber dan makna.
- Jika kata sudah ada, pengguna dapat membuka entri lama atau menyimpan makna berbeda.
- Satu entri berfokus pada satu makna agar latihan tidak membingungkan.

**Kriteria penerimaan:**

- Perbedaan kapitalisasi saja tidak menghasilkan duplikat yang tidak terdeteksi.
- Dua makna berbeda dari kata yang sama tetap dapat disimpan.
- Deteksi duplikat tidak membocorkan koleksi pengguna lain.

### FR-05 — Gambar

- Pengguna menekan tombol untuk meminta gambar.
- Gambar mengikuti makna dan konteks entri.
- Status proses, kegagalan, dan coba lagi tersedia.
- Gambar yang berhasil dibuat disimpan dan dapat dibuka kembali.
- Pengguna dapat menghapus atau mengganti gambar yang tidak membantu.
- Tersedia deskripsi alternatif untuk aksesibilitas.

**Kriteria penerimaan:**

- Gambar tidak dibuat otomatis untuk semua entri.
- Membuka gambar yang sudah tersedia tidak memicu generasi baru.
- Kegagalan gambar tidak mengganggu latihan teks.

Untuk kata abstrak, gambar berfungsi sebagai ilustrasi konteks, bukan definisi tunggal.

### FR-06 — Audio pelafalan

- Pengguna dapat memutar pelafalan melalui tombol.
- Bahasa suara mengikuti kata yang dibacakan.
- Pemutaran hanya dimulai setelah tindakan pengguna.
- Pemutaran baru menghentikan audio sebelumnya.
- Audio disimpan apabila penyedia dan izin penggunaannya mendukung penyimpanan.

**Kriteria penerimaan:**

- Audio membacakan kata yang ditampilkan dengan bahasa yang tepat.
- Status memuat atau gagal ditampilkan dengan jelas.
- Audio offline tersedia hanya jika telah tersimpan di perangkat.

Penyedia, aksen bahasa Inggris, biaya, dan kemampuan penyimpanan audio masih perlu dipilih.

### FR-07 — Latihan dan pengulangan

- Pertanyaan ditampilkan sebelum jawaban.
- Terjemahan dan petunjuk yang membocorkan jawaban disembunyikan sampai pengguna membuka jawaban.
- Penilaian baru tersedia setelah jawaban dibuka.
- Sistem menyediakan empat pilihan:

| Pilihan | Makna bagi pengguna |
|---|---|
| Again / Belum ingat | Tidak berhasil mengingat jawaban |
| Hard / Sulit | Berhasil mengingat dengan kesulitan |
| Good / Cukup | Berhasil mengingat dengan usaha wajar |
| Easy / Mudah | Berhasil mengingat dengan mudah |

- Penilaian memperbarui jadwal kartu pada arah yang sedang dilatih.
- Sistem menggunakan algoritma pengulangan yang konsisten dan teruji.
- Jadwal dapat dihitung tanpa memanggil AI.
- Pengguna dapat belajar seluruh deck atau deck tertentu.
- Prioritas awal diberikan pada kartu jatuh tempo sebelum kartu baru.

**Kriteria penerimaan:**

- Nilai untuk Inggris → Indonesia tidak mengubah progres arah sebaliknya.
- Memuat ulang halaman tidak mereset jadwal.
- Pengiriman penilaian yang sama berulang karena gangguan jaringan hanya dihitung sekali.
- Perhitungan jadwal dapat diuji dengan hasil yang konsisten.
- Jika isi atau makna entri berubah besar, pengguna mendapat pilihan untuk mereset progres yang terdampak.

Pemilihan algoritma, batas kartu baru, dan parameter interval harus diselesaikan sebelum fitur penjadwalan diimplementasikan.

### FR-08 — Dashboard dan tracking

Dashboard menampilkan:

- Kosakata yang disimpan.
- Kosakata yang sudah dilatih.
- Kosakata yang cukup dikuasai.
- Kartu yang perlu diulang hari ini.
- Aktivitas latihan hari ini.

**Aturan penghitungan:**

- Total kosakata menghitung entri unik; dua arah latihan tidak menggandakan jumlah kosakata.
- “Sudah dilatih” berarti setidaknya satu arah pernah dinilai.
- Jumlah review menghitung aktivitas latihan dan dibedakan dari jumlah kosakata.
- Draf yang belum siap tidak dihitung sebagai kartu siap belajar.
- Hari belajar mengikuti zona waktu pengguna.

**Usulan kriteria “cukup dikuasai”:**

Sebuah arah latihan memiliki tiga penilaian terakhir Good atau Easy dan interval berikutnya minimal 21 hari. Entri dinyatakan cukup dikuasai jika kedua arah memenuhi kriteria tersebut.

Kriteria ini merupakan indikator operasional yang perlu dievaluasi, bukan jaminan bahwa kata akan selalu diingat.

### FR-09 — PWA, offline, dan sinkronisasi

- Aplikasi menyediakan pengalaman pemasangan pada browser yang mendukung PWA.
- Aplikasi menyimpan materi yang diperlukan untuk latihan offline.
- Pengguna dapat melihat ketersediaan kartu untuk offline.
- Pengguna dapat memasukkan kata saat offline sebagai draf.
- Generasi AI dilakukan setelah tersedia koneksi dan pengguna menjalankan atau melanjutkan prosesnya.
- Aktivitas offline diantrikan sampai berhasil disinkronkan.

**Kriteria penerimaan:**

- Kartu tersimpan dapat dilatih setelah jaringan diputus.
- Progres offline tetap ada setelah aplikasi ditutup dan dibuka kembali.
- Proses sinkronisasi ulang tidak menggandakan review.
- Review bersamaan dari beberapa perangkat menghasilkan riwayat yang utuh dan satu jadwal yang konsisten.
- Konflik perubahan isi tidak membuang edit pengguna secara diam-diam.
- Penghapusan yang telah tersinkron tidak dibatalkan oleh data lama dari perangkat lain.

Penyimpanan browser dapat dibersihkan oleh pengguna atau sistem. Setelah sinkronisasi, database menjadi tempat pemulihan data; progres yang belum tersinkron masih bergantung pada perangkat.

### FR-10 — Backup, ekspor, dan pemulihan

**Usulan format utama:** JSON berversi.

Backup mencakup:

- Deck dan entri kosakata.
- Isi kartu dan bintang.
- Status serta jadwal kedua arah latihan.
- Riwayat review.
- Pengaturan belajar yang relevan.

Media disertakan dalam paket terpisah atau mekanisme unduh yang dijelaskan kepada pengguna. Ekspor data teks tidak boleh disebut backup media lengkap.

**Kriteria penerimaan:**

- Data dapat diekspor dan dipulihkan tanpa kehilangan hubungan deck, kartu, dan progres.
- Berkas impor divalidasi sebelum data diterapkan.
- Pemulihan tidak membuat duplikat tanpa penanganan yang jelas.
- Pengguna mengetahui apakah gambar dan audio termasuk dalam backup.

### FR-11 — Kuota dan kegagalan AI

- Permintaan AI melewati server.
- Kunci API tidak dikirim ke browser.
- Sistem menerapkan batas penggunaan per akun dan batas keseluruhan.
- Pengguna mendapat informasi saat kuota habis atau penyedia tidak tersedia.
- Permintaan yang gagal tidak mencoba ulang tanpa batas.
- Sistem tidak beralih ke model berbayar secara otomatis tanpa kebijakan biaya yang telah ditetapkan.
- Status kuota di aplikasi dapat berbeda dari kuota penyedia; permintaan gagal mungkin tetap dihitung oleh penyedia.

**Kriteria penerimaan:**

- Batas tidak dapat dilewati hanya dengan memodifikasi tampilan browser.
- Saat AI tidak tersedia, pengelolaan dan latihan kartu tersimpan tetap berfungsi.
- Hasil AI yang berhasil disimpan digunakan kembali tanpa panggilan ulang yang tidak diperlukan.

## 9. Struktur layar

| Layar | Isi utama |
|---|---|
| Masuk/Daftar | Akses akun dan pemulihan |
| Beranda | Latihan hari ini, tambah kata, statistik ringkas |
| Deck | Daftar deck dan jumlah kartu |
| Isi deck | Daftar kosakata, pencarian, filter bintang |
| Tambah kata | Bahasa sumber, kata, konteks, deck, hasil AI |
| Detail/Edit kartu | Isi teks, makna, gambar, audio, bintang |
| Latihan | Pertanyaan, buka jawaban, empat penilaian |
| Ringkasan sesi | Jumlah review dan hasil sesi |
| Pengaturan | Preferensi belajar, sinkronisasi, kuota, backup |

**Arah visual:**

- Warna lembut dan kontras teks yang jelas.
- Ruang yang cukup di sekitar kartu.
- Satu aksi utama yang mudah dikenali pada setiap layar.
- Navigasi nyaman dengan satu tangan di HP.
- Animasi singkat serta dukungan preferensi pengurangan gerak.
- Tidak bergantung pada warna saja untuk menyampaikan status.

## 10. Kebutuhan nonfungsional

Target berikut merupakan usulan penerimaan awal dan harus diuji pada perangkat serta kondisi jaringan yang disepakati.

| Aspek | Target/kebutuhan |
|---|---|
| Muat awal | Target LCP ≤ 2,5 detik pada skenario pengujian mobile yang representatif |
| Interaksi | Buka jawaban dan pindah kartu lokal terasa langsung; target respons ≤ 200 ms |
| Tata letak | Target CLS ≤ 0,1 |
| AI | Indikator proses tampil segera; kegagalan dan batas waktu ditangani tanpa halaman macet |
| Keandalan | Kata disimpan sebelum generasi; review disimpan lokal sebelum navigasi berikutnya |
| Aksesibilitas | Bisa digunakan dengan keyboard, fokus terlihat, tombol berlabel, dan teks dapat diperbesar |
| Keamanan | Autentikasi, pembatasan akses data, validasi masukan, serta pembatasan permintaan |
| Observabilitas | Kesalahan generasi dan sinkronisasi dapat ditelusuri tanpa mencatat rahasia atau isi pengguna secara berlebihan |

Kecepatan keluaran AI bergantung pada penyedia. Antarmuka tetap responsif selama proses tersebut berjalan.

## 11. Rancangan teknologi

| Bagian | Pilihan |
|---|---|
| Bahasa aplikasi | JavaScript |
| Antarmuka dan aplikasi web | React dengan Next.js |
| Distribusi | Website PWA |
| Database | PostgreSQL melalui Supabase |
| Akun | Supabase Auth |
| Media | Supabase Storage |
| AI teks | OpenRouter, memprioritaskan model gratis yang lolos pengujian kualitas |
| AI gambar | Belum dipilih |
| Audio pelafalan | Belum dipilih |
| Penyimpanan offline | IndexedDB untuk data dan antrean; cache untuk aset yang sesuai |
| Hosting aplikasi | Belum dipilih |

### Prinsip arsitektur

- Server memvalidasi pengguna, kuota, dan permintaan AI.
- Database menyimpan data pengguna dan progres yang telah tersinkron.
- Penyimpanan lokal mendukung akses cepat dan aktivitas offline.
- Media dimuat sesuai kebutuhan.
- Hasil model diperlakukan sebagai data yang harus divalidasi.
- Jadwal latihan dihitung oleh logika aplikasi, bukan model AI.
- Akses database dan media ditegakkan di sisi layanan, tidak hanya melalui tampilan.

### Entitas data utama

- Pengguna dan preferensi.
- Deck.
- Entri kosakata.
- Makna dan contoh penggunaan.
- Kartu latihan per arah.
- Status pengulangan.
- Riwayat review.
- Media.
- Permintaan serta penggunaan AI.
- Operasi sinkronisasi.

Detail tabel, indeks, dan API ditentukan dalam desain teknis.

## 12. Dependensi dan keputusan terbuka

| Keputusan | Arahan |
|---|---|
| Nama dan identitas visual | Belum ditentukan |
| Algoritma pengulangan | Pilih implementasi teruji sebelum membangun penjadwalan |
| Model teks | Uji arti kontekstual, contoh, terjemahan, waktu respons, dan konsistensi hasil |
| Gambar | Uji kualitas, biaya, latensi, dan izin penyimpanan |
| Audio | Uji ketepatan bahasa, pelafalan, aksen, biaya, serta dukungan offline |
| Batas kuota | Konfigurabel; ditentukan dari kapasitas penyedia dan uji penggunaan |
| Hosting | Mendukung kebutuhan Next.js dan pemrosesan server |
| Penguasaan kata | Evaluasi usulan kriteria setelah uji coba |
| Konflik sinkronisasi | Tetapkan aturan penyelesaian sebelum implementasi offline |

Ketergantungan operasional meliputi proyek Supabase, konfigurasi autentikasi, kredensial penyedia AI, dan lingkungan hosting.

## 13. Risiko produk dan mitigasi

| Risiko | Mitigasi |
|---|---|
| AI memberikan arti atau contoh keliru | Konteks opsional, pemilihan makna, koreksi manual, dan pengujian kualitas |
| Model gratis berubah atau dibatasi | Model dapat dikonfigurasi; draf dan latihan tetap tersedia |
| Gambar tidak relevan | Generasi berdasarkan makna; pengguna dapat mengganti atau menghapus |
| Latensi media mengganggu belajar | Muat saat diminta dan simpan hasilnya |
| Progres hilang atau terhitung ganda | Penyimpanan lokal, operasi yang aman diulang, dan pengujian sinkronisasi |
| Dua arah dianggap setara | Status dan riwayat dipisahkan per arah |
| Statistik memberi kesan penguasaan berlebihan | Definisi metrik jelas dan label penguasaan dijelaskan |
| Cakupan berkembang terlalu cepat | Selesaikan alur inti sebelum menambah fitur di luar versi pertama |

## 14. Tahapan implementasi

### Tahap 1 — Fondasi

Akun, database, pembatasan akses, deck, pengelolaan kartu, dan struktur antarmuka.

**Selesai ketika:** pengguna dapat menyimpan serta mengelola koleksi miliknya tanpa bercampur dengan akun lain.

### Tahap 2 — Sistem belajar

Kartu dua arah, pengulangan terjadwal, riwayat review, dan dashboard.

**Selesai ketika:** hasil latihan mengubah jadwal secara konsisten dan tracking sesuai riwayat.

### Tahap 3 — AI teks

Generasi, konteks, pemilihan makna, koreksi, duplikat, kuota, serta penanganan gagal.

**Selesai ketika:** alur memasukkan kata hingga menjadi kartu siap belajar bekerja dengan layanan AI yang dikonfigurasi.

### Tahap 4 — Gambar dan audio

Integrasi penyedia, penyimpanan media, pemutaran, dan penanganan kegagalan.

**Selesai ketika:** media benar-benar tersedia dari integrasi yang diuji dan dapat digunakan kembali.

### Tahap 5 — PWA dan penyelesaian

Latihan offline, sinkronisasi, backup/pemulihan, aksesibilitas, dan optimasi performa.

**Selesai ketika:** alur online, offline, pergantian perangkat, dan pemulihan data lulus pengujian.

## 15. Kriteria selesai versi pertama

Versi pertama siap diuji oleh pengguna lain apabila:

- Seluruh fitur wajib memiliki alur yang berfungsi.
- Pengguna dapat membuat kartu dari kata Inggris maupun Indonesia.
- Hasil AI dapat diperiksa dan diperbaiki.
- Gambar dan audio bekerja dengan penyedia yang telah dipilih.
- Kedua arah latihan memiliki progres terpisah.
- Review dan statistik tidak terduplikasi karena pengiriman ulang.
- Akses antar-akun terisolasi.
- Latihan offline dan sinkronisasi kembali berhasil diuji.
- Backup dapat dipulihkan dan cakupan media dijelaskan.
- Kondisi kosong, memuat, gagal, offline, serta kuota habis memiliki tampilan yang jelas.
- Tampilan diuji pada HP dan laptop.
- Target performa diukur; keterbatasan yang tersisa didokumentasikan.
- Pengujian integrasi menggunakan layanan nyata telah dilakukan untuk fitur yang memerlukannya.

**Hasil yang diharapkan:** pengguna menghabiskan lebih banyak waktu mengingat kosakata dan lebih sedikit waktu menyiapkan flashcard.