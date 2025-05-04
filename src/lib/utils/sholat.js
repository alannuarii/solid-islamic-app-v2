// utils/sholatInfo.js
export function getSholatInfo(jadwal) {
  const waktuSekarang = new Date();
  const dateStr = jadwal.jadwal.date; // format: YYYY-MM-DD
  const waktuList = [
    { nama: "SUBUH", waktu: jadwal.jadwal.subuh },
    { nama: "DZUHUR", waktu: jadwal.jadwal.dzuhur },
    { nama: "ASHAR", waktu: jadwal.jadwal.ashar },
    { nama: "MAGHRIB", waktu: jadwal.jadwal.maghrib },
    { nama: "ISYA", waktu: jadwal.jadwal.isya },
  ];

  for (let i = 0; i < waktuList.length; i++) {
    const { nama, waktu } = waktuList[i];
    const [jam, menit] = waktu.split(":").map(Number);

    const waktuSholat = new Date(dateStr + "T" + waktu + ":00");
    const sebelum = new Date(waktuSholat.getTime() - 30 * 60 * 1000);
    const sesudah = new Date(waktuSholat.getTime() + 30 * 60 * 1000);

    if (waktuSekarang >= sebelum && waktuSekarang <= waktuSholat) {
      const selisih = Math.floor((waktuSholat - waktuSekarang) / 60000);
      return {
        status: `MENUJU SHOLAT ${nama}`,
        detail: `± ${selisih} menit lagi`,
      };
    }

    if (waktuSekarang > waktuSholat && waktuSekarang <= sesudah) {
      const selisih = Math.floor((waktuSekarang - waktuSholat) / 60000);
      return {
        status: `WAKTU ${nama} SUDAH LEWAT`,
        detail: `± ${selisih} menit yang lalu`,
      };
    }
  }

  return {
    status: "",
    detail: "",
  };
}