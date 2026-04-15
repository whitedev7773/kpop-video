/**
 * DOM 유틸리티 함수 모음
 */

// DOM 요소 캐시
export const elements = {
  // 미디어
  audio: null,
  bgVideo: null,
  bgOverlay: null,
  bgVideoInput: null,

  // 파일 입력
  albumArtInput: null,
  musicInput: null,
  zipInput: null,

  // 플레이어
  playBtn: null,
  nextBtn: null,
  prevBtn: null,
  playIcon: null,
  progressBarFill: null,
  currentTimeText: null,
  endTimeText: null,

  // 앨범 아트
  albumArtButton: null,

  // 음악 정보
  musicTitle: null,
  artistName: null,

  // 가사
  lyricsBox: null,
  lyricsInput: null,
  lyricsDialog: null,
  modeSelector: null,
  saveLyricsBtn: null,
  partIndicator: null,
  partIndicatorTriangle: null,
  selectLyricsLangDialog: null,

  // UI
  toast: null,
  loadingDialog: null,
  loadingMessage: null,
  loadingProgressFill: null,
  albumArtMenu: null,

  // 튜토리얼
  tutorialDialog: null,
};

/**
 * 모든 DOM 요소 초기화
 */
export function initializeElements() {
  // 미디어
  elements.bgVideo = document.getElementById("bgVideo");
  elements.bgOverlay = document.getElementById("bgOverlay");
  elements.bgVideoInput = document.getElementById("bgVideoInput");
  elements.audio = new Audio();
  elements.musicInput = document.createElement("input");
  elements.musicInput.type = "file";
  elements.musicInput.accept = "audio/*";

  // 파일 입력
  elements.albumArtInput = document.getElementById("albumArtInput");
  elements.zipInput = document.getElementById("zipInput");

  // 플레이어
  elements.playBtn = document.querySelector(".btn-large");
  elements.nextBtn = document.querySelector(
    '.btn-medium img[alt="next"]',
  )?.parentElement;
  elements.prevBtn = document.querySelector(
    '.btn-medium img[alt="previous"]',
  )?.parentElement;
  elements.playIcon = document.getElementById("play-pause");
  elements.progressBarFill = document.getElementById("fill");
  elements.currentTimeText = document.getElementById("currentTime");
  elements.endTimeText = document.getElementById("endTime");

  // 앨범 아트
  elements.albumArtButton = document.getElementById("albumArtButton");

  // 음악 정보
  elements.musicTitle = document.getElementById("musicTitle");
  elements.artistName = document.getElementById("artistName");

  // 가사
  elements.lyricsBox = document.getElementById("lyricsBox");
  elements.lyricsInput = document.getElementById("lyricsInput");
  elements.lyricsDialog = document.getElementById("lyricsSetting");
  elements.modeSelector = document.getElementById("lyricsModeSelector");
  elements.saveLyricsBtn = document.getElementById("saveLyricsBtn");
  elements.partIndicator = document.getElementById("partIndicator");
  elements.partIndicatorTriangle = document.getElementById(
    "partIndicator-triangle",
  );
  elements.selectLyricsLangDialog = document.getElementById(
    "selectLyricsLangDialog",
  );

  // UI
  elements.toast = document.getElementById("toast");
  elements.loadingDialog = document.getElementById("loadingDialog");
  elements.loadingMessage = document.getElementById("loadingMessage");
  elements.loadingProgressFill = document.getElementById("loadingProgressFill");
  elements.albumArtMenu = document.getElementById("albumArtMenu");

  // 튜토리얼
  elements.tutorialDialog = document.getElementById("tutorialDialog");
}

/**
 * 요소 쿼리 헬퍼
 */
export function q(selector) {
  return document.querySelector(selector);
}

export function qa(selector) {
  return document.querySelectorAll(selector);
}

export function qid(id) {
  return document.getElementById(id);
}

/**
 * 이벤트 리스너 헬퍼
 */
export function on(element, event, handler, options = {}) {
  if (element) {
    element.addEventListener(event, handler, options);
  }
}

export function off(element, event, handler) {
  if (element) {
    element.removeEventListener(event, handler);
  }
}

/**
 * 클래스 관리 헬퍼
 */
export function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

export function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

export function toggleClass(element, className, force) {
  if (element) {
    element.classList.toggle(className, force);
  }
}

export function hasClass(element, className) {
  return element?.classList.contains(className) ?? false;
}

/**
 * 스타일 관리 헬퍼
 */
export function setStyle(element, property, value) {
  if (element) {
    element.style[property] = value;
  }
}

export function getStyle(element, property) {
  return element ? element.style[property] : null;
}

export function getComputedStyle(element, property) {
  return element
    ? window.getComputedStyle(element).getPropertyValue(property)
    : null;
}

/**
 * 텍스트 관리 헬퍼
 */
export function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

export function getText(element) {
  return element?.textContent ?? "";
}

/**
 * 속성 관리 헬퍼
 */
export function setData(element, key, value) {
  if (element) {
    element.dataset[key] = value;
  }
}

export function getData(element, key) {
  return element?.dataset[key] ?? null;
}

export default {
  elements,
  initializeElements,
  q,
  qa,
  qid,
  on,
  off,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  setStyle,
  getStyle,
  getComputedStyle,
  setText,
  getText,
  setData,
  getData,
};
