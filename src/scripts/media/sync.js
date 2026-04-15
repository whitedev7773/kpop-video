/**
 * 음악과 배경 영상 동기화
 */

import { elements } from "../core/dom-utils.js";
import { TIMING } from "../core/constants.js";

/**
 * 음/영상 시간 동기화
 */
export function syncAudioVideo() {
  if (!elements.bgVideo.src) return;

  // seeking 이벤트: 사용자가 진행률 바를 드래그할 때
  elements.audio.addEventListener("seeked", () => {
    elements.bgVideo.currentTime = elements.audio.currentTime;
  });

  // 음/영상이 약간씩 어긋날 때 주기적으로 동기화
  elements.audio.addEventListener("timeupdate", () => {
    if (
      Math.abs(elements.bgVideo.currentTime - elements.audio.currentTime) >
      TIMING.SYNC_THRESHOLD
    ) {
      elements.bgVideo.currentTime = elements.audio.currentTime;
    }
  });

  // 일시정지된 상태에서 영상도 일시정지되도록 유지
  elements.audio.addEventListener("pause", () => {
    if (elements.bgVideo.src) {
      elements.bgVideo.pause();
    }
  });
}

export function initialize() {
  syncAudioVideo();
}

export default {
  syncAudioVideo,
  initialize,
};
