import { createResource, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

const fetchPageAyat = async (page) => {
  const res = await fetch(`https://api.myquran.com/v2/quran/ayat/page/${page}`);
  const json = await res.json();
  return json.data;
};

const fetchAllSurah = async () => {
  const res = await fetch("https://api.myquran.com/v2/quran/surat/semua");
  const json = await res.json();
  return json.data;
};

const toArabicNumerals = (num) => {
  if (typeof num !== "number" && typeof num !== "string") return "";
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicDigits[parseInt(d)] || "")
    .join("");
};

export default function QuranPage() {
  const params = useParams();
  const navigate = useNavigate();
  const page = () => parseInt(params.page || "1", 10);

  const [ayat] = createResource(() => page(), fetchPageAyat);
  const [allSurah] = createResource(fetchAllSurah);

  const maxPage = 604;

  const goToPage = (num) => {
    if (num >= 1 && num <= maxPage) {
      navigate(`/quran/${num}`);
    }
  };

  const getSurahNameByNumber = (num) => {
    const match = allSurah()?.find((s) => s.number === num);
    return match?.name_id || `Surah (${num})`;
  };

  return (
    <div class="px-4 offset-md-3 col-md-6">
      <Show when={ayat() && allSurah()} fallback={<p class="text-light">Loading...</p>}>
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
                  {isSurahStart && (
                    <div class="text-center mt-3">
                      <h3 class="mb-3">
                        <span class="badge text-bg-warning rounded-4">Surah {getSurahNameByNumber(item.surah)}</span>
                      </h3>

                      {page() !== 1 && item.surah !== 9 && (
                        <div
                          class="text-light fw-bolder"
                          style={{
                            "font-size": "2rem",
                            "font-family": "'Amiri', 'Scheherazade', 'Lateef', serif",
                            "margin-bottom": "1rem",
                          }}
                        >
                          ﷽
                        </div>
                      )}
                    </div>
                  )}

                  <div class="border rounded-5 p-4 shadow-sm bg-dark">
                    <div
                      class="text-end fs-3 fw-lighter text-light mb-2"
                      style={{
                        direction: "rtl",
                        "font-family": "'Amiri', 'Scheherazade', 'Lateef', serif",
                        "unicode-bidi": "isolate",
                        "line-height": "4rem",
                      }}
                    >
                      {item.arab}
                      {item.ayah && (
                        <span
                          class="me-2"
                          style={{
                            display: "inline-block",
                            "font-size": "1.2rem",
                            "min-width": "2rem",
                            height: "2rem",
                            "line-height": "2rem",
                            "text-align": "center",
                            "vertical-align": "middle",
                            "border-radius": "999px",
                            border: "2px solid #57cc99",
                            color: "#57cc99",
                            "font-weight": "bold",
                          }}
                        >
                          {toArabicNumerals(item.ayah)}
                        </span>
                      )}
                    </div>
                    <div class="text-light fst-italic">{item.latin}</div>
                    <div class="text-warning mt-1">{item.text}</div>
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
