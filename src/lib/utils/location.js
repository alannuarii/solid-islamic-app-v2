// API Key Google Maps
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Fungsi normalisasi nama lokasi
const normalizeLocationName = (name, type) => {
  let cleaned = name.toUpperCase().trim();

  cleaned = cleaned
    .replace(/^KABUPATEN\s*/i, "")
    .replace(/^KAB\.?\s*/i, "")
    .replace(/^KOTA\s*/i, "")
    .replace(/\s*CITY$/i, "")
    .trim();

  if (type === "kabupaten") return `KAB. ${cleaned}`;
  if (type === "kota") return `KOTA ${cleaned}`;
  return cleaned;
};

// Ambil nama kabupaten/kota dari koordinat GPS
export const reverseGeocode = async (lat, lon) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "OK" || !data.results[0]) throw new Error("Geocoding gagal");

    const components = data.results[0].address_components;
    const kabOrKota = components.find((comp) =>
      comp.types.includes("administrative_area_level_2")
    );

    const name = kabOrKota?.long_name ?? "";

    const isCity = /city/i.test(name);
    const isKabupaten = /kab\.?|kabupaten/i.test(name);

    if (isKabupaten) {
      return normalizeLocationName(name, "kabupaten"); // akan menjadi "KAB. X"
    } else if (isCity) {
      return normalizeLocationName(name, "kota"); // akan menjadi "KOTA Y"
    } else {
      // fallback ke kota
      return normalizeLocationName(name, "kota");
    }
  } catch (err) {
    console.error("Reverse Geocode error:", err);
    return null;
  }
};

// Cari ID kota dari nama kabupaten
export const getLocationIdFromName = (lokasiNama, kotaList) => {
    return kotaList.find((kota) =>
      lokasiNama.toUpperCase() === kota.lokasi.toUpperCase()
    )?.id;
  };