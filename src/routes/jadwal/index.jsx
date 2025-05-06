import { createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import "./index.css";
import SholatCard from "../../components/SholatCard";
import { getSholatInfo } from "../../lib/utils/sholat";
import { reverseGeocode, getLocationIdFromName } from "../../lib/utils/location";
import { fetchJadwal } from "../../lib/api/schedule";
import { fetchKotaList } from "../../lib/api/location";





export default function Home() {
  const [jadwal, setJadwal] = createSignal(null);
  const [infoWaktu, setInfoWaktu] = createSignal(null);
  const navigate = useNavigate();

  onMount(async () => {
    try {
      const kotaList = await fetchKotaList();

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const lokasiNama = await reverseGeocode(latitude, longitude);
          if (!lokasiNama) {
            console.error("Gagal mendeteksi nama lokasi");
            return;
          }

          const idLokasi = getLocationIdFromName(lokasiNama, kotaList);
          if (!idLokasi) {
            console.error("ID lokasi tidak ditemukan dari:", lokasiNama);
            return;
          }

          const dataJadwal = await fetchJadwal(idLokasi);
          setJadwal(dataJadwal);
          setInfoWaktu(getSholatInfo(dataJadwal));
        },
        (err) => console.error("Gagal mengambil lokasi pengguna:", err),
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error("Inisialisasi gagal:", err);
    }
  });

  return (
    <main>
      <Title>Jadwal Sholat</Title>
      <section>
        <div class="row">
          <div class="col-8">
            <h3 class="mb-3 fw-bold text-light text-center">Jadwal Sholat</h3>
          </div>
          <div class="col-4 d-flex justify-content-start align-items-center">
            <button class="btn btn-sm btn-light" onClick={() => navigate("/lokasi")}>
              Ubah Lokasi
            </button>
          </div>
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
