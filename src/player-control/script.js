const audio = new Audio();
const musicInput = document.createElement("input");
musicInput.type = "file";
musicInput.accept = "audio/*";

const nextBtn = document.querySelector(
  '.btn-medium img[alt="next"]',
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
    playIcon.src = "src/icon/play.svg";
    playIcon.alt = "play";
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
    playIcon.src = "src/icon/pause.svg";
    playIcon.alt = "pause";
    animationFrameId = requestAnimationFrame(updateProgress);
  } else {
    audio.pause();
    playIcon.src = "src/icon/play.svg";
    playIcon.alt = "play";
    cancelAnimationFrame(animationFrameId);
  }
});

// 메타데이터가 로드되면 총 시간 표시
audio.addEventListener("loadedmetadata", () => {
  endTimeText.value = formatTime(audio.duration);
});

// 곡이 끝났을 때 처리
audio.addEventListener("ended", () => {
  playIcon.src = "src/icon/play.svg";
  playIcon.alt = "play";
  cancelAnimationFrame(animationFrameId);
});

// 배경 영상 제어 관련 설정
const bgVideo = document.getElementById("bgVideo");
const bgVideoInput = document.getElementById("bgVideoInput");

// 배경 (빈 공간) 더블 클릭 시 영상 선택 창 열기
document.addEventListener("dblclick", (e) => {
  // 텍스트, 입력창, 버튼 등 이벤트 버블링에 의한 예외 요소 무시
  if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
  // 부모 중 다이얼로그나 노래 리스트 등이 있다면 조건 추가 가능. 일단 기본적인 입력요소 방지
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
  if (bgVideo.src) bgVideo.play();
});

audio.addEventListener("pause", () => {
  if (bgVideo.src) bgVideo.pause();
});

// 드래그래서 구간 이동 등 시간이 튀었을 때 (seeking 기능 추가 대비)
audio.addEventListener("seeked", () => {
  if (bgVideo.src) bgVideo.currentTime = audio.currentTime;
});

// 진행중 약간씩 어긋나는 시간 주기적 동기화
audio.addEventListener("timeupdate", () => {
  if (bgVideo.src && Math.abs(bgVideo.currentTime - audio.currentTime) > 0.25) {
    bgVideo.currentTime = audio.currentTime;
  }
});
