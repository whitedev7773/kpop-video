/**
 * 가사 텍스트 파싱 로직
 */

import { LYRICS_MODES } from "../core/constants.js";

/**
 * "[파트] 텍스트" 형식 파싱
 */
export function parseLyricLine(line) {
  let part = null;
  let rest = line.trim();

  const partMatch = rest.match(/^\[([^\]]+)\]\s*/);
  if (partMatch) {
    part = partMatch[1];
    rest = rest.slice(partMatch[0].length);
  }

  return { part, text: rest };
}

/**
 * 모드에 따라 텍스트를 파싱하여 가사 데이터 배열 생성
 */
export function parseLyricsText(text, mode) {
  const rawLines = text.split("\n");
  const data = [];

  if (mode === LYRICS_MODES.KOREAN) {
    // 한줄구분: 각 줄이 하나의 가사
    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        // 공백 라인을 그대로 유지
        data.push({ part: null, lines: ["\u00A0"] });
        continue;
      }
      const { part, text: lyricText } = parseLyricLine(trimmed);
      data.push({ part, lines: [lyricText || "\u00A0"] });
    }
  } else {
    // 두줄/세줄구분: 빈 줄로 그룹 구분
    const linesPerGroup = mode === LYRICS_MODES.ENGLISH ? 2 : 3;
    const groups = [];
    let currentGroup = [];

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(trimmed);
      }
    }
    if (currentGroup.length > 0) groups.push(currentGroup);

    for (const group of groups) {
      let part = null;
      const { part: p, text: firstText } = parseLyricLine(group[0]);
      if (p) {
        part = p;
        group[0] = firstText;
      }

      // "."만 있는 줄은 공백 처리
      for (let i = 0; i < group.length; i++) {
        if (group[i] === ".") group[i] = "\u00A0";
      }

      // 그룹 크기를 맞춤
      while (group.length < linesPerGroup) group.push("\u00A0");

      data.push({ part, lines: group.slice(0, linesPerGroup) });
    }
  }

  return data;
}

/**
 * 가사 데이터 → 편집용 텍스트 복원
 */
export function lyricsDataToText(data, mode) {
  if (mode === LYRICS_MODES.KOREAN) {
    return data
      .map((d) => {
        let line = d.part ? `[${d.part}] ` : "";
        line += d.lines[0] === "\u00A0" ? "" : d.lines[0];
        return line;
      })
      .join("\n");
  }

  return data
    .map((d) => {
      let firstLine = d.part ? `[${d.part}] ` : "";
      firstLine += d.lines[0] === "\u00A0" ? "." : d.lines[0];
      const otherLines = d.lines
        .slice(1)
        .map((l) => (l === "\u00A0" ? "." : l));
      return [firstLine, ...otherLines].join("\n");
    })
    .join("\n\n");
}

export default {
  parseLyricLine,
  parseLyricsText,
  lyricsDataToText,
};
