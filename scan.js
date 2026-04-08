/* =========================
   🎫 Entrance Ticket Scan
   ========================= */

let mode = "scanner";     // scanner | camera
let locked = false;
let html5QrCode = null;

const input     = document.getElementById("scannerInput");
const result    = document.getElementById("result");
const modeHint  = document.getElementById("modeHint");
const video     = document.getElementById("video");
const okSound   = document.getElementById("okSound");
const failSound = document.getElementById("failSound");

/* ========= 模式切換 ========= */
function switchMode(newMode) {
  mode = newMode;
  locked = false;

  if (mode === "scanner") {
    modeHint.textContent = "🟢 模式：🔫 掃描器";
    stopCamera();
    resetUI();
    focusScanner();
  } else {
    modeHint.textContent = "🔵 模式：📷 相機";
    resetUI();
    startCamera();
  }
}

/* ========= 掃描器輸入（JMC M‑6D） ========= */
input.addEventListener("keydown", (e) => {
  if (mode !== "scanner") return;
  if (locked) return;

  if (e.key === "Enter") {
    const code = input.value.trim();
    input.value = "";
    if (code) verifyTicket(code);
  }
});

/* ========= 相機掃描 ========= */
function startCamera() {
  video.style.display = "block";
  html5QrCode = new Html5Qrcode("video");

  Html5Qrcode.getCameras().then((cameras) => {
    if (!cameras.length) {
      showError("找不到相機");
      return;
    }

    html5QrCode.start(
      cameras[0].id,
      { fps: 10, qrbox: 260 },
      (decodedText) => {
        if (!locked) verifyTicket(decodedText);
      }
    );
  });
}

function stopCamera() {
  video.style.display = "none";
  if (html5QrCode?.isScanning) {
    html5QrCode.stop();
  }
}

/* ========= 驗票核心（可接後端） ========= */
function verifyTicket(code) {
  locked = true;
  console.log("🎫 掃描內容：", code);

  // ✅ 示範：OK 開頭視為有效票
  const isValid = code.startsWith("OK");

  if (isValid) {
    showSuccess();
  } else {
    showFail();
  }

  // 入口驗票節奏（1.5 秒自動重置）
  setTimeout(() => {
    resetUI();
    locked = false;
    if (mode === "scanner") focusScanner();
  }, 1500);
}

/* ========= UI 狀態 ========= */
function showSuccess() {
  okSound.currentTime = 0;
  okSound.play();

  result.className = "success";
  result.textContent = "✅ 通過";
}

function showFail() {
  failSound.currentTime = 0;
  failSound.play();

  result.className = "error";
  result.textContent = "❌ 無效";
}

function showError(msg) {
  result.className = "error";
  result.textContent = "❌ " + msg;
}

function resetUI() {
  result.className = "waiting";
  result.textContent = "⏳ 請掃描票券";
}

/* ========= 輔助 ========= */
function focusScanner() {
  input.focus();
}

/* ========= 預設啟動 ========= */
switchMode("scanner");
