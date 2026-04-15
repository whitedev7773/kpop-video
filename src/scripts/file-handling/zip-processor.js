/**
 * ZIP 파일 압축 해제 및 일괄 처리
 * 곡 이름, 음악, 이미지, 영상, 가사를 한 번에 로드
 */

import * as toastLoader from "../ui/toast-loader.js";
import * as infoSync from "../ui/info-sync.js";
import { elements } from "../core/dom-utils.js";
import { LYRICS_MODES } from "../core/constants.js";

/**
 * 가사 언어 선택 모달 표시 및 선택 대기
 */
function selectLyricsLanguage() {
  return new Promise((resolve) => {
    if (!elements.selectLyricsLangDialog) {
      resolve(LYRICS_MODES.KOREAN);
      return;
    }

    const langKorean = document.getElementById("langKorean");
    const langEnglish = document.getElementById("langEnglish");
    const langJapanese = document.getElementById("langJapanese");

    const handleSelection = (mode) => {
      elements.selectLyricsLangDialog.close();
      langKorean.removeEventListener("click", handleKorean);
      langEnglish.removeEventListener("click", handleEnglish);
      langJapanese.removeEventListener("click", handleJapanese);
      toastLoader.showToast(
        "배경 영상 로딩 중입니다. (메타데이터만 먼저 로드됩니다)",
      );
      resolve(mode);
    };

    const handleKorean = () => handleSelection(LYRICS_MODES.KOREAN);
    const handleEnglish = () => handleSelection(LYRICS_MODES.ENGLISH);
    const handleJapanese = () => handleSelection(LYRICS_MODES.JAPANESE);

    langKorean.addEventListener("click", handleKorean);
    langEnglish.addEventListener("click", handleEnglish);
    langJapanese.addEventListener("click", handleJapanese);

    elements.selectLyricsLangDialog.showModal();
  });
}

/**
 * ZIP 파일 선택 처리
 */
export async function handleZipFile(file) {
  if (!file) return;

  toastLoader.showLoading("ZIP 파일 분석 중...");

  try {
    // 파일명에서 곡 이름과 아티스트 추출 (형식: {곡 이름}-{아티스트}.zip)
    const zipName = file.name.replace(/\.zip$/i, "");
    const dashIdx = zipName.indexOf("-");
    if (dashIdx !== -1) {
      if (elements.musicTitle)
        elements.musicTitle.value = zipName.slice(0, dashIdx).trim();
      if (elements.artistName)
        elements.artistName.value = zipName.slice(dashIdx + 1).trim();
    } else {
      if (elements.musicTitle) elements.musicTitle.value = zipName.trim();
    }
    infoSync.syncPlayerInfo();

    // ZIP 압축 해제
    const zip = await JSZip.loadAsync(file, {
      onUpdate: (meta) =>
        toastLoader.updateLoading("ZIP 압축 해제 중...", meta.percent),
    });

    // 파일별 처리 단계 정의 (존재하는 것만)
    const hasVideo = !!zip.file("video.mp4");

    const steps = [
      {
        file: zip.file("art.png") ?? zip.file("art.jpg"),
        label: "앨범 아트 적용 중...",
        handle: async (blob) => {
          const url = URL.createObjectURL(blob);
          if (elements.albumArtButton) {
            elements.albumArtButton.style.backgroundImage = `url('${url}')`;
            elements.albumArtButton.textContent = "";
            infoSync.syncPlayerInfo();
          }
        },
      },
      {
        file: zip.file("music.mp3"),
        label: "음악 파일 적용 중...",
        handle: async (blob) => window.applyMusic?.(blob),
      },
      {
        file: zip.file("lyrics.txt"),
        label: "가사 적용 중...",
        handle: async (text) => {
          const mode = await selectLyricsLanguage();
          window.applyLyrics?.(text, mode);
        },
        type: "string",
      },
      {
        file: zip.file("video.mp4"),
        label: "배경 영상 적용 중...",
        handle: async (blob) => window.applyVideo?.(blob),
      },
    ].filter((s) => s.file);

    // 순차적으로 파일 처리
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const basePercent = (i / steps.length) * 100;
      const nextPercent = ((i + 1) / steps.length) * 100;

      const content = await step.file.async(step.type ?? "blob", (meta) => {
        updateLoading(
          step.label,
          basePercent + (meta.percent / 100) * (nextPercent - basePercent),
        );
      });

      toastLoader.updateLoading(step.label, nextPercent);
      await step.handle(content);
    }
  } catch (error) {
    console.error("ZIP 처리 오류:", error);
    toastLoader.showToast("ZIP 파일 처리 중 오류가 발생했습니다.");
  } finally {
    toastLoader.hideLoading();
  }
}

/**
 * ZIP 입력 이벤트 등록
 */
function setupZipInputListener() {
  if (elements.zipInput) {
    elements.zipInput.addEventListener("change", async function () {
      const file = this.files?.[0];
      await handleZipFile(file);
      this.value = "";
    });
  }
}

export function initialize() {
  setupZipInputListener();
}

export default {
  handleZipFile,
  initialize,
};
