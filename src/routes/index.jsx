import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <main>
      <Title>Beranda</Title>

      <div className="row">
        <div className="offset-md-4 col-md-4">
          <div class="p-5">
            <A href="/jadwal" class="btn btn-lg btn-outline-light w-100 mb-3 rounded-4 border-3">
              Jadwal Sholat
            </A>
            <A href="/kiblat" class="btn btn-lg btn-outline-light w-100 mb-3 rounded-4 border-3">
              Arah Kiblat
            </A>
            <A href="/quran" class="btn btn-lg btn-outline-light w-100 mb-3 rounded-4 border-3">
              Al-Quran
            </A>
            <A href="/doa" class="btn btn-lg btn-outline-light w-100 mb-3 rounded-4 border-3">
              Doa Harian
            </A>
          </div>
        </div>
      </div>
    </main>
  );
}
