const dialog = document.getElementById("lyricsSetting");
const openBtn = document.getElementById("lyricsBox");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");

openBtn.addEventListener("click", () => {
  // 다이얼로그 열기 전에 기존 가사를 텍스트에어리어에 채워넣기 (맨 앞의 빈 구조 태그 3개 제외)
  const currentLyrics = Array.from(lyricsBox.querySelectorAll("p"))
    .slice(3) // 첫 3개 요소(사용자가 입력하지 않은 기본 패딩 용도)를 제외
    .map((p) => (p.textContent === "\u00A0" ? "" : p.textContent))
    .join("\n");
  lyricsInput.value = currentLyrics;

  // .show()는 일반 팝업, .showModal()은 배경이 어두워지는 모달입니다.
  dialog.showModal();
});

let currentLyricIndex = 2;

function updateLyricsClasses() {
  const ps = Array.from(lyricsBox.querySelectorAll("p"));
  ps.forEach((p, i) => {
    if (i < currentLyricIndex - 2) p.className = "post";
    else if (i === currentLyricIndex - 2 || i === currentLyricIndex - 1)
      p.className = "post-focus";
    else if (i === currentLyricIndex) p.className = "focus";
    else if (i === currentLyricIndex + 1 || i === currentLyricIndex + 2)
      p.className = "pre-focus";
    else p.className = "pre";
  });
}

// 초기 로딩 시 클래스 업데이트
document.addEventListener("DOMContentLoaded", () => {
  updateLyricsClasses();
});

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  const ps = Array.from(lyricsBox.querySelectorAll("p"));
  if (e.key === "ArrowUp") {
    if (currentLyricIndex > 2) {
      currentLyricIndex--;
      updateLyricsClasses();
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    // 맨 마지막 줄이 focus 될 수 있도록 (더 이상 내려갈 수 없으면 멈춤)
    if (currentLyricIndex < ps.length - 1) {
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

  // 이전 가사 초기화
  lyricsBox.innerHTML = "";

  // 맨 앞에 빈 p 3개 추가 (초기엔 0, 1번이 post-focus, 2번이 focus)
  const createEmptyP = () => {
    const p = document.createElement("p");
    p.id = "lyrics";
    p.textContent = "\u00A0"; // 공백을 넣어 높이 유지
    lyricsBox.appendChild(p);
  };

  createEmptyP();
  createEmptyP();
  createEmptyP();

  // 줄바꿈을 기준으로 분리
  const lines = lyricsInput.value.split("\n");

  // 각 줄마다 p 태그 생성 및 추가
  lines.forEach((line) => {
    const p = document.createElement("p");
    p.id = "lyrics";
    p.textContent = line.trim() === "" ? "\u00A0" : line;
    lyricsBox.appendChild(p);
  });

  createEmptyP();

  currentLyricIndex = 2; // 새로운 가사 적용 시 첫 줄(인덱스 2)로 초기화
  updateLyricsClasses(); // 전체 클래스 업데이트

  dialog.close();
});
