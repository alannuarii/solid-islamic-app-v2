import { createResource, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

const fetchPageAyat = async (page) => {
  const res = await fetch(`https://api.myquran.com/v2/quran/ayat/page/${page}`);
  const json = await res.json();
  return json.data;
};

export default function QuranPage() {
  const params = useParams();
  const navigate = useNavigate();
  const page = () => parseInt(params.page || "1", 10);
  const [ayat] = createResource(() => page(), fetchPageAyat);

  const maxPage = 604;

  const goToPage = (num) => {
    if (num >= 1 && num <= maxPage) {
      navigate(`/quran/${num}`);
    }
  };

  return (
    <div class="px-4 offset-md-3 col-md-6">
      <Show when={ayat()} fallback={<p class="text-light">Loading...</p>}>
        <div>
          <h3 class="text-end">
            <span class="badge text-bg-light mb-3">Juz {ayat()[0].juz}</span>
          </h3>
        </div>
        <div class="d-flex flex-column gap-4">
          <For each={ayat()} fallback={<p>Data tidak ditemukan.</p>}>
            {(item, index) => {
              const prev = () => ayat()[index() - 1];
              const isSurahStart = !prev() || item.surah !== prev().surah;

              return (
                <>
                  {/* Tambahkan basmalah jika awal surah, bukan halaman 1 dan bukan Surah 9 (At-Tawbah) */}
                  {isSurahStart && page() !== 1 && item.surah !== 9 && (
                    <div class="text-center mt-4">
                      <div
                        class="text-light fw-bold"
                        style={{
                          "font-size": "1.8rem",
                          "font-family": "'Amiri', 'Scheherazade', 'Lateef', serif",
                        }}
                      >
                        ﷽
                      </div>
                    </div>
                  )}

                  <div class="border rounded-4 p-4 shadow-sm bg-dark">
                    <div
                      class="text-end fs-3 fw-lighter text-light mb-2"
                      style={{
                        direction: "rtl",
                        "font-family": "'Amiri', 'Scheherazade', 'Lateef', serif",
                        "unicode-bidi": "isolate",
                        "line-height": "2.2rem",
                      }}
                    >
                      {item.arab}
                    </div>
                    <div class="text-light fst-italic">{item.latin}</div>
                    <div class="text-light mt-1">{item.text}</div>
                    {item.audio && (
                      <audio controls class="mt-2 w-100">
                        <source src={item.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    {item.notes && <div class="mt-2 small text-light">Catatan: {item.notes}</div>}
                  </div>
                </>
              );
            }}
          </For>
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class={`page-item ${page() >= maxPage ? "disabled" : ""}`}>
              <button class="page-link" onClick={() => goToPage(page() + 1)} disabled={page() >= maxPage}>
                <i class="bi-chevron-double-left"></i>
              </button>
            </li>
            <li class="page-item">
              <span class="page-link text-dark">Page {page()}</span>
            </li>
            <li class={`page-item ${page() <= 1 ? "disabled" : ""}`}>
              <button class="page-link" onClick={() => goToPage(page() - 1)} disabled={page() <= 1}>
                <i class="bi-chevron-double-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </Show>
    </div>
  );
}
