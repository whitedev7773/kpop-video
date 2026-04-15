/**
 * 음악 정보 (제목, 아티스트) 동기화
 * TypeA와 TypeB 간 양방향 동기화
 */

import { elements } from "../core/dom-utils.js";
import { q } from "../core/dom-utils.js";

/**
 * 앨범 아트와 음악 제목/아티스트를 TypeB에 동기화
 */
export function syncPlayerInfo() {
  // 앨범 아트 동기화
  const playerArtThumb = q("#playerArtThumb");
  if (playerArtThumb && elements.albumArtButton) {
    playerArtThumb.style.backgroundImage =
      elements.albumArtButton.style.backgroundImage;
  }

  // 제목 동기화
  const playerInfoTitle = q("#playerInfoTitle");
  if (playerInfoTitle && elements.musicTitle) {
    playerInfoTitle.value = elements.musicTitle.value;
  }

  // 아티스트 동기화
  const playerInfoArtist = q("#playerInfoArtist");
  if (playerInfoArtist && elements.artistName) {
    playerInfoArtist.value = elements.artistName.value;
  }
}

/**
 * TypeB 입력 필드 → TypeA로 역방향 동기화
 */
function setupReverseSyncListeners() {
  const playerInfoTitle = q("#playerInfoTitle");
  const playerInfoArtist = q("#playerInfoArtist");

  if (playerInfoTitle) {
    playerInfoTitle.addEventListener("input", function () {
      if (elements.musicTitle) {
        elements.musicTitle.value = this.value;
      }
    });
  }

  if (playerInfoArtist) {
    playerInfoArtist.addEventListener("input", function () {
      if (elements.artistName) {
        elements.artistName.value = this.value;
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
