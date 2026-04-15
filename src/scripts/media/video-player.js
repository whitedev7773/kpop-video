/**
 * Video (배경 영상) 플레이어 관리
 */

import { elements } from "../core/dom-utils.js";
import * as toastLoader from "../ui/toast-loader.js";

/**
 * 배경 영상 파일 적용
 */
export function applyVideo(blob) {
  const url = URL.createObjectURL(blob);
  elements.bgVideo.src = url;
  elements.bgVideo.load();

  // 음악이 재생 중이면 영상도 재생
  if (!elements.audio.paused) {
    elements.bgVideo.play();
  }

  // 음악과 시간 동기화
  elements.bgVideo.currentTime = elements.audio.currentTime;
}

/**
 * 더블클릭으로 영상 선택 (배경 빈 공간)
 */
function setupDoubleClickListener() {
  document.addEventListener("dblclick", (e) => {
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
    elements.bgVideoInput.click();
  });
}

/**
 * 메타데이터 로드 완료
 */
function setupMetadataListener() {
  elements.bgVideo.addEventListener("loadedmetadata", () => {
    toastLoader.hideLoading?.();
  });
}

/**
 * 음악 재생/일시정지 시 영상도 제어
 */
function setupPlayPauseSync() {
  elements.audio.addEventListener("play", () => {
    if (elements.bgVideo.src) {
      elements.bgVideo.play();
    }
  });

  elements.audio.addEventListener("pause", () => {
    if (elements.bgVideo.src) {
      elements.bgVideo.pause();
    }
  });
}

/**
 * seeking 이벤트 (탐색)
 */
function setupSeekedListener() {
  elements.audio.addEventListener("seeked", () => {
    if (elements.bgVideo.src) {
      elements.bgVideo.currentTime = elements.audio.currentTime;
    }
  });
}

export function initialize() {
  setupDoubleClickListener();
  setupMetadataListener();
  setupPlayPauseSync();
  setupSeekedListener();

  window.applyVideo = applyVideo;
  window.openVideoInput = () => elements.bgVideoInput.click();
}

export default {
  applyVideo,
  initialize,
};
