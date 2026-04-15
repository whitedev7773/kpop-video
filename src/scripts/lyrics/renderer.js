/**
 * 가사 DOM 렌더링
 */

import { elements } from "../core/dom-utils.js";
import { LYRICS_MODES } from "../core/constants.js";

/**
 * 가사 DOM 요소 생성
 */
export function createLyricElement(data, mode) {
  const div = document.createElement("div");
  div.className = "lyric-line";

  if (mode === LYRICS_MODES.KOREAN) {
    const p = document.createElement("p");
    p.className = "lyric-main";
    p.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p);
  } else if (mode === LYRICS_MODES.ENGLISH) {
    const p1 = document.createElement("p");
    p1.className = "lyric-main";
    p1.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.className = "lyric-sub";
    p2.textContent = data.lines[1] || "\u00A0";
    div.appendChild(p2);
  } else if (mode === LYRICS_MODES.JAPANESE) {
    const p1 = document.createElement("p");
    p1.className = "lyric-top";
    p1.textContent = data.lines[0] || "\u00A0";
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.className = "lyric-mid";
    p2.textContent = data.lines[1] || "\u00A0";
    div.appendChild(p2);

    const p3 = document.createElement("p");
    p3.className = "lyric-bottom";
    p3.textContent = data.lines[2] || "\u00A0";
    div.appendChild(p3);
  }

  return div;
}

/**
 * 가사 데이터를 DOM으로 렌더링
 */
export function renderLyrics(lyricsData, mode) {
  const fragment = document.createDocumentFragment();

  const emptyData = { part: null, lines: ["\u00A0", "\u00A0", "\u00A0"] };

  // 앞쪽 빈 줄 3개 (스크롤 버퍼)
  fragment.appendChild(createLyricElement(emptyData, mode));
  fragment.appendChild(createLyricElement(emptyData, mode));
  fragment.appendChild(createLyricElement(emptyData, mode));

  // 실제 가사
  for (const d of lyricsData) {
    fragment.appendChild(createLyricElement(d, mode));
  }

  // 뒤쪽 빈 줄 1개
  fragment.appendChild(createLyricElement(emptyData, mode));

  // 기존 가사 제거 후 새로운 가사 삽입
  elements.lyricsBox.innerHTML = "";
  elements.lyricsBox.appendChild(fragment);

  // 가사 모드 데이터 속성 설정
  elements.lyricsBox.dataset.mode = mode;
}

export function initialize() {
  // 초기 렌더링
}

export default {
  createLyricElement,
  renderLyrics,
  initialize,
};
