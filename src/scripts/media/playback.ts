/**
 * 음악 재생/일시정지/탐색 제어
 */

import { elements } from '../core/dom-utils.ts';
import * as audioPlayer from './audio-player.ts';
import { formatTime } from '../core/time-utils.ts';

let animationFrameId;

/**
 * 진행률 업데이트 (requestAnimationFrame 사용)
 */
function updateProgress() {
  if (!elements.audio.paused && elements.audio.duration) {
    const progressPercent =
      (elements.audio.currentTime / elements.audio.duration) * 100;

    if (elements.progressBarFill) {
      elements.progressBarFill.style.width = `${progressPercent}%`;
    }

    if (elements.currentTimeText) {
      elements.currentTimeText.value = formatTime(elements.audio.currentTime);
    }

    // 가사 싱크 이벤트 발생
    window.dispatchEvent(
      new CustomEvent('lyricsTimeUpdate', {
        detail: { currentTime: elements.audio.currentTime },
      })
    );

    animationFrameId = requestAnimationFrame(updateProgress);
  }
}

/**
 * Play/Pause 버튼 클릭
 */
function setupPlayButtonListener() {
  if (elements.playBtn) {
    elements.playBtn.addEventListener('click', () => {
      if (!elements.audio.src) {
        elements.musicInput.click();
        return;
      }

      if (elements.audio.paused) {
        elements.audio.play();
        audioPlayer.setPlayState(true);
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        elements.audio.pause();
        audioPlayer.setPlayState(false);
        cancelAnimationFrame(animationFrameId);
      }
    });
  }
}

/**
 * Next 버튼 클릭 (파일 선택만, 재생 안함)
 */
function setupNextButtonListener() {
  if (elements.nextBtn) {
    elements.nextBtn.addEventListener('click', () => {
      elements.musicInput.click();
    });
  }
}

/**
 * Previous 버튼 클릭 (처음으로 되감기)
 */
function setupPrevButtonListener() {
  if (elements.prevBtn) {
    elements.prevBtn.addEventListener('click', () => {
      if (elements.audio.src) {
        elements.audio.currentTime = 0;
        if (elements.bgVideo.src) {
          elements.bgVideo.currentTime = 0;
        }
        updateProgress();
        // 가사 리셋 이벤트
        window.dispatchEvent(new Event('resetLyrics'));
      }
    });
  }
}

/**
 * Tab 단축키: 배경 흐림 토글 (Type A) / 가사 박스 흐림 토글 (Type B)
 */
function setupBlurToggleListener() {
  let isBlurred = true;
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as Element).tagName)) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      isBlurred = !isBlurred;
      const layout = document.body.getAttribute('data-layout');

      if (layout === 'typeB') {
        // Type B: 가사 박스 흐림 토글
        elements.lyricsBox.style.backdropFilter = isBlurred
          ? 'blur(70px)'
          : 'blur(0px)';
      } else {
        // Type A: 배경 흐림 토글
        const blurAmount = getComputedStyle(document.documentElement)
          .getPropertyValue('--blur-amount')
          .trim();
        elements.bgVideo.style.filter = isBlurred
          ? `blur(${blurAmount})`
          : 'blur(0px)';
      }
    }
  });
}

/**
 * 음악 시간이 주기적으로 어긋날 때 동기화
 */
function setupTimeSyncListener() {
  const SYNC_THRESHOLD = 0.25;
  elements.audio.addEventListener('timeupdate', () => {
    if (
      elements.bgVideo.src &&
      Math.abs(elements.bgVideo.currentTime - elements.audio.currentTime) >
        SYNC_THRESHOLD
    ) {
      elements.bgVideo.currentTime = elements.audio.currentTime;
    }
  });
}

/**
 * 스페이스바: 음악 일시정지/재생
 */
function setupPlayPauseSpaceListener() {
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as Element).tagName)) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (elements.playBtn) {
        elements.playBtn.click();
      }
    }
  });
}

export function initialize() {
  window.animationFrameId = animationFrameId;

  setupPlayButtonListener();
  setupNextButtonListener();
  setupPrevButtonListener();
  setupBlurToggleListener();
  setupTimeSyncListener();
  setupPlayPauseSpaceListener();

  window.openMusicInput = () => elements.musicInput.click();
}

export default {
  updateProgress,
  initialize,
};
