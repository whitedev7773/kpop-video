/**
 * Toast 알림 및 Loading 다이얼로그 관리
 */

import { elements } from "../core/dom-utils.ts";
import { TIMING } from "../core/constants.ts";

let toastTimer;

/**
 * Toast 알림 표시
 * @param {string} message - 표시할 메시지
 * @param {number} duration - 표시 시간 (밀리초)
 */
export function showToast(message, duration = TIMING.TOAST_DURATION) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, duration);
}

/**
 * Loading 다이얼로그 표시 시작
 * @param {string} message - 표시할 메시지
 */
export function showLoading(message = "불러오는 중...") {
  elements.loadingMessage.textContent = message;
  elements.loadingDialog.classList.remove("has-progress");
  elements.loadingProgressFill.style.width = "0%";
  if (!elements.loadingDialog.open) {
    elements.loadingDialog.showModal();
  }
}

/**
 * Loading 진행률 업데이트
 * @param {string} message - 표시할 메시지
 * @param {number} percent - 진행률 (0-100)
 */
export function updateLoading(message, percent) {
  elements.loadingMessage.textContent = message;
  elements.loadingDialog.classList.add("has-progress");
  elements.loadingProgressFill.style.width = `${percent}%`;
}

/**
 * Loading 다이얼로그 숨기기
 */
export function hideLoading() {
  elements.loadingDialog.close();
  elements.loadingDialog.classList.remove("has-progress");
}

/**
 * 글로벌 함수로 노출 (기존 코드와의 호환성)
 */
export function expose() {
  window.showToast = showToast;
  window.showLoading = showLoading;
  window.updateLoading = updateLoading;
  window.hideLoading = hideLoading;
}

export function initialize() {
  expose();
}

export default {
  showToast,
  showLoading,
  updateLoading,
  hideLoading,
  expose,
  initialize,
};
