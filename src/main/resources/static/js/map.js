document.addEventListener('DOMContentLoaded', async function() {
    const mapContainer = document.querySelector('#map');
    const apiKeyUrl = mapContainer.getAttribute('data-api-key-url');

    try {
        // 카카오맵 API키 가져오기
        const apiKey = await getKakaoMapApiKey(apiKeyUrl);

        // 카카오맵 API 초기화
        const map = await initKakaoMap(apiKey, mapContainer);

        console.log('카카오맵 초기화 성공:', map);

    } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
    };

    // 검색바 라벨 처리 - 검색바의 입력박스에 값이 입력되면 라벨 비가시화
    const mapInputSearch = document.querySelector('.map-input-search');
    const mapLabelSearch = document.querySelector('.map-label-search');
    mapInputSearch.addEventListener('input', function() {
        if (mapInputSearch.value.length > 0)
            mapLabelSearch.setAttribute('style', 'display: none;');
        else
            mapLabelSearch.setAttribute('style', 'display: block;');
    });

    // 검색 기능
    const mapSearchBtn = document.querySelector('#mapSearchBtn');
    mapSearchBtn.addEventListener('click', function() {

    });
});


/* --------- 함수 정의 --------- */

// 카카오맵 API키 가져오기
const getKakaoMapApiKey = async (apiKeyUrl) => {
    const response = await fetch(apiKeyUrl);
    const data = await response.json();
    return data.apiKey;
};

// 카카오맵 API 초기화
const initKakaoMap = async (apiKey, mapContainer) => {
    return new Promise((resolve, reject) => {
        // 카카오맵 API 스크립트 로드 (동적 로딩)
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appKey=${apiKey}&autoload=false`;
        script.onload = () => {
            console.log('카카오맵 API 로드 완료');
            window.kakao.maps.load(() => {
                let options = { // 지도를 생성할 떄 필요한 기본 옵션
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                    level: 3 // 지도의 레벨(확대, 축소 정도)
                };
                const kakaoMap = new window.kakao.maps.Map(mapContainer, options); // 지도 생성 및 객체 리턴
                resolve(kakaoMap); // 지도 객체 반환
            });
        };
        script.onerror = (error) => {
            reject(error);
        };
        document.head.appendChild(script);
    });
};