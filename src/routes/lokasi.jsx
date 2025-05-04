import { createSignal, createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";

const fetchLocation = async () => {
  try {
    const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
    if (!response.ok) throw new Error("Gagal menghubungi API");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export default function Location() {
  const navigate = useNavigate();
  const [search, setSearch] = createSignal("");
  const [locationData] = createResource(fetchLocation);

  const filteredLocations = () => {
    const keyword = search().toLowerCase().trim();
    if (!keyword) return [];
    return locationData()?.filter((item) =>
      item.lokasi.toLowerCase().includes(keyword)
    );
  };

  return (
    <main class="container py-4 px-5">
      <Title>Location</Title>
      <h3 class="fw-bold mb-3 text-light">Cari ID Lokasi</h3>

      <input
        type="text"
        placeholder="Ketik nama kabupaten/kota..."
        class="form-control mb-3"
        value={search()}
        onInput={(e) => setSearch(e.currentTarget.value)}
      />

      <Show when={search() && filteredLocations().length > 0} fallback={<Show when={search()}>Tidak ditemukan.</Show>}>
        <ul class="list-group">
          <For each={filteredLocations()}>
            {(item) => (
              <li class="list-group-item d-flex justify-content-between align-items-center">
                {item.lokasi}
                <button
                  class="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/jadwal/${item.id}`)}
                >
                  {item.id}
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </main>
  );
}
