import { formatTanggalIndonesia } from "../lib/utils/date";
import { toPascalCaseWilayah } from "../lib/utils/word";

export default function SholatCard({ jadwal }) {
  return (
    <div class="card shadow-sm rounded-5 mx-4">
      <div class="card-body">
        <h6 class="card-title">
          <i class="bi-calendar-week me-2"></i>
          {formatTanggalIndonesia(jadwal.jadwal.date)}
        </h6>
        <h6 class="card-title">
          <i class="bi-pin-map-fill me-2"></i>
          {toPascalCaseWilayah(jadwal.lokasi)}
        </h6>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Imsak {jadwal.jadwal.imsak}</li>
          <li class="list-group-item">Subuh {jadwal.jadwal.subuh}</li>
          <li class="list-group-item">Terbit {jadwal.jadwal.terbit}</li>
          <li class="list-group-item">Dhuha {jadwal.jadwal.dhuha}</li>
          <li class="list-group-item">Dzuhur {jadwal.jadwal.dzuhur}</li>
          <li class="list-group-item">Ashar {jadwal.jadwal.ashar}</li>
          <li class="list-group-item">Maghrib {jadwal.jadwal.maghrib}</li>
          <li class="list-group-item">Isya {jadwal.jadwal.isya}</li>
        </ul>
      </div>
    </div>
  );
}
