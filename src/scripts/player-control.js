// 상수
const ICON = {
  play:  "src/assets/icons/play.svg",
  pause: "src/assets/icons/pause.svg",
};
const SYNC_THRESHOLD = 0.25; // 초 단위 허용 오차

const audio = new Audio();
const musicInput = document.createElement("input");
musicInput.type = "file";
musicInput.accept = "audio/*";

const nextBtn = document.querySelector(
  '.btn-medium img[alt="next"]',
).parentElement;
const prevBtn = document.querySelector(
  '.btn-medium img[alt="previous"]',
).parentElement;
const playBtn = document.querySelector(".btn-large");
const playIcon = document.getElementById("play-pause");
const progressBarFill = document.getElementById("fill");
const currentTimeText = document.getElementById("currentTime");
const endTimeText = document.getElementById("endTime");

let animationFrameId;

// 시간 포맷 함수
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// 재생 상태에 따라 아이콘 전환
function setPlayState(playing) {
  playIcon.src = playing ? ICON.pause : ICON.play;
  playIcon.alt = playing ? "pause" : "play";
}

// 배경 영상 존재 여부 확인
const hasVideo = () => Boolean(bgVideo.src);

// 부드러운 업데이트 함수
function updateProgress() {
  if (!audio.paused && audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBarFill.style.width = `${progressPercent}%`;
    currentTimeText.value = formatTime(audio.currentTime);
    animationFrameId = requestAnimationFrame(updateProgress);
  }
}

// 1. Next 버튼: 파일 선택만 하고 재생은 하지 않음
nextBtn.addEventListener("click", () => musicInput.click());

musicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);

    // 오디오 초기화 (재생하지 않음)
    audio.pause();
    audio.src = url;
    audio.load(); // 메타데이터 로드 강제

    // UI 초기화
    setPlayState(false);
    progressBarFill.style.width = "0%";
    currentTimeText.value = "00:00";
    document.getElementById("musicTitle").value = file.name.replace(
      /\.[^/.]+$/,
      "",
    );

    cancelAnimationFrame(animationFrameId);
  }
});

// 2. Play 버튼: 실제 재생 및 일시정지 제어
playBtn.addEventListener("click", () => {
  if (!audio.src) {
    musicInput.click();
    return;
  }

  if (audio.paused) {
    audio.play();
    setPlayState(true);
    animationFrameId = requestAnimationFrame(updateProgress);
  } else {
    audio.pause();
    setPlayState(false);
    cancelAnimationFrame(animationFrameId);
  }
});

// 3. Previous 버튼: 미디어 0초로 되감기 및 가사 처음으로 이동 이벤트를 발생시킴
prevBtn.addEventListener("click", () => {
  if (audio.src) {
    audio.currentTime = 0;
    if (hasVideo()) bgVideo.currentTime = 0;
    updateProgress();
    // 가사를 처음으로 되돌리기 위한 커스텀 이벤트 호출
    window.dispatchEvent(new Event("resetLyrics"));
  }
});

// 메타데이터가 로드되면 총 시간 표시
audio.addEventListener("loadedmetadata", () => {
  endTimeText.value = formatTime(audio.duration);
});

// 곡이 끝났을 때 처리
audio.addEventListener("ended", () => {
  setPlayState(false);
  cancelAnimationFrame(animationFrameId);
});

// 배경 영상 제어 관련 설정
const bgVideo = document.getElementById("bgVideo");
const bgVideoInput = document.getElementById("bgVideoInput");

// 배경 (빈 공간) 더블 클릭 시 영상 선택 창 열기
document.addEventListener("dblclick", (e) => {
  // 텍스트, 입력창, 버튼 등 이벤트 버블링에 의한 예외 요소 무시
  if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
  bgVideoInput.click();
});

bgVideoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    bgVideo.src = url;
    bgVideo.load();

    // 현재 오디오의 재생 상태에 맞춰 바로 재생할지 여부 결정
    if (!audio.paused) {
      bgVideo.play();
    }
    bgVideo.currentTime = audio.currentTime;
  }
});

// 비디오와 오디오 동기화
audio.addEventListener("play", () => {
  if (hasVideo()) bgVideo.play();
});

audio.addEventListener("pause", () => {
  if (hasVideo()) bgVideo.pause();
});

// 드래그해서 구간 이동 등 시간이 튀었을 때 (seeking 기능 추가 대비)
audio.addEventListener("seeked", () => {
  if (hasVideo()) bgVideo.currentTime = audio.currentTime;
});

// 진행중 약간씩 어긋나는 시간 주기적 동기화
audio.addEventListener("timeupdate", () => {
  if (hasVideo() && Math.abs(bgVideo.currentTime - audio.currentTime) > SYNC_THRESHOLD) {
    bgVideo.currentTime = audio.currentTime;
  }
});

// 단축키 Tab: 배경 블러 토글
let isBlurred = true;
window.addEventListener("keydown", (e) => {
  // 텍스트, 입력창, 등에서는 단축키 동작 무시
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  if (e.key === "Tab") {
    e.preventDefault(); // 기본 Focus 이동(선택) 방지
    isBlurred = !isBlurred;
    bgVideo.style.filter = isBlurred ? `blur(${getComputedStyle(document.documentElement).getPropertyValue("--blur-amount").trim()})` : "blur(0px)";
  }
});
