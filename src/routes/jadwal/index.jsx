import { createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import "./index.css";
import SholatCard from "../../components/SholatCard";
import { getTodayDate } from "../../lib/utils/date";
import { getSholatInfo } from "../../lib/utils/sholat";

// API Key Google Maps
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Ambil nama kabupaten/kota dari koordinat GPS
const reverseGeocode = async (lat, lon) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "OK" || !data.results[0]) throw new Error("Geocoding gagal");

    const components = data.results[0].address_components;
    const kabupaten = components.find((comp) =>
      comp.types.includes("administrative_area_level_2")
    );
    return kabupaten?.long_name?.toUpperCase() ?? null;
  } catch (err) {
    console.error("Reverse Geocode error:", err);
    return null;
  }
};

// Ambil daftar kota dari API myquran
const fetchKotaList = async () => {
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

// Cari ID kota dari nama kabupaten
const getLocationIdFromName = (lokasiNama, kotaList) => {
  return kotaList.find((kota) =>
    lokasiNama.toUpperCase().includes(kota.lokasi.toUpperCase())
  )?.id;
};

// Ambil data jadwal sholat dari API
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
