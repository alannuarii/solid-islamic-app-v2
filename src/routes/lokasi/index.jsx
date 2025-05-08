import { createSignal, createResource, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { fetchLocation } from "../../lib/api/location"; 

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
      <Title>Pilih Lokasi</Title>
      <h3 class="fw-bold mb-3 text-light">Cari Lokasi Sholat</h3>

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
                  onClick={() => {
                    localStorage.setItem("kodeKota", item.id);
                    localStorage.setItem("namaKota", item.lokasi);
                    navigate("/jadwal");
                  }}
                >
                  Pilih
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </main>
  );
}
