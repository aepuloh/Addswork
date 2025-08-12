let saldo = parseInt(localStorage.getItem("saldo") || 0);
document.getElementById("saldo").innerText = saldo + " KOT";

// Fungsi untuk mulai timer iklan
function mulaiTimerIklan() {
  setTimeout(() => {
    putarIklan();
  }, 30000); // 30 detik
}

function putarIklan() {
  let overlay = document.getElementById("overlay");
  let statusEl = document.getElementById("status");

  overlay.style.display = "flex";
  statusEl.innerText = "Iklan sedang diputar...";

  window.showGiga()
    .then(() => {
      // IKLAN SELESAI = REWARD
      saldo += 10;
      localStorage.setItem("saldo", saldo);
      document.getElementById("saldo").innerText = saldo + " KOT";
      statusEl.innerText = "✅ Reward 10 KOT diterima!";
      overlay.style.display = "none";

      // Mulai timer untuk iklan berikutnya
      mulaiTimerIklan();
    })
    .catch(e => {
      // IKLAN DI-SKIP ATAU ERROR
      console.warn("Iklan di-skip / gagal:", e);
      statusEl.innerText = "⚠️ Iklan dibatalkan.";
      overlay.style.display = "none";

      // Mulai timer untuk iklan berikutnya
      mulaiTimerIklan();
    });
}

// Mulai hitung 30 detik setelah halaman dibuka
document.addEventListener("DOMContentLoaded", mulaiTimerIklan);
