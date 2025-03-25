// 서버시간 출력
function getServerTime() {
	const serverTime = document.querySelector('#serverTime');
	
	fetch('http://localhost:8081/server-time')
		.then(response => {
			if (!response.ok) {
				throw new Error('네트워크 응답에 문제가 있습니다.');
			}
			return response.json(); // json으로 변환
		})
		.then(data => {
			serverTime.textContent = data.serverTime; // 서버 시간 표시
		})
		.catch(error => {
			console.error('서버시간 요청에 실패했습니다 : ', error);
		});
}

document.addEventListener('DOMContentLoaded', function() {
	// 서버시간 출력
	getServerTime();
	
	// [지도화면] 버튼 클릭 이벤트
	const mapBtn = document.querySelector('#mapBtn');
	mapBtn.addEventListener('click', function() {
		window.location.href = 'http://localhost:8081/map';
	});
});