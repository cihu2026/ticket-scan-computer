let currentMode = "scanner";
let html5QrCode = null;

// ====== 模式切換 ======
function switchMode(mode) {
  currentMode = mode;

  if (mode === "scanner") {
    stopCamera();
    document.getElementById("scannerInput").focus();
  } else {
    startCamera();
  }
}

// ====== 掃描後統一處理 ======
function handleScanResult(code) {
  console.log("掃描成功：", code);
  alert("掃描成功：" + code);

  // TODO: 這裡接後端驗票 API
}

// ====== 掃描器模式（JMC M‑6D）=====
const input = document.getElementById("scannerInput");

input.addEventListener("keydown", (e) => {
  if (currentMode !== "scanner") return;

  if (e.key === "Enter") {
    const value = input.value.trim();
    if (value) {
      handleScanResult(value);
      input.value = "";
    }
  }
});

// ====== 相機掃描模式 ======
function startCamera() {
  const videoId = "video";
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode(videoId);
  }

  Html5Qrcode.getCameras().then((cameras) => {
    if (!cameras.length) {
      alert("找不到可用相機");
      return;
    }

    html5QrCode.start(
      cameras[0].id,
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        handleScanResult(decodedText);
        stopCamera();
      }
    );
  });
}

function stopCamera() {
  if (html5QrCode?.isScanning) {
    html5QrCode.stop();
  }
}
