/**
 * 전역 상태 관리
 */

import { LAYOUT, THEMES, STORAGE_KEYS } from "./constants.js";

// 음악 플레이어 상태
export const audioState = {
  audio: new Audio(),
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

// 배경 영상 상태
export const videoState = {
  video: null,
  isLoaded: false,
  isBlurred: true,
};

// 가사 상태
export const lyricsState = {
  data: [],
  mode: "korean",
  rawText: "",
  currentIndex: 2,
  lyricsElements: [],
};

// UI 상태
export const uiState = {
  layout: localStorage.getItem(STORAGE_KEYS.LAYOUT) || LAYOUT.TYPE_A,
  typebTheme:
    localStorage.getItem(STORAGE_KEYS.TYPEB_THEME) || THEMES.MIXED_DARK,
  isMenuVisible: false,
  isLoadingVisible: false,
};

// 글로벌 함수 노출 (기존 코드와의 호환성)
export function exposeGlobally() {
  // 다른 모듈에서 필요한 경우 처리
  window.audioState = audioState;
  window.videoState = videoState;
  window.lyricsState = lyricsState;
  window.uiState = uiState;
}

export default {
  audioState,
  videoState,
  lyricsState,
  uiState,
  exposeGlobally,
};
