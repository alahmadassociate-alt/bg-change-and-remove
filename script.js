const uploadInput = document.getElementById("uploadImage");
const inputImg = document.getElementById("inputImage");
const outputImg = document.getElementById("outputImage");
const themeToggle = document.getElementById("themeToggle");
const qualityRange = document.getElementById("qualityRange");
const qualityValue = document.getElementById("qualityValue");
let processedImage = null;

uploadInput.addEventListener("change", async () => {
  const file = uploadInput.files[0];
  if (!file) return;

  inputImg.src = URL.createObjectURL(file);

  const response = await fetch("/api/removebg", {
    method: "POST",
    body: file
  });

  const blob = await response.blob();
  processedImage = URL.createObjectURL(blob);
  outputImg.src = processedImage;
});

document.querySelectorAll(".color-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    outputImg.style.background = btn.dataset.color;
  });
});

document.getElementById("grad1").addEventListener("input", updateGradient);
document.getElementById("grad2").addEventListener("input", updateGradient);

function updateGradient() {
  const c1 = document.getElementById("grad1").value;
  const c2 = document.getElementById("grad2").value;
  outputImg.style.background = `linear-gradient(45deg, ${c1}, ${c2})`;
}

qualityRange.addEventListener("input", () => {
  qualityValue.textContent = `${qualityRange.value}%`;
});

function downloadImage(type) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = outputImg.naturalWidth;
  canvas.height = outputImg.naturalHeight;

  ctx.fillStyle = getComputedStyle(outputImg).backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(outputImg, 0, 0);

  const quality = qualityRange.value / 100;
  const link = document.createElement("a");
  link.download = `output.${type}`;
  link.href = canvas.toDataURL(`image/${type}`, quality);
  link.click();
}

document.getElementById("downloadPNG").addEventListener("click", () => {
  downloadImage("png");
});
document.getElementById("downloadJPG").addEventListener("click", () => {
  downloadImage("jpeg");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light ☀️";
  } else {
    themeToggle.textContent = "Dark 🌙";
  }
});
