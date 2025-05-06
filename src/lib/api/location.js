// Ambil daftar kota dari API myquran
export const fetchKotaList = async () => {
  try {
    const res = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
    if (!res.ok) throw new Error("Gagal mengambil daftar kota");
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Fetch kota list error:", err);
    return [];
  }
};