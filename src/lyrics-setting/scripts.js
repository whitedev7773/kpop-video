const dialog = document.getElementById('lyricsSetting');
const openBtn = document.getElementById('lyricsBox');

openBtn.addEventListener('click', () => {
  // .show()는 일반 팝업, .showModal()은 배경이 어두워지는 모달입니다.
  dialog.showModal(); 
});