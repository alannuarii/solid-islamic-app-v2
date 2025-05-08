import {getTodayDate} from "../utils/date"

export const fetchJadwal = async (kodeKota) => {
  try {
    const today = getTodayDate();
    const url = `https://api.myquran.com/v2/sholat/jadwal/${kodeKota}/${today}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal menghubungi API");

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: true, message: error.message };
  }
};