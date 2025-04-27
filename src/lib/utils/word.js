export function toPascalCaseWilayah(teks) {
    const kata = teks.toLowerCase().split(" ");
    return kata
        .map((word, index) => {
            // Jika ada awalan seperti KAB. atau KEC., maka tetap, tapi huruf awal kapital dan sisanya lowercase
            if (word.endsWith(".")) {
                return word[0].toUpperCase() + word.slice(1);
            }
            // Lainnya dibuat Pascal Case
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}
