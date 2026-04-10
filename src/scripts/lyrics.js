const dialog = document.getElementById("lyricsSetting");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");

// 가사 요소 캐시 — querySelectorAll을 매번 호출하지 않도록 유지
let lyricsElements = [];

// 가사 데이터: {part: string|null, text: string}
let lyricsData = [];

function refreshLyricsCache() {
  lyricsElements = Array.from(lyricsBox.querySelectorAll("p"));
}

// "[파트] 텍스트" 파싱 — 맨 앞의 [파트] 마커 선택적 지원
function parseLyricLine(line) {
  let part = null;
  let rest = line.trim();

  const partMatch = rest.match(/^\[([^\]]+)\]\s*/);
  if (partMatch) {
    part = partMatch[1];
    rest = rest.slice(partMatch[0].length);
  }

  return { part, text: rest };
}

lyricsBox.addEventListener("click", () => {
  const currentLyrics = lyricsData
    .map((d) => {
      let line = d.part ? `[${d.part}] ` : "";
      line += d.text === "\u00A0" ? "" : d.text;
      return line;
    })
    .join("\n");
  lyricsInput.value = currentLyrics;

  dialog.showModal();
});

let currentLyricIndex = 2;

// 파트 인디케이터
const partIndicatorEl = document.getElementById("partIndicator");
const partIndicatorTriangle = document.getElementById("partIndicator-triangle");
let partIndicatorTimeout = null;

function showPartIndicator(label) {
  partIndicatorEl.textContent = label;
  partIndicatorTriangle.classList.add("visible");
  clearTimeout(partIndicatorTimeout);
  partIndicatorTimeout = setTimeout(() => {
    partIndicatorTriangle.classList.remove("visible");
  }, 4500);
}

function updateLyricsClasses() {
  lyricsElements.forEach((p, i) => {
    if (i < currentLyricIndex - 2) p.className = "lyric-line post";
    else if (i === currentLyricIndex - 2 || i === currentLyricIndex - 1)
      p.className = "lyric-line post-focus";
    else if (i === currentLyricIndex) p.className = "lyric-line focus";
    else if (i === currentLyricIndex + 1 || i === currentLyricIndex + 2)
      p.className = "lyric-line pre-focus";
    else p.className = "lyric-line pre";
  });
}

function setCurrentLyricIndex(newIndex) {
  currentLyricIndex = newIndex;
  updateLyricsClasses();

  const dataIndex = newIndex - 3;
  if (
    dataIndex >= 0 &&
    dataIndex < lyricsData.length &&
    lyricsData[dataIndex].part
  ) {
    showPartIndicator(lyricsData[dataIndex].part);
  }
}

// 초기 로딩 시 캐시 초기화 및 클래스 업데이트
document.addEventListener("DOMContentLoaded", () => {
  refreshLyricsCache();
  updateLyricsClasses();
});

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if (e.key === "ArrowUp") {
    if (currentLyricIndex > 2) setCurrentLyricIndex(currentLyricIndex - 1);
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    if (currentLyricIndex < lyricsElements.length - 1)
      setCurrentLyricIndex(currentLyricIndex + 1);
    e.preventDefault();
  }
});

// 처음으로 되돌릴 때 가사 위치 초기화
window.addEventListener("resetLyrics", () => {
  setCurrentLyricIndex(2);
});

function applyLyrics(text) {
  lyricsData = text.split("\n").map(parseLyricLine);

  const fragment = document.createDocumentFragment();

  const addLine = (text) => {
    const p = document.createElement("p");
    p.className = "lyric-line";
    p.textContent = text || "\u00A0";
    fragment.appendChild(p);
  };

  addLine("");
  addLine("");
  addLine("");

  lyricsData.forEach((d) => addLine(d.text));

  addLine("");

  lyricsBox.innerHTML = "";
  lyricsBox.appendChild(fragment);

  refreshLyricsCache();
  setCurrentLyricIndex(2);
}

window.applyLyrics = applyLyrics;

saveLyricsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  applyLyrics(lyricsInput.value);
  dialog.close();
});
