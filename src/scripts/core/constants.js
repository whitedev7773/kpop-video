/**
 * 전역 상수 정의
 */

// 아이콘 경로
export const ICON = {
  play: "src/assets/icons/play.svg",
  pause: "src/assets/icons/pause.svg",
};

// 타이밍 상수 (밀리초)
export const TIMING = {
  SYNC_THRESHOLD: 0.25, // 음/영상 동기화 허용 오차 (초)
  TOAST_DURATION: 4000, // Toast 표시 시간
  PART_INDICATOR_TIMEOUT: 4500, // 파트 인디케이터 표시 시간
};

// 가사 모드
export const LYRICS_MODES = {
  KOREAN: "korean",
  ENGLISH: "english",
  JAPANESE: "japanese",
};

// 레이아웃 종류
export const LAYOUT = {
  TYPE_A: "typeA",
  TYPE_B: "typeB",
};

// TypeB 테마
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  MIXED_LIGHT: "mixed-light",
  MIXED_DARK: "mixed-dark",
};

// 플레이스홀더 텍스트
export const PLACEHOLDERS = {
  korean: "[1절 - 1] 첫 번째 가사\n두 번째 가사\n[1절 - 2] 세 번째 가사",
  english:
    "[1절 - 1] 한국어 가사\nEnglish lyrics\n\n한국어 가사 2\nEnglish lyrics 2",
  japanese:
    "[1절 - 1] 日本語歌詞\n코코니 니혼고\n한국어 가사\n\n日本語歌詞 2\n니혼고 2\n한국어 가사 2",
};

// LocalStorage 키
export const STORAGE_KEYS = {
  LAYOUT: "kpop-layout",
  TYPEB_THEME: "kpop-typeb-theme",
};

export default {
  ICON,
  TIMING,
  LYRICS_MODES,
  LAYOUT,
  THEMES,
  PLACEHOLDERS,
  STORAGE_KEYS,
};
