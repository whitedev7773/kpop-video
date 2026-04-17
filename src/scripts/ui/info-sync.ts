/**
 * 음악 정보 (제목, 아티스트) 동기화
 * TypeA와 TypeB 간 양방향 동기화
 */

import { elements } from "../core/dom-utils.ts";
import { q } from "../core/dom-utils.ts";

/**
 * 앨범 아트와 음악 제목/아티스트를 TypeB에 동기화
 */
export function syncPlayerInfo() {
  // 앨범 아트 동기화
  const playerArtThumb = q("#playerArtThumb") as HTMLElement | null;
  if (playerArtThumb && elements.albumArtButton) {
    playerArtThumb.style.backgroundImage =
      elements.albumArtButton.style.backgroundImage;
  }

  // 제목 동기화
  const playerInfoTitle = q("#playerInfoTitle") as HTMLInputElement | null;
  if (playerInfoTitle && elements.musicTitle) {
    playerInfoTitle.value = elements.musicTitle.value;
  }

  // 아티스트 동기화
  const playerInfoArtist = q("#playerInfoArtist") as HTMLInputElement | null;
  if (playerInfoArtist && elements.artistName) {
    playerInfoArtist.value = elements.artistName.value;
  }
}

/**
 * TypeB 입력 필드 → TypeA로 역방향 동기화
 */
function setupReverseSyncListeners() {
  const playerInfoTitle = q("#playerInfoTitle") as HTMLInputElement | null;
  const playerInfoArtist = q("#playerInfoArtist") as HTMLInputElement | null;

  if (playerInfoTitle) {
    playerInfoTitle.addEventListener("input", () => {
      if (elements.musicTitle) {
        elements.musicTitle.value = playerInfoTitle.value;
      }
    });
  }

  if (playerInfoArtist) {
    playerInfoArtist.addEventListener("input", () => {
      if (elements.artistName) {
        elements.artistName.value = playerInfoArtist.value;
      }
    });
  }
}

/**
 * TypeA 입력 필드 → TypeB로 이벤트 리스너 등록
 */
function setupForwardSyncListeners() {
  if (elements.musicTitle) {
    elements.musicTitle.addEventListener("input", syncPlayerInfo);
  }

  if (elements.artistName) {
    elements.artistName.addEventListener("input", syncPlayerInfo);
  }
}

export function initialize() {
  syncPlayerInfo();
  setupForwardSyncListeners();
  setupReverseSyncListeners();
}

export default {
  syncPlayerInfo,
  initialize,
};
