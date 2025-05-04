import { createSignal, onMount, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import SholatCard from "../../components/SholatCard";
import { getTodayDate } from "../../lib/utils/date";
import { getSholatInfo } from "../../lib/utils/sholat";

const fetchJadwal = async (kodeKota) => {
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

export default function JadwalById() {
  const params = useParams();
  const [jadwal, setJadwal] = createSignal(null);
  const [infoWaktu, setInfoWaktu] = createSignal(null);

  onMount(async () => {
    const idLokasi = params.id;
    if (!idLokasi) return;

    const dataJadwal = await fetchJadwal(idLokasi);
    setJadwal(dataJadwal);
    setInfoWaktu(getSholatInfo(dataJadwal));
  });

  return (
    <main>
      <Title>Jadwal Sholat</Title>
      <section>
        <h3 class="mb-3 fw-bold text-light">Jadwal Sholat</h3>

        <Show when={jadwal()} fallback={<p class="text-light">Memuat data...</p>}>
          <Show when={!jadwal().error} fallback={<p class="text-light">Gagal mengambil data: {jadwal().message}</p>}>
            <>
              <div class="info mb-3">
                <h6 class="fw-bold text-light">{infoWaktu()?.status ?? ""}</h6>
                <h6 class="fw-light text-light">{infoWaktu()?.detail ?? ""}</h6>
              </div>
              <SholatCard jadwal={jadwal()} />
            </>
          </Show>
        </Show>
      </section>
    </main>
  );
}
