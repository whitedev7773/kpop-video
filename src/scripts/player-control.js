// 상수
const ICON = {
  play:  "src/assets/icons/play.svg",
  pause: "src/assets/icons/pause.svg",
};
const SYNC_THRESHOLD = 0.25; // 초 단위 허용 오차

const audio = new Audio();

// Web Audio API - 스펙트럼 시각화용
let _audioCtx, _spectrumAnalyser;
function initAudioContext() {
  if (_audioCtx) {
    _audioCtx.resume();
    return;
  }
  _audioCtx = new AudioContext();
  _spectrumAnalyser = _audioCtx.createAnalyser();
  _spectrumAnalyser.fftSize = 2048;
  _spectrumAnalyser.smoothingTimeConstant = 0.8;
  const source = _audioCtx.createMediaElementSource(audio);
  source.connect(_spectrumAnalyser);
  _spectrumAnalyser.connect(_audioCtx.destination);
  window.spectrumAnalyser = _spectrumAnalyser;
}

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
    window.dispatchEvent(new CustomEvent("lyricsTimeUpdate", { detail: { currentTime: audio.currentTime } }));
    animationFrameId = requestAnimationFrame(updateProgress);
  }
}

// 1. Next 버튼: 파일 선택만 하고 재생은 하지 않음
nextBtn.addEventListener("click", () => musicInput.click());

function applyMusic(blob) {
  const url = URL.createObjectURL(blob);
  audio.pause();
  audio.src = url;
  audio.load();
  setPlayState(false);
  progressBarFill.style.width = "0%";
  currentTimeText.value = "00:00";
  cancelAnimationFrame(animationFrameId);
}

window.applyMusic = applyMusic;

musicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    window.showLoading('음악 파일 불러오는 중...');
    applyMusic(file);
    document.getElementById("musicTitle").value = file.name.replace(
      /\.[^/.]+$/,
      "",
    );
  }
});

// 2. Play 버튼: 실제 재생 및 일시정지 제어
playBtn.addEventListener("click", () => {
  if (!audio.src) {
    musicInput.click();
    return;
  }

  if (audio.paused) {
    initAudioContext();
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

// 메타데이터가 로드되면 총 시간 표시 및 로딩 종료
audio.addEventListener("loadedmetadata", () => {
  endTimeText.value = formatTime(audio.duration);
  window.hideLoading?.();
});

// 곡이 끝났을 때 처리
audio.addEventListener("ended", () => {
  setPlayState(false);
  cancelAnimationFrame(animationFrameId);
});

// 배경 영상 제어 관련 설정
const bgVideo = document.getElementById("bgVideo");
const bgVideoInput = document.getElementById("bgVideoInput");

window.openMusicInput = () => musicInput.click();
window.openVideoInput = () => bgVideoInput.click();

// 배경 (빈 공간) 더블클릭 시 영상 선택 창 열기
document.addEventListener("dblclick", (e) => {
  if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
  bgVideoInput.click();
});

function applyVideo(blob) {
  const url = URL.createObjectURL(blob);
  bgVideo.src = url;
  bgVideo.load();
  if (!audio.paused) bgVideo.play();
  bgVideo.currentTime = audio.currentTime;
}

window.applyVideo = applyVideo;

bgVideoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    window.showLoading('배경 영상 불러오는 중...');
    applyVideo(file);
    window.showToast?.('뒷배경 영상은 적용에 시간이 걸릴 수 있습니다.');
  }
});

bgVideo.addEventListener("loadedmetadata", () => {
  window.hideLoading?.();
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
