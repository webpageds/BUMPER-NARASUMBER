# Cinematic Bumper Narasumber

Bumper narasumber dengan alur scene bertahap dan looping:
1. **NARASUMBER** — huruf muncul satu per satu dengan efek 3D.
2. **SEBUAH INSPIRASI AKAN HADIR** — light sweep dan ring pulse.
3. **SELAMAT DATANG** — typography reveal dengan rays dan sparkle.
4. **PLEASE WELCOME** — foto reveal, nama, jabatan/instansi, orbit rings, dan photo glint.
5. Animasi kembali ke scene pertama secara otomatis.

## File foto dan audio
Buat folder `assets` kemudian upload:
- `foto-narasumber.jpg`
- `bumper-sound.mp3`

Edit nama dan jabatan pada elemen `speaker-name` dan `speaker-role` di `index.html`.

## Atur durasi
Edit array `durations` di `script.js`. Angka dalam milidetik, urutannya mengikuti empat scene di atas.

## GitHub Pages
Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

Animasi visual langsung berjalan dan looping. Audio menggunakan tombol musik karena browser membatasi autoplay dengan suara sebelum ada interaksi pengunjung.
