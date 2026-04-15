/**
 * 가사 언어 모드 자동 감지
 */

import { LYRICS_MODES } from "../core/constants.js";

/**
 * 텍스트에서 가사 모드 자동 감지
 * 그룹의 평균 줄 수로 판단
 */
export function detectLyricsMode(text) {
  const lines = text.split("\n");
  const groups = [];
  let currentGroup = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup.length);
        currentGroup = [];
      }
    } else {
      currentGroup.push(line);
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup.length);

  if (groups.length === 0) return LYRICS_MODES.KOREAN;

  const avg = groups.reduce((a, b) => a + b, 0) / groups.length;
  if (avg >= 2.5) return LYRICS_MODES.JAPANESE;
  if (avg >= 1.5) return LYRICS_MODES.ENGLISH;
  return LYRICS_MODES.KOREAN;
}

export default {
  detectLyricsMode,
};
