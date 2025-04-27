// Fungsi untuk mendapatkan tanggal sekarang dalam format YYYY-MM-DD
export function getTodayDate() {
  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = String(now.getMonth() + 1).padStart(2, "0"); // bulan dari 0-11
  const tanggal = String(now.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${tanggal}`;
}

// Fungsi untuk mengkonversi tanggal dari format YYYY-MM-DD ke format Indonesia
export function formatTanggalIndonesia(tanggalStr) {
  const hari = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tanggal = new Date(tanggalStr + "T00:00:00"); // agar tidak error zona waktu
  const hariNama = hari[tanggal.getDay()];
  const tanggalAngka = tanggal.getDate();
  const bulanNama = bulan[tanggal.getMonth()];
  const tahun = tanggal.getFullYear();

  return `${hariNama}, ${tanggalAngka} ${bulanNama} ${tahun}`;
}
