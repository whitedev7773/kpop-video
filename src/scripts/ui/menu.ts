/**
 * 우클릭 컨텍스트 메뉴 관리
 */

import { elements } from "../core/dom-utils.ts";
import { q, addClass, removeClass } from "../core/dom-utils.ts";
import * as theme from "./theme.ts";

let contextMenu;

/**
 * 메뉴 생성
 */
function createMenu() {
  contextMenu = document.createElement("ul");
  contextMenu.id = "albumArtMenu";
  contextMenu.innerHTML = `
    <li id="menuLoadZip">ZIP으로 불러오기</li>
    <li class="menu-separator"></li>
    <li id="menuLoadImage">앨범 아트 변경</li>
    <li id="menuLoadMusic">음악 변경</li>
    <li id="menuLoadVideo">배경 영상 변경</li>
    <li class="menu-separator"></li>
    <li id="menuToggleLayout">디자인 B로 변경</li>
    <li class="menu-separator typeb-only"></li>
    <li id="menuThemeLight" class="typeb-only">라이트</li>
    <li id="menuThemeDark" class="typeb-only">다크</li>
    <li id="menuThemeMixedLight" class="typeb-only">혼합 · 밝은 가사</li>
    <li id="menuThemeMixedDark" class="typeb-only">혼합 · 어두운 가사</li>
  `;
  document.body.appendChild(contextMenu);
}

/**
 * 메뉴 숨기기
 */
export function hideMenu() {
  if (!contextMenu || !contextMenu.classList.contains("visible")) return;
  removeClass(contextMenu, "visible");
  addClass(contextMenu, "hiding");
  contextMenu.addEventListener(
    "animationend",
    () => {
      removeClass(contextMenu, "hiding");
    },
    { once: true },
  );
}

/**
 * 메뉴 표시
 * @param {x, y} position - 마우스 위치
 */
function showMenu(position) {
  if (!contextMenu) return;
  removeClass(contextMenu, "visible");
  // reflow 강제
  void contextMenu.offsetWidth;
  addClass(contextMenu, "visible");

  // 화면 밖 위치 보정
  const menuW = contextMenu.offsetWidth;
  const menuH = contextMenu.offsetHeight;
  contextMenu.style.left = `${Math.min(position.x, window.innerWidth - menuW - 4)}px`;
  contextMenu.style.top = `${Math.min(position.y, window.innerHeight - menuH - 4)}px`;
}

/**
 * 메뉴 항목 클릭 이벤트 등록
 */
function setupMenuItemListeners() {
  q("#menuLoadZip")?.addEventListener("click", () => {
    hideMenu();
    elements.zipInput.click();
  });

  q("#menuLoadImage")?.addEventListener("click", () => {
    hideMenu();
    elements.albumArtInput.click();
  });

  q("#menuLoadMusic")?.addEventListener("click", () => {
    hideMenu();
    window.openMusicInput?.();
  });

  q("#menuLoadVideo")?.addEventListener("click", () => {
    hideMenu();
    window.openVideoInput?.();
  });

  q("#menuToggleLayout")?.addEventListener("click", () => {
    hideMenu();
    theme.toggleLayout();
  });

  q("#menuThemeLight")?.addEventListener("click", () => {
    hideMenu();
    theme.setTheme("light");
  });

  q("#menuThemeDark")?.addEventListener("click", () => {
    hideMenu();
    theme.setTheme("dark");
  });

  q("#menuThemeMixedLight")?.addEventListener("click", () => {
    hideMenu();
    theme.setTheme("mixed-light");
  });

  q("#menuThemeMixedDark")?.addEventListener("click", () => {
    hideMenu();
    theme.setTheme("mixed-dark");
  });
}

/**
 * 글로벌 우클릭 이벤트 등록
 */
function setupContextMenuListener() {
  document.addEventListener("contextmenu", (e) => {
    if (["INPUT", "TEXTAREA"].includes((e.target as Element).tagName)) return;
    e.preventDefault();
    showMenu({ x: e.clientX, y: e.clientY });
  });

  document.addEventListener("click", hideMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideMenu();
  });
}

export function initialize() {
  createMenu();
  setupMenuItemListeners();
  setupContextMenuListener();
}

export default {
  hideMenu,
  initialize,
};
