const spectrumCanvas = document.getElementById("spectrum");
const spectrumCtx = spectrumCanvas.getContext("2d");

const BAR_COUNT = 96;
let dataArray = null;
let bufferLength = 0;

function resizeSpectrum() {
  spectrumCanvas.width = window.innerWidth;
  spectrumCanvas.height = 100;
}
resizeSpectrum();
window.addEventListener("resize", resizeSpectrum);

function drawSpectrum() {
  requestAnimationFrame(drawSpectrum);

  const analyser = window.spectrumAnalyser;
  if (!analyser) {
    spectrumCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
    return;
  }

  if (!dataArray || bufferLength !== analyser.frequencyBinCount) {
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  analyser.getByteFrequencyData(dataArray);
  spectrumCtx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

  const slotWidth = spectrumCanvas.width / BAR_COUNT;
  const barWidth = slotWidth * 0.6;
  const offsetX = (slotWidth - barWidth) / 2;

  for (let i = 0; i < BAR_COUNT; i++) {
    // 저음~중음 영역(전체 주파수 빈의 70%)에 집중
    const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength * 0.7);
    const value = dataArray[dataIndex] / 255;
    const barHeight = Math.max(2, value * spectrumCanvas.height);

    const x = i * slotWidth + offsetX;
    const y = spectrumCanvas.height - barHeight;

    const opacity = 0.7 + value * 0.3;
    const grad = spectrumCtx.createLinearGradient(0, y, 0, spectrumCanvas.height);
    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.6})`);
    grad.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

    spectrumCtx.fillStyle = grad;
    spectrumCtx.beginPath();
    spectrumCtx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
    spectrumCtx.fill();
  }
}

drawSpectrum();
