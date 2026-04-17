/**
 * 시간 관련 유틸리티 함수
 */

/**
 * 초 단위 시간을 "MM:SS" 형식으로 포맷
 * @param {number} seconds - 초 단위 시간
 * @returns {string} "MM:SS" 형식의 시간 문자열
 */
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return "00:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

/**
 * 초를 분:초:밀리초로 변환
 */
export function toDetailedTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return {
    hours,
    minutes,
    seconds: secs,
    milliseconds: ms,
  };
}

/**
 * "MM:SS" 형식 문자열을 초로 변환
 */
export function parseTime(timeString) {
  const parts = timeString.split(":");
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes * 60 + seconds;
  }
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

/**
 * 두 시간 값 사이의 차이 계산 (초)
 */
export function getTimeDifference(time1, time2) {
  return Math.abs(time1 - time2);
}

/**
 * 두 시간이 일정 범위 내에 있는지 확인
 */
export function isTimeWithinThreshold(time1, time2, threshold) {
  return Math.abs(time1 - time2) <= threshold;
}

/**
 * 진행률 계산 (%)
 */
export function getProgressPercent(currentTime, duration) {
  if (!duration || duration === 0) return 0;
  return (currentTime / duration) * 100;
}

/**
 * 진행률(%)에서 시간 계산
 */
export function getTimeFromProgress(progressPercent, duration) {
  return (progressPercent / 100) * duration;
}

export default {
  formatTime,
  toDetailedTime,
  parseTime,
  getTimeDifference,
  isTimeWithinThreshold,
  getProgressPercent,
  getTimeFromProgress,
};
