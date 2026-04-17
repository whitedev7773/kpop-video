/**
 * DOM 유틸리티 함수 모음
 */

// DOM 요소 캐시
export interface Elements {
  audio: HTMLAudioElement;
  bgVideo: HTMLVideoElement;
  bgOverlay: HTMLElement;
  bgVideoInput: HTMLInputElement;
  albumArtInput: HTMLInputElement;
  musicInput: HTMLInputElement;
  zipInput: HTMLInputElement;
  playBtn: HTMLElement;
  nextBtn: HTMLElement;
  prevBtn: HTMLElement;
  playIcon: HTMLImageElement;
  progressBarFill: HTMLElement;
  currentTimeText: HTMLInputElement;
  endTimeText: HTMLInputElement;
  albumArtButton: HTMLElement;
  musicTitle: HTMLInputElement;
  artistName: HTMLInputElement;
  lyricsBox: HTMLElement;
  lyricsInput: HTMLTextAreaElement;
  lyricsDialog: HTMLDialogElement;
  modeSelector: HTMLElement;
  saveLyricsBtn: HTMLElement;
  partIndicator: HTMLElement;
  partIndicatorTriangle: HTMLElement;
  selectLyricsLangDialog: HTMLDialogElement;
  toast: HTMLElement;
  loadingDialog: HTMLDialogElement;
  loadingMessage: HTMLElement;
  loadingProgressFill: HTMLElement;
  albumArtMenu: HTMLElement;
  tutorialDialog: HTMLDialogElement;
}

export const elements: Elements = {} as Elements;

/**
 * 모든 DOM 요소 초기화
 */
export function initializeElements() {
  // 미디어
  elements.bgVideo = document.getElementById('bgVideo') as HTMLVideoElement;
  elements.bgOverlay = document.getElementById('bgOverlay') as HTMLElement;
  elements.bgVideoInput = document.getElementById(
    'bgVideoInput'
  ) as HTMLInputElement;
  elements.audio = new Audio();
  elements.musicInput = document.createElement('input');
  elements.musicInput.type = 'file';
  elements.musicInput.accept = 'audio/*';

  // 파일 입력
  elements.albumArtInput = document.getElementById(
    'albumArtInput'
  ) as HTMLInputElement;
  elements.zipInput = document.getElementById('zipInput') as HTMLInputElement;

  // 플레이어
  elements.playBtn = document.querySelector('.btn-large') as HTMLElement;
  elements.nextBtn = document.querySelector('.btn-medium img[alt="next"]')
    ?.parentElement as HTMLElement;
  elements.prevBtn = document.querySelector('.btn-medium img[alt="previous"]')
    ?.parentElement as HTMLElement;
  elements.playIcon = document.getElementById('play-pause') as HTMLImageElement;
  elements.progressBarFill = document.getElementById('fill') as HTMLElement;
  elements.currentTimeText = document.getElementById(
    'currentTime'
  ) as HTMLInputElement;
  elements.endTimeText = document.getElementById('endTime') as HTMLInputElement;

  // 앨범 아트
  elements.albumArtButton = document.getElementById(
    'albumArtButton'
  ) as HTMLElement;

  // 음악 정보
  elements.musicTitle = document.getElementById(
    'musicTitle'
  ) as HTMLInputElement;
  elements.artistName = document.getElementById(
    'artistName'
  ) as HTMLInputElement;

  // 가사
  elements.lyricsBox = document.getElementById('lyricsBox') as HTMLElement;
  elements.lyricsInput = document.getElementById(
    'lyricsInput'
  ) as HTMLTextAreaElement;
  elements.lyricsDialog = document.getElementById(
    'lyricsSetting'
  ) as HTMLDialogElement;
  elements.modeSelector = document.getElementById(
    'lyricsModeSelector'
  ) as HTMLElement;
  elements.saveLyricsBtn = document.getElementById(
    'saveLyricsBtn'
  ) as HTMLElement;
  elements.partIndicator = document.getElementById(
    'partIndicator'
  ) as HTMLElement;
  elements.partIndicatorTriangle = document.getElementById(
    'partIndicator-triangle'
  ) as HTMLElement;
  elements.selectLyricsLangDialog = document.getElementById(
    'selectLyricsLangDialog'
  ) as HTMLDialogElement;

  // UI
  elements.toast = document.getElementById('toast') as HTMLElement;
  elements.loadingDialog = document.getElementById(
    'loadingDialog'
  ) as HTMLDialogElement;
  elements.loadingMessage = document.getElementById(
    'loadingMessage'
  ) as HTMLElement;
  elements.loadingProgressFill = document.getElementById(
    'loadingProgressFill'
  ) as HTMLElement;
  elements.albumArtMenu = document.getElementById(
    'albumArtMenu'
  ) as HTMLElement;

  // 튜토리얼
  elements.tutorialDialog = document.getElementById(
    'tutorialDialog'
  ) as HTMLDialogElement;
}

/**
 * 요소 쿼리 헬퍼
 */
export function q(selector: string): Element | null {
  return document.querySelector(selector);
}

export function qa(selector: string): NodeListOf<Element> {
  return document.querySelectorAll(selector);
}

export function qid(id: string): HTMLElement | null {
  return document.getElementById(id);
}

/**
 * 이벤트 리스너 헬퍼
 */
export function on(
  element: EventTarget | null,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions = {}
) {
  if (element) {
    element.addEventListener(event, handler, options);
  }
}

export function off(
  element: EventTarget | null,
  event: string,
  handler: EventListenerOrEventListenerObject
) {
  if (element) {
    element.removeEventListener(event, handler);
  }
}

/**
 * 클래스 관리 헬퍼
 */
export function addClass(element: Element | null, className: string) {
  if (element) {
    element.classList.add(className);
  }
}

export function removeClass(element: Element | null, className: string) {
  if (element) {
    element.classList.remove(className);
  }
}

export function toggleClass(
  element: Element | null,
  className: string,
  force?: boolean
) {
  if (element) {
    element.classList.toggle(className, force);
  }
}

export function hasClass(element: Element | null, className: string): boolean {
  return element?.classList.contains(className) ?? false;
}

/**
 * 스타일 관리 헬퍼
 */
export function setStyle(
  element: HTMLElement | null,
  property: any,
  value: string
) {
  if (element) {
    element.style[property] = value;
  }
}

export function getStyle(
  element: HTMLElement | null,
  property: any
): string | null {
  return element ? element.style[property] : null;
}

export function getComputedStyle(
  element: Element | null,
  property: string
): string | null {
  return element
    ? window.getComputedStyle(element).getPropertyValue(property)
    : null;
}

/**
 * 텍스트 관리 헬퍼
 */
export function setText(element: Node | null, text: string) {
  if (element) {
    element.textContent = text;
  }
}

export function getText(element: Node | null): string {
  return element?.textContent ?? '';
}

/**
 * 속성 관리 헬퍼
 */
export function setData(
  element: HTMLElement | null,
  key: string,
  value: string
) {
  if (element) {
    element.dataset[key] = value;
  }
}

export function getData(
  element: HTMLElement | null,
  key: string
): string | null {
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
