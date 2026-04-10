const dialog = document.getElementById("lyricsSetting");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");

// 가사 요소 캐시 — querySelectorAll을 매번 호출하지 않도록 유지
let lyricsElements = [];

// 시간 싱크 데이터: lyricsElements[3+i]에 대응하는 {time: number|null, text: string}
let lyricsData = [];
let timedMode = false; // 하나라도 timestamp가 있으면 true

function refreshLyricsCache() {
  lyricsElements = Array.from(lyricsBox.querySelectorAll("p"));
}

// "[mm:ss] 텍스트" 또는 "[mm:ss.ss] 텍스트" 파싱
function parseLyricLine(line) {
  const match = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d+))?\]\s*(.*)/);
  if (match) {
    const min = parseInt(match[1]);
    const sec = parseInt(match[2]);
    const ms = match[3] ? parseInt(match[3]) / Math.pow(10, match[3].length) : 0;
    return { time: min * 60 + sec + ms, text: match[4] };
  }
  return { time: null, text: line.trim() };
}

// 현재 오디오 시간에 맞는 lyric index 계산 (lyricsElements 기준)
function getLyricIndexAtTime(currentTime) {
  let newIndex = 2; // 기본값: 첫 padding 이전 (아무 가사도 아직 안 나온 상태)
  for (let i = 0; i < lyricsData.length; i++) {
    if (lyricsData[i].time !== null && lyricsData[i].time <= currentTime) {
      newIndex = i + 3; // 앞에 padding 3개 offset
    }
  }
  return newIndex;
}

lyricsBox.addEventListener("click", () => {
  // 다이얼로그 열기 전에 기존 가사를 텍스트에어리어에 채워넣기 (맨 앞의 빈 구조 태그 3개 제외)
  const currentLyrics = lyricsData
    .map((d) => {
      if (d.time === null) return d.text === "\u00A0" ? "" : d.text;
      const min = Math.floor(d.time / 60).toString().padStart(2, "0");
      const sec = Math.floor(d.time % 60).toString().padStart(2, "0");
      const frac = d.time % 1;
      const msStr = frac >= 0.005 ? "." + Math.round(frac * 100).toString().padStart(2, "0") : "";
      return `[${min}:${sec}${msStr}] ${d.text}`;
    })
    .join("\n");
  lyricsInput.value = currentLyrics;

  dialog.showModal();
});

let currentLyricIndex = 2;

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

// 초기 로딩 시 캐시 초기화 및 클래스 업데이트
document.addEventListener("DOMContentLoaded", () => {
  refreshLyricsCache();
  updateLyricsClasses();
});

// 재생 시간에 따른 자동 가사 전환
window.addEventListener("lyricsTimeUpdate", (e) => {
  if (!timedMode) return;
  const newIndex = getLyricIndexAtTime(e.detail.currentTime);
  if (newIndex !== currentLyricIndex) {
    currentLyricIndex = newIndex;
    updateLyricsClasses();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  // timed 모드에서는 화살표 키로 수동 조작하지 않음
  if (timedMode) return;

  if (e.key === "ArrowUp") {
    if (currentLyricIndex > 2) {
      currentLyricIndex--;
      updateLyricsClasses();
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    if (currentLyricIndex < lyricsElements.length - 1) {
      currentLyricIndex++;
      updateLyricsClasses();
    }
    e.preventDefault();
  }
});

// 처음으로 되돌릴 때 가사 위치 초기화 이벤트 리스너
window.addEventListener("resetLyrics", () => {
  currentLyricIndex = 2;
  updateLyricsClasses();
});

function applyLyrics(text) {
  const lines = text.split("\n");
  const parsed = lines.map(parseLyricLine);

  // 하나라도 timestamp가 있으면 timed 모드
  timedMode = parsed.some((d) => d.time !== null);

  // timestamp가 있는 경우 time 기준으로 정렬
  if (timedMode) {
    parsed.sort((a, b) => {
      if (a.time === null && b.time === null) return 0;
      if (a.time === null) return 1;
      if (b.time === null) return -1;
      return a.time - b.time;
    });
  }

  lyricsData = parsed;

  const fragment = document.createDocumentFragment();

  const addLine = (text) => {
    const p = document.createElement("p");
    p.className = "lyric-line";
    p.textContent = text || "\u00A0";
    fragment.appendChild(p);
  };

  // 맨 앞에 빈 p 3개 추가 (패딩)
  addLine("");
  addLine("");
  addLine("");

  parsed.forEach((d) => addLine(d.text));

  addLine("");

  lyricsBox.innerHTML = "";
  lyricsBox.appendChild(fragment);

  refreshLyricsCache();
  currentLyricIndex = 2;
  updateLyricsClasses();
}

window.applyLyrics = applyLyrics;

saveLyricsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  applyLyrics(lyricsInput.value);
  dialog.close();
});
