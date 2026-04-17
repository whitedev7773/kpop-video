import { elements } from "../core/dom-utils.ts";

let currentStep = 1;
const totalSteps = 3;

/**
 * 튜토리얼 열기
 */
export function openTutorial() {
  if (!elements.tutorialDialog) return;
  currentStep = 1;
  updateTutorialDOM();
  elements.tutorialDialog.showModal();
}

/**
 * 튜토리얼 닫기
 */
export function closeTutorial() {
  if (!elements.tutorialDialog) return;
  elements.tutorialDialog.classList.add("closing");
  setTimeout(() => {
    elements.tutorialDialog.close();
    elements.tutorialDialog.classList.remove("closing");
  }, 200); // Wait for the tutorialOut animation
  
  // 튜토리얼을 한 번이라도 봤다면 로컬 스토리지에 저장 (선택 사항이나 첫 방문 여부로 활용)
  localStorage.setItem('tutorial-shown', 'true');
}

/**
 * 단계 업데이트 및 DOM 반영
 */
function updateTutorialDOM() {
  if (!elements.tutorialDialog) return;

  // 슬라이드 클래스 변경
  const slides = elements.tutorialDialog.querySelectorAll('.tutorial-slide');
  slides.forEach((slide) => {
    const step = parseInt((slide as HTMLElement).dataset.step || "1", 10);
    slide.classList.remove('active', 'from-left', 'from-right');
    
    if (step === currentStep) {
      slide.classList.add('active');
    }
  });

  // 점 활성화
  const dots = elements.tutorialDialog.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index + 1 === currentStep) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // 버튼 표시 업데이트
  const prevBtn = document.getElementById('tutorialPrev');
  const nextBtn = document.getElementById('tutorialNext');
  const doneBtn = document.getElementById('tutorialDone');

  if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
  if (doneBtn) doneBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
}

/**
 * 이벤트 바인딩
 */
export function initialize() {
  if (!elements.tutorialDialog) return;

  const prevBtn = document.getElementById('tutorialPrev');
  const nextBtn = document.getElementById('tutorialNext');
  const doneBtn = document.getElementById('tutorialDone');
  const closeBtn = document.getElementById('tutorialClose');

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateTutorialDOM();
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateTutorialDOM();
    }
  });

  doneBtn?.addEventListener('click', closeTutorial);
  closeBtn?.addEventListener('click', closeTutorial);

  // 로컬 스토리지 확인 후 처음이면 자동으로 띄우기
  const isTutorialShown = localStorage.getItem('tutorial-shown');
  if (!isTutorialShown) {
    openTutorial();
  }
}
