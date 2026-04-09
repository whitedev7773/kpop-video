const dialog = document.getElementById("lyricsSetting");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");

// 가사 요소 캐시 — querySelectorAll을 매번 호출하지 않도록 유지
let lyricsElements = [];

function refreshLyricsCache() {
  lyricsElements = Array.from(lyricsBox.querySelectorAll("p"));
}

lyricsBox.addEventListener("click", () => {
  // 다이얼로그 열기 전에 기존 가사를 텍스트에어리어에 채워넣기 (맨 앞의 빈 구조 태그 3개 제외)
  const currentLyrics = lyricsElements
    .slice(3) // 첫 3개 요소(사용자가 입력하지 않은 기본 패딩 용도)를 제외
    .map((p) => (p.textContent === "\u00A0" ? "" : p.textContent))
    .join("\n");
  lyricsInput.value = currentLyrics;

  // .show()는 일반 팝업, .showModal()은 배경이 어두워지는 모달입니다.
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

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  if (e.key === "ArrowUp") {
    if (currentLyricIndex > 2) {
      currentLyricIndex--;
      updateLyricsClasses();
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    // 맨 마지막 줄이 focus 될 수 있도록 (더 이상 내려갈 수 없으면 멈춤)
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

saveLyricsBtn.addEventListener("click", (e) => {
  // 다이얼로그 닫히기 전에 가사 렌더링 로직 실행
  e.preventDefault();

  const fragment = document.createDocumentFragment();

  const addLine = (text) => {
    const p = document.createElement("p");
    p.className = "lyric-line";
    p.textContent = text || "\u00A0"; // 공백을 넣어 높이 유지
    fragment.appendChild(p);
  };

  // 맨 앞에 빈 p 3개 추가 (초기엔 0, 1번이 post-focus, 2번이 focus)
  addLine("");
  addLine("");
  addLine("");

  // 줄바꿈을 기준으로 분리 후 각 줄마다 p 태그 생성
  lyricsInput.value.split("\n").forEach((line) => addLine(line.trim()));

  addLine("");

  // 단 1회 DOM 삽입 (기존 innerHTML 초기화 + fragment 추가)
  lyricsBox.innerHTML = "";
  lyricsBox.appendChild(fragment);

  refreshLyricsCache();
  currentLyricIndex = 2; // 새로운 가사 적용 시 첫 줄(인덱스 2)로 초기화
  updateLyricsClasses();

  dialog.close();
});
