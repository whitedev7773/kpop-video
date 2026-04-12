const dialog = document.getElementById("lyricsSetting");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");
const modeSelector = document.getElementById("lyricsModeSelector");

// 가사 요소 캐시 — querySelectorAll을 매번 호출하지 않도록 유지
let lyricsElements = [];

// 가사 데이터: {part: string|null, lines: string[]}
let lyricsData = [];

// 가사 모드: 'korean' | 'english' | 'japanese'
let lyricsMode = "korean";

// 원본 텍스트 보관 (편집 시 복원용)
let rawLyricsText = "";

const PLACEHOLDERS = {
  korean:
    "[1절 - 1] 첫 번째 가사\n두 번째 가사\n[1절 - 2] 세 번째 가사",
  english:
    "[1절 - 1] 한국어 가사\nEnglish lyrics\n\n한국어 가사 2\nEnglish lyrics 2",
  japanese:
    "[1절 - 1] 日本語歌詞\n코코니 니혼고\n한국어 가사\n\n日本語歌詞 2\n니혼고 2\n한국어 가사 2",
};

function refreshLyricsCache() {
  lyricsElements = Array.from(lyricsBox.querySelectorAll(".lyric-line"));
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

// 모드에 따라 텍스트를 파싱하여 lyricsData 배열 생성
function parseLyricsText(text, mode) {
  const rawLines = text.split("\n");
  const data = [];

  if (mode === "korean") {
    // 한줄구분: 각 줄이 하나의 가사
    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const { part, text: lyricText } = parseLyricLine(trimmed);
      data.push({ part, lines: [lyricText || "\u00A0"] });
    }
  } else {
    // 두줄/세줄구분: 빈 줄로 그룹 구분
    const linesPerGroup = mode === "english" ? 2 : 3;
    const groups = [];
    let currentGroup = [];

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(trimmed);
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);

    for (const group of groups) {
      let part = null;
      const { part: p, text: firstText } = parseLyricLine(group[0]);
      if (p) {
        part = p;
        group[0] = firstText;
      }

      // "."만 있는 줄은 공백 처리
      for (let i = 0; i < group.length; i++) {
        if (group[i] === ".") group[i] = "\u00A0";
      }

      // 그룹 크기를 맞춤
      while (group.length < linesPerGroup) group.push("\u00A0");

      data.push({ part, lines: group.slice(0, linesPerGroup) });
    }
  }

  return data;
}

// lyricsData → 편집용 텍스트 복원
function lyricsDataToText(data, mode) {
  if (mode === "korean") {
    return data
      .map((d) => {
        let line = d.part ? `[${d.part}] ` : "";
        line += d.lines[0] === "\u00A0" ? "" : d.lines[0];
        return line;
      })
      .join("\n");
  }

  return data
    .map((d) => {
      let firstLine = d.part ? `[${d.part}] ` : "";
      firstLine += d.lines[0] === "\u00A0" ? "." : d.lines[0];
      const otherLines = d.lines
        .slice(1)
        .map((l) => (l === "\u00A0" ? "." : l));
      return [firstLine, ...otherLines].join("\n");
    })
    .join("\n\n");
}

// ZIP 텍스트에서 가사 모드 자동 감지
function detectLyricsMode(text) {
  const lines = text.split("\n");
  const groups = [];
  let currentGroup = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup.length);
        currentGroup = [];
      }
    } else {
      currentGroup.push(line);
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup.length);

  if (groups.length === 0) return "korean";

  const avg = groups.reduce((a, b) => a + b, 0) / groups.length;
  if (avg >= 2.5) return "japanese";
  if (avg >= 1.5) return "english";
  return "korean";
}

window.detectLyricsMode = detectLyricsMode;

// 가사 영역 클릭 시 편집 다이얼로그 열기
lyricsBox.addEventListener("click", () => {
  const currentText =
    lyricsData.length > 0 ? lyricsDataToText(lyricsData, lyricsMode) : rawLyricsText;
  lyricsInput.value = currentText;
  lyricsInput.placeholder = PLACEHOLDERS[lyricsMode];

  // 모드 셀렉터 동기화
  const modeRadios = modeSelector.querySelectorAll('input[name="lyricsMode"]');
  modeRadios.forEach((r) => {
    r.checked = r.value === lyricsMode;
    r.closest(".mode-option").classList.toggle("active", r.value === lyricsMode);
  });

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
  lyricsElements.forEach((el, i) => {
    if (i < currentLyricIndex - 2) el.className = "lyric-line post";
    else if (i === currentLyricIndex - 2 || i === currentLyricIndex - 1)
      el.className = "lyric-line post-focus";
    else if (i === currentLyricIndex) el.className = "lyric-line focus";
    else if (i === currentLyricIndex + 1 || i === currentLyricIndex + 2)
      el.className = "lyric-line pre-focus";
    else el.className = "lyric-line pre";
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

// 가사 DOM 요소 생성
function createLyricElement(data, mode) {
  const div = document.createElement("div");
  div.className = "lyric-line";

  if (mode === "korean") {
    const p = document.createElement("p");
    p.className = "lyric-main";
    p.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p);
  } else if (mode === "english") {
    const p1 = document.createElement("p");
    p1.className = "lyric-main";
    p1.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.className = "lyric-sub";
    p2.textContent = data.lines[1] || "\u00A0";
    div.appendChild(p2);
  } else if (mode === "japanese") {
    const p1 = document.createElement("p");
    p1.className = "lyric-top";
    p1.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.className = "lyric-mid";
    p2.textContent = data.lines[1] || "\u00A0";
    div.appendChild(p2);

    const p3 = document.createElement("p");
    p3.className = "lyric-bottom";
    p3.textContent = data.lines[2] || "\u00A0";
    div.appendChild(p3);
  }

  return div;
}

function applyLyrics(text, mode) {
  if (text !== undefined) rawLyricsText = text;
  if (mode !== undefined) lyricsMode = mode;

  lyricsData = parseLyricsText(rawLyricsText, lyricsMode);
  lyricsBox.dataset.mode = lyricsMode;

  const fragment = document.createDocumentFragment();

  const emptyData = { part: null, lines: ["\u00A0", "\u00A0", "\u00A0"] };

  // 앞쪽 빈 줄 3개 (스크롤 버퍼)
  fragment.appendChild(createLyricElement(emptyData, lyricsMode));
  fragment.appendChild(createLyricElement(emptyData, lyricsMode));
  fragment.appendChild(createLyricElement(emptyData, lyricsMode));

  for (const d of lyricsData) {
    fragment.appendChild(createLyricElement(d, lyricsMode));
  }

  // 뒤쪽 빈 줄 1개
  fragment.appendChild(createLyricElement(emptyData, lyricsMode));

  lyricsBox.innerHTML = "";
  lyricsBox.appendChild(fragment);

  refreshLyricsCache();
  setCurrentLyricIndex(2);
}

window.applyLyrics = applyLyrics;

// 모드 셀렉터 이벤트
modeSelector.addEventListener("change", (e) => {
  if (e.target.name !== "lyricsMode") return;

  modeSelector.querySelectorAll(".mode-option").forEach((label) => {
    label.classList.toggle("active", label.dataset.mode === e.target.value);
  });

  lyricsInput.placeholder = PLACEHOLDERS[e.target.value];
});

// 적용 버튼
saveLyricsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const selectedMode = modeSelector.querySelector(
    'input[name="lyricsMode"]:checked',
  ).value;
  applyLyrics(lyricsInput.value, selectedMode);
  dialog.close();
});
