/**
 * 레이아웃 및 테마 전환 관리
 */

import { LAYOUT, THEMES, STORAGE_KEYS } from "../core/constants.ts";
import { q } from "../core/dom-utils.ts";

/**
 * 레이아웃 전환 (TypeA ↔ TypeB)
 */
export function toggleLayout() {
  const current = document.body.dataset.layout;
  const next = current === LAYOUT.TYPE_B ? LAYOUT.TYPE_A : LAYOUT.TYPE_B;
  setLayout(next);
}

/**
 * 레이아웃 설정
 */
export function setLayout(layout) {
  document.body.dataset.layout = layout;
  localStorage.setItem(STORAGE_KEYS.LAYOUT, layout);
  updateToggleLabel();
}

/**
 * 토글 버튼 라벨 업데이트
 */
function updateToggleLabel() {
  const isTypeB = document.body.dataset.layout === LAYOUT.TYPE_B;
  const label = q("#menuToggleLayout");
  if (label) {
    label.textContent = isTypeB ? "디자인 A로 변경" : "디자인 B로 변경";
  }
}

/**
 * TypeB 테마 설정
 */
export function setTheme(theme) {
  document.body.dataset.typebTheme = theme;
  localStorage.setItem(STORAGE_KEYS.TYPEB_THEME, theme);
  updateThemeLabels();
}

/**
 * 테마 라벨 업데이트 (메뉴에서 체크마크 표시)
 */
function updateThemeLabels() {
  const current = document.body.dataset.typebTheme || THEMES.MIXED_DARK;
  const themeOptions = [
    { key: THEMES.LIGHT, id: "menuThemeLight", label: "라이트" },
    { key: THEMES.DARK, id: "menuThemeDark", label: "다크" },
    {
      key: THEMES.MIXED_LIGHT,
      id: "menuThemeMixedLight",
      label: "혼합 · 밝은 가사",
    },
    {
      key: THEMES.MIXED_DARK,
      id: "menuThemeMixedDark",
      label: "혼합 · 어두운 가사",
    },
  ];

  for (const option of themeOptions) {
    const el = q(`#${option.id}`);
    if (el) {
      (el as HTMLElement).dataset.active = (option.key === current).toString();
      el.textContent = (option.key === current ? "✓ " : "    ") + option.label;
    }
  }
}

export function initialize() {
  // 저장된 레이아웃 및 테마 복원
  const savedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT);
  const savedTheme = localStorage.getItem(STORAGE_KEYS.TYPEB_THEME);

  if (savedLayout) {
    document.body.dataset.layout = savedLayout;
  }

  if (savedTheme) {
    document.body.dataset.typebTheme = savedTheme;
  }

  updateToggleLabel();
  updateThemeLabels();
}

export default {
  toggleLayout,
  setLayout,
  setTheme,
  initialize,
};
