const imageButton = document.getElementById('albumArtButton');
const fileInput = document.getElementById('albumArtInput');

// 1. 버튼 클릭 시 파일 입력창(input) 강제 실행
imageButton.addEventListener('click', () => {
    fileInput.click();
});

// 2. 파일이 선택되었을 때의 로직
fileInput.addEventListener('change', function() {
    const file = this.files[0]; // 선택된 첫 번째 파일

    if (file) {
        const reader = new FileReader();

        // 파일을 Data URL(Base64)로 읽어오기
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            
            // 버튼 배경 이미지 변경
            imageButton.style.backgroundImage = `url('${imageUrl}')`;
            // 버튼 내부 텍스트 제거
            imageButton.textContent = ""; 
        };

        reader.readAsDataURL(file);
    }
});