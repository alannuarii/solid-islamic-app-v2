import { createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import "./index.css";
import SholatCard from "../../components/SholatCard";
import { getSholatInfo } from "../../lib/utils/sholat";
import { fetchJadwal } from "../../lib/api/schedule"; 

export default function Jadwal() {
  const [jadwal, setJadwal] = createSignal(null);
  const [infoWaktu, setInfoWaktu] = createSignal(null);
  const navigate = useNavigate();

  onMount(async () => {
    const kodeKota = localStorage.getItem("kodeKota");
    const lokasiNama = localStorage.getItem("namaKota");

    if (!kodeKota) {
      navigate("/lokasi");
      return;
    }

    try {
      const dataJadwal = await fetchJadwal(kodeKota);
      setJadwal(dataJadwal);
      setInfoWaktu(getSholatInfo(dataJadwal));
    } catch (err) {
      console.error("Gagal memuat jadwal:", err);
    }
  });

  return (
    <main>
      <Title>Jadwal Sholat</Title>
      <section>
        <div class="mb-3">
          <h3 class="fw-bold text-light text-center">Jadwal Sholat</h3>
          <button
            class="btn btn-sm btn-light"
            onClick={() => {
              localStorage.removeItem("kodeKota");
              localStorage.removeItem("namaKota");
              navigate("/lokasi");
            }}
          >
            Ubah Lokasi
          </button>
        </div>

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
