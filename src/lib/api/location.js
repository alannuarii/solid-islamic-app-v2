export const fetchLocation = async () => {
  try {
    const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
    if (!response.ok) throw new Error("Gagal menghubungi API");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};