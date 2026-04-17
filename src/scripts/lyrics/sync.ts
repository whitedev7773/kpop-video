/**
 * 가사 타이밍 싱크 및 표시 관리
 */

import { elements } from "../core/dom-utils.ts";
import { TIMING } from "../core/constants.ts";

let currentLyricIndex = 2;
let partIndicatorTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * 파트 인디케이터 표시
 */
export function showPartIndicator(label) {
  if (elements.partIndicator) {
    elements.partIndicator.textContent = label;
  }
  if (elements.partIndicatorTriangle) {
    elements.partIndicatorTriangle.classList.add("visible");
  }

  clearTimeout(partIndicatorTimeout ?? undefined);
  partIndicatorTimeout = setTimeout(() => {
    if (elements.partIndicatorTriangle) {
      elements.partIndicatorTriangle.classList.remove("visible");
    }
  }, TIMING.PART_INDICATOR_TIMEOUT);
}

/**
 * 가사 요소의 클래스 업데이트
 * (focus, pre-focus, post-focus, pre, post 상태 설정)
 */
export function updateLyricsClasses(lyricsElements) {
  lyricsElements.forEach((el, i) => {
    let className = "lyric-line";

    if (i < currentLyricIndex - 2) {
      className += " post";
    } else if (i === currentLyricIndex - 2 || i === currentLyricIndex - 1) {
      className += " post-focus";
    } else if (i === currentLyricIndex) {
      className += " focus";
    } else if (i === currentLyricIndex + 1 || i === currentLyricIndex + 2) {
      className += " pre-focus";
    } else {
      className += " pre";
    }

    el.className = className;
  });
}

/**
 * 현재 가사 인덱스 설정
 */
export function setCurrentLyricIndex(newIndex, lyricsData, lyricsElements) {
  currentLyricIndex = newIndex;
  updateLyricsClasses(lyricsElements);

  // 파트 인디케이터 표시
  const dataIndex = newIndex - 3;
  if (
    dataIndex >= 0 &&
    dataIndex < lyricsData.length &&
    lyricsData[dataIndex].part
  ) {
    showPartIndicator(lyricsData[dataIndex].part);
  }
}

/**
 * 화살표 키로 가사 수동 이동
 */
export function setupKeyboardNavigation(lyricsData, lyricsElements) {
  window.addEventListener("keydown", (e) => {
    if ((e.target as Element).tagName === "INPUT" || (e.target as Element).tagName === "TEXTAREA") return;

    if (e.key === "ArrowUp") {
      if (currentLyricIndex > 2) {
        setCurrentLyricIndex(currentLyricIndex - 1, lyricsData, lyricsElements);
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (currentLyricIndex < lyricsElements.length - 1) {
        setCurrentLyricIndex(currentLyricIndex + 1, lyricsData, lyricsElements);
      }
      e.preventDefault();
    }
  });
}

/**
 * 시간 업데이트 시 가사 동기화
 */
export function setupTimeSyncListener(_lyricsData: any, _lyricsElements: any) {
  window.addEventListener("lyricsTimeUpdate", (e) => {
    const currentTime = (e as any).detail.currentTime; void currentTime;

    // 현재 시간에 맞는 가사 인덱스 계산 (간단한 구현)
    // 실제로는 타임스탬프 기반 동기화가 필요할 수 있음
    // 여기서는 기본 구현만 제공
  });
}

/**
 * 리셋 이벤트: 처음으로 가사 되돌리기
 */
export function setupResetListener(lyricsData, lyricsElements) {
  window.addEventListener("resetLyrics", () => {
    setCurrentLyricIndex(2, lyricsData, lyricsElements);
  });
}

/**
 * 뷰포트 가운데에 현재 가사 스크롤
 */
export function autoScrollToCenter(lyricsElements) {
  if (lyricsElements.length > 0) {
    const focusElement = lyricsElements[currentLyricIndex];
    if (focusElement) {
      focusElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

export function initialize() {
  // 초기 캐시 및 리스너 설정은 editor에서 처리
}

export default {
  showPartIndicator,
  updateLyricsClasses,
  setCurrentLyricIndex,
  setupKeyboardNavigation,
  setupTimeSyncListener,
  setupResetListener,
  autoScrollToCenter,
  initialize,
};
