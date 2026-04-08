const dialog = document.getElementById("lyricsSetting");
const openBtn = document.getElementById("lyricsBox");
const saveLyricsBtn = document.getElementById("saveLyricsBtn");
const lyricsInput = document.getElementById("lyricsInput");
const lyricsBox = document.getElementById("lyricsBox");

openBtn.addEventListener("click", () => {
  // 다이얼로그 열기 전에 기존 가사를 텍스트에어리어에 채워넣기 (맨 앞의 빈 구조 태그 제외)
  const currentLyrics = Array.from(lyricsBox.querySelectorAll("p"))
    .filter(
      (p) =>
        !p.classList.contains("post-focus") && !p.classList.contains("focus"),
    )
    .map((p) => (p.textContent === "\u00A0" ? "" : p.textContent))
    .join("\n");
  lyricsInput.value = currentLyrics;

  // .show()는 일반 팝업, .showModal()은 배경이 어두워지는 모달입니다.
  dialog.showModal();
});

saveLyricsBtn.addEventListener("click", (e) => {
  // 다이얼로그 닫히기 전에 가사 렌더링 로직 실행
  e.preventDefault();

  // 이전 가사 초기화
  lyricsBox.innerHTML = "";

  // 맨 앞에 빈 p 3개 (post-focus 2개, focus 1개) 추가
  const createEmptyP = (className) => {
    const p = document.createElement("p");
    p.id = "lyrics";
    p.className = className;
    p.textContent = "\u00A0"; // 공백을 넣어 높이 유지
    lyricsBox.appendChild(p);
  };

  createEmptyP("post-focus");
  createEmptyP("post-focus");
  createEmptyP("focus");

  // 줄바꿈을 기준으로 분리
  const lines = lyricsInput.value.split("\n");

  // 각 줄마다 p 태그 생성 및 추가
  lines.forEach((line) => {
    // 빈 줄도 포함하려면 조건문 삭제 가능, 가사가 비웠을 땐 빈 여백(nbsp) 설정
    const p = document.createElement("p");
    p.id = "lyrics";
    p.textContent = line.trim() === "" ? "\u00A0" : line;
    lyricsBox.appendChild(p);
  });

  dialog.close();
});
