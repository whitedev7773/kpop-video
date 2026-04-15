/**
 * Audio 플레이어 관리
 */

import { elements } from "../core/dom-utils.js";
import { ICON } from "../core/constants.js";
import * as toastLoader from "../ui/toast-loader.js";

/**
 * 재생 상태 설정
 */
export function setPlayState(playing) {
  if (elements.playIcon) {
    elements.playIcon.src = playing ? ICON.pause : ICON.play;
    elements.playIcon.alt = playing ? "pause" : "play";
  }
}

/**
 * 음악 파일 적용
 */
export function applyMusic(blob) {
  const url = URL.createObjectURL(blob);
  elements.audio.pause();
  elements.audio.src = url;
  elements.audio.load();
  setPlayState(false);

  if (elements.progressBarFill) {
    elements.progressBarFill.style.width = "0%";
  }
  if (elements.currentTimeText) {
    elements.currentTimeText.value = "00:00";
  }

  // 애니메이션 프레임 취소
  if (window.animationFrameId) {
    cancelAnimationFrame(window.animationFrameId);
  }
}

/**
 * 메타데이터 로드 완료
 */
function setupMetadataListener() {
  elements.audio.addEventListener("loadedmetadata", () => {
    if (elements.endTimeText) {
      // formatTime은 time-utils 사용 예정
      const minutes = Math.floor(elements.audio.duration / 60);
      const seconds = Math.floor(elements.audio.duration % 60);
      elements.endTimeText.value = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    toastLoader.hideLoading?.();
  });
}

/**
 * 곡 종료 처리
 */
function setupEndListener() {
  elements.audio.addEventListener("ended", () => {
    setPlayState(false);
    if (window.animationFrameId) {
      cancelAnimationFrame(window.animationFrameId);
    }
  });
}

export function initialize() {
  setupMetadataListener();
  setupEndListener();
  window.applyMusic = applyMusic;
}

export default {
  setPlayState,
  applyMusic,
  initialize,
};
