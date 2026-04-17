/**
 * 가사 입력 다이얼로그 관리
 */

import { elements } from "../core/dom-utils.ts";
import { PLACEHOLDERS } from "../core/constants.ts";
import * as parser from "./parser.ts";
import * as renderer from "./renderer.ts";
import * as sync from "./sync.ts";

let lyricsData = [];
let lyricsMode = "korean";
let rawLyricsText = "";

/**
 * 가사 데이터 새로고침 캐시
 */
export function refreshLyricsCache() {
  const lyricsElements = Array.from(
    elements.lyricsBox.querySelectorAll(".lyric-line"),
  );
  return lyricsElements;
}

/**
 * 가사 적용
 */
export function applyLyrics(text, mode) {
  if (text !== undefined) rawLyricsText = text;
  if (mode !== undefined) lyricsMode = mode;

  lyricsData = parser.parseLyricsText(rawLyricsText, lyricsMode);
  renderer.renderLyrics(lyricsData, lyricsMode);

  // 캐시 새로고침 및 초기 상태 설정
  const lyricsElements = refreshLyricsCache();
  sync.setCurrentLyricIndex(2, lyricsData, lyricsElements);

  // 리스너 설정
  sync.setupKeyboardNavigation(lyricsData, lyricsElements);
  sync.setupTimeSyncListener(lyricsData, lyricsElements);
  sync.setupResetListener(lyricsData, lyricsElements);
}

/**
 * 가사 영역 클릭으로 편집 다이얼로그 열기
 */
function setupLyricsBoxClickListener() {
  if (elements.lyricsBox) {
    elements.lyricsBox.addEventListener("click", () => {
      const currentText =
        lyricsData.length > 0
          ? parser.lyricsDataToText(lyricsData, lyricsMode)
          : rawLyricsText;

      if (elements.lyricsInput) {
        elements.lyricsInput.value = currentText;
        elements.lyricsInput.placeholder = PLACEHOLDERS[lyricsMode];
      }

      // 모드 셀렉터 동기화
      const modeRadios = elements.modeSelector.querySelectorAll(
        'input[name="lyricsMode"]',
      );
      modeRadios.forEach((r) => {
        r.checked = r.value === lyricsMode;
        r.closest(".mode-option").classList.toggle(
          "active",
          r.value === lyricsMode,
        );
      });

      if (elements.lyricsDialog) {
        elements.lyricsDialog.showModal();
      }
    });
  }
}

/**
 * 모드 셀렉터 변경 이벤트
 */
function setupModeSelector() {
  if (elements.modeSelector) {
    elements.modeSelector.addEventListener("change", (e) => {
      if (e.target.name !== "lyricsMode") return;

      elements.modeSelector
        .querySelectorAll(".mode-option")
        .forEach((label) => {
          label.classList.toggle(
            "active",
            label.dataset.mode === e.target.value,
          );
        });

      if (elements.lyricsInput) {
        elements.lyricsInput.placeholder = PLACEHOLDERS[e.target.value];
      }
    });
  }
}

/**
 * 적용 버튼 클릭
 */
function setupSaveButton() {
  if (elements.saveLyricsBtn) {
    elements.saveLyricsBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const selectedMode =
        elements.modeSelector.querySelector('input[name="lyricsMode"]:checked')
          ?.value || lyricsMode;

      const textInput = elements.lyricsInput?.value || "";
      applyLyrics(textInput, selectedMode);

      if (elements.lyricsDialog) {
        elements.lyricsDialog.close();
      }
    });
  }
}

export function initialize() {
  setupLyricsBoxClickListener();
  setupModeSelector();
  setupSaveButton();

  // 글로벌 함수 노출
  window.applyLyrics = applyLyrics;
}

export default {
  applyLyrics,
  refreshLyricsCache,
  initialize,
};
