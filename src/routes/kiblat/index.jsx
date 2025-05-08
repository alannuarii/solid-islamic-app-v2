import { createSignal, onMount, Show, onCleanup } from "solid-js";
import { Title } from "@solidjs/meta";

export default function Kiblat() {
  const [arahKiblat, setArahKiblat] = createSignal(null);
  const [azimuth, setAzimuth] = createSignal(0);
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [isArahTepat, setIsArahTepat] = createSignal(false);

  const fetchQiblaDirection = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lon}`);
      const data = await res.json();
      if (data.code === 200) {
        setArahKiblat(data.data.direction);
      } else {
        setError("Gagal memuat arah kiblat dari API.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data arah kiblat.");
    } finally {
      setLoading(false);
    }
  };

  const setupOrientationListener = () => {
    const handleOrientation = (e) => {
      const alpha = e.alpha ?? 0;
      setAzimuth(alpha);

      if (arahKiblat() !== null) {
        const selisih = Math.abs(arahKiblat() - alpha);
        const delta = selisih > 180 ? 360 - selisih : selisih;
        setIsArahTepat(delta <= 3); // toleransi 3 derajat
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation, true);
            } else {
              setError("Akses orientasi ditolak.");
            }
          })
          .catch(() => setError("Gagal meminta izin sensor."));
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }

      onCleanup(() => {
        window.removeEventListener("deviceorientation", handleOrientation);
      });
    } else {
      setError("Perangkat tidak mendukung kompas.");
    }
  };

  onMount(() => {
    if (!navigator.geolocation) {
      setError("Peramban tidak mendukung geolokasi.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchQiblaDirection(latitude, longitude);
        setupOrientationListener();
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setLoading(false);
      }
    );
  });

  return (
    <main class="container py-4 px-5 text-light">
      <Title>Arah Kiblat Interaktif</Title>
      <h3 class="fw-bold mb-3">Arah Kiblat Interaktif</h3>

      <Show when={loading()}>
        <p>Memuat arah kiblat dan lokasi...</p>
      </Show>

      <Show when={error()}>
        <p class="text-danger">Error: {error()}</p>
      </Show>

      <Show when={arahKiblat() !== null && !error()}>
        <p class="fs-5">
          Arah kiblat dari lokasi Anda: <strong>{arahKiblat().toFixed(2)}°</strong>
        </p>
        <p class="fs-6">Arah perangkat: {azimuth().toFixed(2)}°</p>

        <div class="mt-4" style="display: flex; justify-content: center;">
          <div
            style={{
              width: "250px",
              height: "250px",
              border: "4px solid #fff",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            {/* Panah arah kiblat */}
            <div
              style={{
                width: "4px",
                height: "120px",
                background: isArahTepat() ? "limegreen" : "red",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `rotate(${arahKiblat() - azimuth()}deg) translateY(-100%)`,
                transformOrigin: "bottom center",
                transition: "transform 0.2s linear, background 0.2s",
              }}
            ></div>

            {/* Titik pusat */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "10px",
                height: "10px",
                background: "white",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        </div>

        <Show when={isArahTepat()}>
          <p class="mt-3 text-success fw-bold fs-5">
            ✔ Arah sudah tepat ke Kiblat!
          </p>
        </Show>
      </Show>
    </main>
  );
}
