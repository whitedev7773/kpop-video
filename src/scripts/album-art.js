const imageButton = document.getElementById('albumArtButton');
const fileInput = document.getElementById('albumArtInput');
const zipInput = document.getElementById('zipInput');
const loadingDialog = document.getElementById('loadingDialog');
const loadingMessage = document.getElementById('loadingMessage');
const loadingProgressFill = document.getElementById('loadingProgressFill');
const toast = document.getElementById('toast');

let toastTimer;
function showToast(message, duration = 4000) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), duration);
}

window.showToast = showToast;

function showLoading(message = '불러오는 중...') {
    loadingMessage.textContent = message;
    loadingDialog.classList.remove('has-progress');
    loadingProgressFill.style.width = '0%';
    if (!loadingDialog.open) loadingDialog.showModal();
}

function updateLoading(message, percent) {
    loadingMessage.textContent = message;
    loadingDialog.classList.add('has-progress');
    loadingProgressFill.style.width = `${percent}%`;
}

function hideLoading() {
    loadingDialog.close();
    loadingDialog.classList.remove('has-progress');
}

window.showLoading = showLoading;
window.updateLoading = updateLoading;
window.hideLoading = hideLoading;

// 전역 커스텀 컨텍스트 메뉴 생성
const contextMenu = document.createElement('ul');
contextMenu.id = 'albumArtMenu';
contextMenu.innerHTML = `
    <li id="menuLoadZip">ZIP으로 불러오기</li>
    <li class="menu-separator"></li>
    <li id="menuLoadImage">앨범 아트 변경</li>
    <li id="menuLoadMusic">음악 변경</li>
    <li id="menuLoadVideo">배경 영상 변경</li>
`;
document.body.appendChild(contextMenu);

function hideMenu() {
    if (!contextMenu.classList.contains('visible')) return;
    contextMenu.classList.remove('visible');
    contextMenu.classList.add('hiding');
    contextMenu.addEventListener('animationend', () => {
        contextMenu.classList.remove('hiding');
    }, { once: true });
}

// 전역 우클릭 시 커스텀 메뉴 표시 (텍스트 입력 요소는 브라우저 기본 메뉴 유지)
document.addEventListener('contextmenu', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    e.preventDefault();

    contextMenu.classList.remove('visible');
    // reflow를 강제해 같은 위치에서 다시 우클릭해도 애니메이션 재생
    void contextMenu.offsetWidth;
    contextMenu.classList.add('visible');

    // 화면 밖으로 나가지 않도록 위치 보정
    const menuW = contextMenu.offsetWidth;
    const menuH = contextMenu.offsetHeight;
    contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - menuW - 4)}px`;
    contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - menuH - 4)}px`;
});

// 메뉴 항목 클릭
document.getElementById('menuLoadZip').addEventListener('click', () => {
    hideMenu();
    zipInput.click();
});
document.getElementById('menuLoadImage').addEventListener('click', () => {
    hideMenu();
    fileInput.click();
});
document.getElementById('menuLoadMusic').addEventListener('click', () => {
    hideMenu();
    window.openMusicInput();
});
document.getElementById('menuLoadVideo').addEventListener('click', () => {
    hideMenu();
    window.openVideoInput();
});

// 메뉴 외부 클릭 또는 Escape 시 닫기
document.addEventListener('click', hideMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideMenu(); });

// 싱글클릭 시 이미지 파일 선택
imageButton.addEventListener('click', () => fileInput.click());

// 이미지 파일 선택
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        showLoading('앨범 아트 불러오는 중...');
        const reader = new FileReader();
        reader.onload = function(e) {
            imageButton.style.backgroundImage = `url('${e.target.result}')`;
            imageButton.textContent = '';
            hideLoading();
        };
        reader.readAsDataURL(file);
    }
});

// ZIP 파일 선택 시 일괄 적용
zipInput.addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;

    showLoading('ZIP 파일 분석 중...');

    try {
        // 파일명에서 곡 이름과 아티스트 추출 (형식: {곡 이름}-{아티스트}.zip)
        const zipName = file.name.replace(/\.zip$/i, '');
        const dashIdx = zipName.indexOf('-');
        if (dashIdx !== -1) {
            document.getElementById('musicTitle').value = zipName.slice(0, dashIdx).trim();
            document.getElementById('artistName').value = zipName.slice(dashIdx + 1).trim();
        } else {
            document.getElementById('musicTitle').value = zipName.trim();
        }

        // ZIP 압축 해제 (onUpdate로 진행률 수신)
        const zip = await JSZip.loadAsync(file, {
            onUpdate: (meta) => updateLoading('ZIP 압축 해제 중...', meta.percent),
        });

        // 파일별 처리 단계 정의 (존재하는 것만)
        const hasVideo = !!zip.file('video.mp4');
        if (hasVideo) showToast('뒷배경 영상은 적용에 시간이 걸릴 수 있습니다.');
        const steps = [
            {
                file: zip.file('art.png') ?? zip.file('art.jpg'),
                label: '앨범 아트 적용 중...',
                handle: async (blob) => {
                    const url = URL.createObjectURL(blob);
                    imageButton.style.backgroundImage = `url('${url}')`;
                    imageButton.textContent = '';
                },
            },
            {
                file: zip.file('music.mp3'),
                label: '음악 파일 적용 중...',
                handle: async (blob) => window.applyMusic(blob),
            },
            {
                file: zip.file('video.mp4'),
                label: '배경 영상 적용 중...',
                handle: async (blob) => window.applyVideo(blob),
            },
            {
                file: zip.file('lyrics.txt'),
                label: '가사 적용 중...',
                handle: async (text) => window.applyLyrics(text),
                type: 'string',
            },
        ].filter(s => s.file);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const basePercent = (i / steps.length) * 100;
            const nextPercent = ((i + 1) / steps.length) * 100;

            const content = await step.file.async(step.type ?? 'blob', (meta) => {
                updateLoading(step.label, basePercent + meta.percent / 100 * (nextPercent - basePercent));
            });

            updateLoading(step.label, nextPercent);
            await step.handle(content);
        }
    } finally {
        hideLoading();
        this.value = '';
    }
});
