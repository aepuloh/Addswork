const VIDEO = document.getElementById('adVideo');
const ERROR = document.getElementById('errorMsg');
const COUNTDOWN = document.getElementById('countdown');
const BALVAL = document.getElementById('balVal');

let countdown = 30;
let timer = null;
let currentAd = null;
const USER = 'demo';

function startCountdown() {
  clearInterval(timer);
  countdown = 30;
  COUNTDOWN.textContent = countdown;
  timer = setInterval(() => {
    countdown--;
    COUNTDOWN.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      fetchAd();
    }
  }, 1000);
}

async function fetchAd() {
  showError('');
  try {
    const res = await fetch(`/api/getAd?user=${USER}`);
    if (!res.ok) throw new Error('Gagal memuat iklan');
    const data = await res.json();
    currentAd = data;
    playAd(data.videoUrl);
  } catch (err) {
    console.error(err);
    showError('Terjadi kesalahan saat memuat iklan.');
    startCountdown();
  }
}

function playAd(url) {
  if(!url) { showError('Data iklan tidak tersedia'); startCountdown(); return; }
  VIDEO.src = url;
  VIDEO.load();
  VIDEO.onended = () => {
    claimReward();
  };
  VIDEO.onerror = () => {
    showError('Iklan tidak dapat diputar.');
    startCountdown();
  };
  VIDEO.play().catch(err => {
    console.warn('Play blocked', err);
    showError('Tekan tombol play pada video.');
  });
}

async function claimReward() {
  if(!currentAd) return;
  try {
    const res = await fetch('/api/claimReward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: USER, adId: currentAd.adId })
    });
    const data = await res.json();
    if (data && data.success) {
      showError('Berhasil klaim reward: +' + data.reward + ' KOT');
      await updateBalance();
    }
  } catch (err) {
    console.error(err);
  } finally {
    currentAd = null;
    startCountdown();
  }
}

async function updateBalance() {
  try {
    const res = await fetch(`/api/balance?user=${USER}`);
    if (!res.ok) return;
    const d = await res.json();
    BALVAL.textContent = d.balance || 0;
  } catch (err) {
    console.warn(err);
  }
}

function showError(msg) {
  if (!msg) { ERROR.style.display = 'none'; ERROR.textContent = ''; }
  else { ERROR.style.display = 'block'; ERROR.textContent = msg; }
}

// Jalankan otomatis saat halaman dibuka
updateBalance();
fetchAd();