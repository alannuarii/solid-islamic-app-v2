import { createResource } from "solid-js";
import { Title } from "@solidjs/meta";
import "./jadwal.css";
import SholatCard from "../components/SholatCard";
import { getTodayDate } from "../lib/utils/date";

const fetchJadwal = async () => {
  const kodeKota = 2905;
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

export default function Home() {
  const [jadwal] = createResource(fetchJadwal);

  return (
    <main>
      <Title>Jadwal Sholat</Title>
      <section>
        <h3 class="mb-3 fw-bold">Jadwal Sholat</h3>
        <div class="info mb-3">
          <h6 class="fw-bold">WAKTU INSYA SUDAH LEWAT</h6>
          <h6 class="fw-light">2 jam 7 menit yang lalu</h6>
        </div>

        <Show when={jadwal()} fallback={<p>Memuat data...</p>}>
          <Show when={!jadwal().error} fallback={<p>Gagal mengambil data: {jadwal().message}</p>}>
            <SholatCard jadwal={jadwal()} />
          </Show>
        </Show>
      </section>
    </main>
  );
}
