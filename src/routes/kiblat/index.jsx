import { createSignal, onMount, Show } from "solid-js";
import { Title } from "@solidjs/meta";

export default function KiblatPage() {
  const [kiblat, setKiblat] = createSignal(null);
  const [azimuth, setAzimuth] = createSignal(0);
  const [isFacingKiblat, setIsFacingKiblat] = createSignal(false);

  onMount(() => {
    // Ambil arah kiblat
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const data = await res.json();
        setKiblat(data.data.direction);
      });
    }

    // Orientasi perangkat
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
    return diff <= 3 || diff >= 357;
  };

  setInterval(() => {
    setIsFacingKiblat(checkAccuracy());
  }, 500);

  return (
    <main class="container py-5" style={{ textAlign: "center" }}>
      <Title>Arah Kiblat</Title>
      <h2 class="mb-4 display-4">Arah Kiblat</h2>

      <Show when={kiblat()} fallback={<p>Memuat arah kiblat...</p>}>
        <div
          class="position-relative mx-auto"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "4px solid #ccc",
          }}
        >
          {/* Panah arah kiblat */}
          <div
            class={`position-absolute top-50 start-50 translate-middle w-2 h-25 rounded-3 ${
              isFacingKiblat() ? "bg-success" : "bg-danger"
            }`}
            style={{
              transform: `${getRotation()} translate(-50%, -100%)`,
              transformOrigin: "bottom center",
              transition: "background-color 0.3s",
            }}
          ></div>
        </div>

        <div class="mt-4">
          <p>Arah Kiblat: <strong>{Math.round(kiblat())}°</strong></p>
          <p>Arah Hadapmu: <strong>{azimuth()}°</strong></p>
        </div>

        <Show when={isFacingKiblat()}>
          <p class="mt-3 text-success font-weight-bold">✔ Kamu sudah menghadap Kiblat</p>
        </Show>
      </Show>
    </main>
  );
}
