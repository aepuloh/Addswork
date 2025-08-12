let saldo = parseInt(localStorage.getItem("saldo") || 0);
document.getElementById("saldo").innerText = saldo + " KOT";

function putarIklan() {
  let overlay = document.getElementById("overlay");
  let statusEl = document.getElementById("status");

  overlay.style.display = "flex"; // tampilkan layar penuh
  statusEl.innerText = "Iklan sedang diputar...";

  window.showGiga()
    .then(() => {
      saldo += 10;
      localStorage.setItem("saldo", saldo);
      document.getElementById("saldo").innerText = saldo + " KOT";
      statusEl.innerText = "✅ Reward 10 KOT diterima!";
      overlay.style.display = "none"; // sembunyikan layar penuh
      setTimeout(putarIklan, 3000); // jeda 3 detik
    })
    .catch(e => {
      console.error("Gagal memuat iklan:", e);
      statusEl.innerText = "⚠️ Gagal memuat iklan, mencoba lagi...";
      overlay.style.display = "none"; // sembunyikan layar penuh walau gagal
      setTimeout(putarIklan, 5000); // coba lagi setelah 5 detik
    });
}

document.addEventListener("DOMContentLoaded", putarIklan);
