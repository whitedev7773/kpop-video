/**
 * 개별 파일 로드 (음악, 이미지, 영상)
 */

import { elements } from "../core/dom-utils.ts";
import * as toastLoader from "../ui/toast-loader.ts";
import * as infoSync from "../ui/info-sync.ts";

/**
 * 앨범 아트 로드
 */
export function loadAlbumArt() {
  if (elements.albumArtInput) {
    elements.albumArtInput.click();
  }
}

/**
 * 앨범 아트 파일 선택 처리
 */
function handleAlbumArtFile(file) {
  if (!file) return;

  toastLoader.showLoading("앨범 아트 불러오는 중...");

  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>) {
    if (elements.albumArtButton) {
      elements.albumArtButton.style.backgroundImage = `url('${(e.target as FileReader).result}')`;
      elements.albumArtButton.textContent = "";
      infoSync.syncPlayerInfo();
    }
    toastLoader.hideLoading();
  };
  reader.readAsDataURL(file);
}

/**
 * 음악 파일 선택 처리
 */
function handleMusicFile(file) {
  if (!file) return;

  toastLoader.showLoading("음악 파일 불러오는 중...");

  if (elements.musicTitle) {
    elements.musicTitle.value = file.name.replace(/\.[^/.]+$/, "");
  }

  // applyMusic은 player-control에서 처리
  window.applyMusic?.(file);
}

/**
 * 배경 영상 파일 선택 처리
 */
function handleVideoFile(file) {
  if (!file) return;

  toastLoader.showLoading("배경 영상 불러오는 중...");
  toastLoader.showToast("뒷배경 영상은 적용에 시간이 걸릴 수 있습니다.");

  // applyVideo는 player-control에서 처리
  window.applyVideo?.(file);
}

/**
 * 파일 입력 이벤트 등록
 */
function setupFileInputListeners() {
  // 앨범 아트
  if (elements.albumArtInput) {
    elements.albumArtInput.addEventListener("change", (e) => {
      handleAlbumArtFile((e.target as HTMLInputElement).files?.[0]);
    });
  }

  // 앨범 아트 버튼 클릭
  if (elements.albumArtButton) {
    elements.albumArtButton.addEventListener("click", loadAlbumArt);
  }

  // 음악
  if (elements.musicInput) {
    elements.musicInput.addEventListener("change", (e) => {
      handleMusicFile((e.target as HTMLInputElement).files?.[0]);
    });
  }

  // 배경 영상
  if (elements.bgVideoInput) {
    elements.bgVideoInput.addEventListener("change", (e) => {
      handleVideoFile((e.target as HTMLInputElement).files?.[0]);
    });
  }
}

export function initialize() {
  setupFileInputListeners();
}

export default {
  loadAlbumArt,
  initialize,
};
