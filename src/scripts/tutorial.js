const TOTAL_STEPS = 3;

const dialog   = document.getElementById('tutorialDialog');
const slides   = Array.from(document.querySelectorAll('.tutorial-slide'));
const dots     = Array.from(document.querySelectorAll('#tutorialDots .dot'));
const btnClose = document.getElementById('tutorialClose');
const btnPrev  = document.getElementById('tutorialPrev');
const btnNext  = document.getElementById('tutorialNext');
const btnDone  = document.getElementById('tutorialDone');

let currentStep = 0;

function goToStep(next, direction = 'right') {
    const current = slides[currentStep];
    const target  = slides[next];

    current.classList.remove('active', 'from-left');
    target.classList.remove('active', 'from-left');

    if (direction === 'left') target.classList.add('from-left');
    target.classList.add('active');

    dots[currentStep].classList.remove('active');
    dots[next].classList.add('active');

    currentStep = next;

    btnPrev.disabled = currentStep === 0;

    const isLast = currentStep === TOTAL_STEPS - 1;
    btnNext.style.display = isLast ? 'none' : '';
    btnDone.style.display = isLast ? '' : 'none';
}

function closeTutorial() {
    dialog.classList.add('closing');
    dialog.addEventListener('animationend', () => {
        dialog.classList.remove('closing');
        dialog.close();
    }, { once: true });
}

btnClose.addEventListener('click', closeTutorial);
btnDone.addEventListener('click',  closeTutorial);

btnNext.addEventListener('click', () => {
    if (currentStep < TOTAL_STEPS - 1) goToStep(currentStep + 1, 'right');
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 0) goToStep(currentStep - 1, 'left');
});

// 접속 시 항상 표시
slides[0].classList.add('active');
btnPrev.disabled = true;
dialog.showModal();
