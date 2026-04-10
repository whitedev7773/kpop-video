const imageButton = document.getElementById('albumArtButton');
const fileInput = document.getElementById('albumArtInput');
const zipInput = document.getElementById('zipInput');

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
    contextMenu.style.display = 'none';
}

// 전역 우클릭 시 커스텀 메뉴 표시 (텍스트 입력 요소는 브라우저 기본 메뉴 유지)
document.addEventListener('contextmenu', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    e.preventDefault();

    contextMenu.style.display = 'block';

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
        const reader = new FileReader();
        reader.onload = function(e) {
            imageButton.style.backgroundImage = `url('${e.target.result}')`;
            imageButton.textContent = '';
        };
        reader.readAsDataURL(file);
    }
});

// ZIP 파일 선택 시 일괄 적용
zipInput.addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;

    // 파일명에서 곡 이름과 아티스트 추출 (형식: {곡 이름}-{아티스트}.zip)
    const zipName = file.name.replace(/\.zip$/i, '');
    const dashIdx = zipName.indexOf('-');
    if (dashIdx !== -1) {
        document.getElementById('musicTitle').value = zipName.slice(0, dashIdx).trim();
        document.getElementById('artistName').value = zipName.slice(dashIdx + 1).trim();
    } else {
        document.getElementById('musicTitle').value = zipName.trim();
    }

    const zip = await JSZip.loadAsync(file);

    const artFile = zip.file('art.png') ?? zip.file('art.jpg');
    if (artFile) {
        const blob = await artFile.async('blob');
        const url = URL.createObjectURL(blob);
        imageButton.style.backgroundImage = `url('${url}')`;
        imageButton.textContent = '';
    }

    const musicFile = zip.file('music.mp3');
    if (musicFile) {
        const blob = await musicFile.async('blob');
        window.applyMusic(blob);
    }

    const videoFile = zip.file('video.mp4');
    if (videoFile) {
        const blob = await videoFile.async('blob');
        window.applyVideo(blob);
    }

    const lyricsFile = zip.file('lyrics.txt');
    if (lyricsFile) {
        const text = await lyricsFile.async('string');
        window.applyLyrics(text);
    }

    this.value = '';
});
