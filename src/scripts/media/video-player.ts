/**
 * Video (배경 영상) 플레이어 관리
 */

import { elements } from "../core/dom-utils.ts";
import * as toastLoader from "../ui/toast-loader.ts";

/**
 * 배경 영상 파일 적용
 */
export function applyVideo(blob) {
  const url = URL.createObjectURL(blob);
  elements.bgVideo.src = url;

  // 이전 URL 정리 (메모리 누수 방지)
  if (elements.bgVideo.dataset.previousUrl) {
    URL.revokeObjectURL(elements.bgVideo.dataset.previousUrl);
  }
  elements.bgVideo.dataset.previousUrl = url;

  // 음악과 시간 동기화
  elements.bgVideo.currentTime = elements.audio.currentTime;

  // 음악이 재생 중이면 영상도 재생
  // (loadedmetadata 이벤트 후 자동 재생됨)
  if (!elements.audio.paused) {
    // 약간의 지연을 두고 재생 시도
    elements.bgVideo.play().catch(() => {
      // 자동재생 정책이 차단된 경우 무시
    });
  }
}

/**
 * 더블클릭으로 영상 선택 (배경 빈 공간)
 */
function setupDoubleClickListener() {
  document.addEventListener("dblclick", (e) => {
    if (["INPUT", "TEXTAREA", "BUTTON"].includes((e.target as Element).tagName)) return;
    elements.bgVideoInput.click();
  });
}

/**
 * 메타데이터 로드 완료
 */
function setupMetadataListener() {
  elements.bgVideo.addEventListener("loadedmetadata", () => {
    // 메타데이터 로드 완료 후 전체 영상 로드 진행도 표시 시작
    toastLoader.updateLoading("배경 영상 로딩 중... (메타데이터 로드 완료)", 5);
  });
}

/**
 * 영상 버퍼 진행 상황 추적
 */
function setupProgressListener() {
  elements.bgVideo.addEventListener("progress", () => {
    const buffered = elements.bgVideo.buffered;
    if (buffered.length > 0 && elements.bgVideo.duration > 0) {
      // 마지막 버퍼 범위의 끝 시점
      const bufferedEnd = buffered.end(buffered.length - 1);
      // 진행률 계산 (5% ~ 95%)
      const percent = Math.min(
        90,
        5 + (bufferedEnd / elements.bgVideo.duration) * 90,
      );
      toastLoader.updateLoading("배경 영상 로딩 중...", percent);
    }
  });

  // 영상 재생 가능할 때
  elements.bgVideo.addEventListener("canplay", () => {
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
  setupProgressListener();
  setupPlayPauseSync();
  setupSeekedListener();

  window.applyVideo = applyVideo;
  window.openVideoInput = () => elements.bgVideoInput.click();
}

export default {
  applyVideo,
  initialize,
};
