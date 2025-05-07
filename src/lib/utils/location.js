const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

export const reverseGeocode = async (lat, lon) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    // console.log("Geocode response:", data);
    if (data.status !== "OK" || !data.results[0]) throw new Error("Geocoding gagal");

    const components = data.results[0].address_components;
    const kabOrKota = components.find((comp) =>
      comp.types.includes("administrative_area_level_2")
    );

    const name = kabOrKota?.long_name ?? "";

    const isCity = /city/i.test(name);
    const isKabupaten = /kab\.?|kabupaten/i.test(name);

    if (isKabupaten) {
      return normalizeLocationName(name, "kabupaten");
    } else if (isCity) {
      return normalizeLocationName(name, "kota");
    } else {
      return normalizeLocationName(name, "kota");
    }
  } catch (err) {
    console.error("Reverse Geocode error:", err);
    return null;
  }
};

export const getLocationIdFromName = (lokasiNama, kotaList) => {
  return kotaList.find((kota) =>
    lokasiNama.toUpperCase() === kota.lokasi.toUpperCase()
  )?.id;
};
