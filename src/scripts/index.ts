/**
 * 메인 진입점
 * 모든 모듈 초기화 및 로드
 */

// Core 모듈
import * as constants from "./core/constants.ts";
import * as state from "./core/state.ts";
import * as domUtils from "./core/dom-utils.ts";
import * as timeUtils from "./core/time-utils.ts";

// UI 모듈
import * as menu from "./ui/menu.ts";
import * as theme from "./ui/theme.ts";
import * as toastLoader from "./ui/toast-loader.ts";
import * as infoSync from "./ui/info-sync.ts";

// File Handling 모듈
import * as fileLoader from "./file-handling/file-loader.ts";
import * as zipProcessor from "./file-handling/zip-processor.ts";

// Media 모듈
import * as audioPlayer from "./media/audio-player.ts";
import * as videoPlayer from "./media/video-player.ts";
import * as playback from "./media/playback.ts";
import * as sync from "./media/sync.ts";

// Lyrics 모듈
import * as parser from "./lyrics/parser.ts";
import * as renderer from "./lyrics/renderer.ts";
import * as lyricsSync from "./lyrics/sync.ts";
import * as modeDetector from "./lyrics/mode-detector.ts";
import * as editor from "./lyrics/editor.ts";

// 전역 글로벌 함수 노출
import { formatTime } from "./core/time-utils.ts";
import { detectLyricsMode } from "./lyrics/mode-detector.ts";
// import { applyLyrics } from "./lyrics/editor.ts";
// import { applyMusic } from "./media/audio-player.ts";
// import { applyVideo } from "./media/video-player.ts";

/**
 * 모든 모듈 초기화
 */
function initializeApp() {
  console.log("🚀 KPOP Video 초기화 시작...");

  // 1. 전역 상태 및 유틸 노출
  domUtils.initializeElements();
  state.exposeGlobally();

  // 2. 글로벌 함수 노출 (기존 코드 호환성)
  window.formatTime = formatTime;
  window.detectLyricsMode = detectLyricsMode;
  window.showToast = toastLoader.showToast;
  window.showLoading = toastLoader.showLoading;
  window.updateLoading = toastLoader.updateLoading;
  window.hideLoading = toastLoader.hideLoading;

  // 3. 테마 초기화 (레이아웃, 테마 복원)
  theme.initialize();

  // 4. Toast/Loading 초기화
  toastLoader.initialize();

  // 5. UI 메뉴 초기화
  menu.initialize();

  // 6. 음악 정보 동기화 초기화
  infoSync.initialize();

  // 7. 미디어 플레이어 초기화
  audioPlayer.initialize();
  videoPlayer.initialize();
  playback.initialize();
  sync.initialize();

  // 8. 파일 로딩 및 ZIP 처리 초기화
  fileLoader.initialize();
  zipProcessor.initialize();

  // 9. 가사 관련 초기화
  editor.initialize();

  // 튜토리얼 초기화는 별도 스크립트에서 처리

  console.log("✅ KPOP Video 초기화 완료!");
}

/**
 * DOM 로드 완료 후 초기화
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// 글로벌 모듈 노출 (개발/디버깅용)
window.KPOPModules = {
  constants,
  state,
  domUtils,
  timeUtils,
  menu,
  theme,
  toastLoader,
  infoSync,
  fileLoader,
  zipProcessor,
  audioPlayer,
  videoPlayer,
  playback,
  sync,
  parser,
  renderer,
  lyricsSync,
  modeDetector,
  editor,
};

export default {
  initializeApp,
};
