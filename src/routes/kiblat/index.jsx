import { createSignal, onMount, Show } from "solid-js";
import { Title } from "@solidjs/meta";

export default function KiblatPage() {
  const [kiblat, setKiblat] = createSignal(null);
  const [azimuth, setAzimuth] = createSignal(0);
  const [isFacingKiblat, setIsFacingKiblat] = createSignal(false);

  onMount(() => {
    // Ambil lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const data = await res.json();
        setKiblat(data.data.direction);
      });
    }

    // Dengarkan orientasi perangkat
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      if (alpha != null) {
        const heading = Math.round(alpha);
        setAzimuth(heading);
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
  });

  const getRotation = () => {
    if (kiblat() == null) return "rotate(0deg)";
    const angle = kiblat() - azimuth();
    return `rotate(${angle}deg)`;
  };

  const checkAccuracy = () => {
    if (kiblat() == null) return false;
    const diff = Math.abs(kiblat() - azimuth());
    return diff <= 3 || diff >= 357; // wrap-around
  };

  setInterval(() => {
    setIsFacingKiblat(checkAccuracy());
  }, 500);

  return (
    <main class="text-center py-4">
      <Title>Arah Kiblat</Title>
      <h2 class="text-2xl font-bold text-light mb-4">Arah Kiblat</h2>

      <Show when={kiblat()} fallback={<p class="text-light">Memuat arah kiblat...</p>}>
        <div class="relative w-52 h-52 mx-auto rounded-full border-4 border-gray-500">
          {/* Kompas latar */}
          <div
            class="absolute top-0 left-0 w-full h-full rounded-full border border-dashed border-white"
            style={{ transform: "rotate(0deg)" }}
          ></div>

          {/* Panah arah kiblat */}
          <div
            class="absolute top-1/2 left-1/2 w-2 h-24 bg-red-600 origin-bottom -translate-x-1/2 -translate-y-full rounded"
            style={{ transform: getRotation() }}
          ></div>
        </div>

        <p class="text-light mt-4">
          Arah Kiblat: <strong>{Math.round(kiblat())}°</strong>
        </p>
        <p class="text-light">
          Arah Hadapmu: <strong>{azimuth()}°</strong>
        </p>

        <Show when={isFacingKiblat()}>
          <p class="mt-3 text-green-400 font-bold text-lg">✔ Arah Kiblat Tepat</p>
        </Show>
      </Show>
    </main>
  );
}
