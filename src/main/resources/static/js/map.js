document.addEventListener('DOMContentLoaded', async function() {
    /* map.js 전체 영역에서 쓰일 변수 */
    const homeBtn = document.querySelector('#homeBtn');
    const mapContainer = document.querySelector('#map'); // 지도 영역
    const mapInputSearch = document.querySelector('.map-input-search');
    const mapLabelSearch = document.querySelector('.map-label-search');
    const mapSearchBtn = document.querySelector('#mapSearchBtn');

    let listEl = document.querySelector('#placesList');
    let paginationEl = document.querySelector('#pagination');

    let map = null; // 카카오맵 API 지도 객체
    let markers = []; // 마커를 담을 배열
    /* -------------------------- */



   // 로고 버튼 클릭 시 메인화면으로 이동
    homeBtn.addEventListener('click', function() {
        window.location.href = '/';
    });


    


    // 검색바 라벨 처리 - 검색바의 입력박스에 값이 입력되면 라벨 비가시화
    mapInputSearch.addEventListener('input', function() {
        if (mapInputSearch.value.length > 0)
            mapLabelSearch.setAttribute('style', 'display: none;');
        else
            mapLabelSearch.setAttribute('style', 'display: block;');
    });

    // 함수 정의 : 카카오맵 API 초기화
    const initKakaoMap = async (appJsKey, mapContainer) => {
        return new Promise((resolve, reject) => {
            try {
                // 카카오맵 API 스크립트 로드 (동적 로딩)
                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appKey=${appJsKey}&libraries=services,clusterer,drawing&autoload=false`;
                script.onload = () => {
                    try {
                        window.kakao.maps.load(() => {
                            let mapOption = { // 지도를 생성할 떄 필요한 기본 옵션
                                center: new window.kakao.maps.LatLng(37.389710, 126.959340), // 지도의 중심좌표 - 평촌중앙공원
                                level: 3 // 지도의 레벨(확대, 축소 정도)
                            };
                            map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 생성 및 객체 리턴
                            //resolve(places); // 장소 검색 객체 반환
                        });
                    } catch (error) {
                        console.error('카카오맵 API 초기화에 실패했습니다: ', error);
                        reject(error);
                    }
                };
                script.onerror = (error) => {
                    console.error('카카오맵 API 스크립트 로딩에 실패했습니다: ', error);
                    reject(error);
                };
                document.head.appendChild(script);
            } catch (error) {
                console.error('스크립트 요소 생성에 실패했습니다: ', error);
                reject(error);
            }
        });
    };

    // 지도 띄우기
    try {
        // 백엔드에서 JavaScript 키 가져오기
        fetch('/api/kakao-js-key')
            .then(response => response.json())
            .then(data => {
                // 카카오 JavaScript 키
                const appJsKey = data.appJsKey;
                
                // 카카오맵 API 초기화 함수 호출
                initKakaoMap(appJsKey, mapContainer);
            })
            .catch(error => {
                console.error('카카오 JavaScript 키 가져오기에 실패했습니다: ', error);
                reject(error);
            });
            ;
    } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
    };

    // 검색 기능
    mapSearchBtn.addEventListener('click', function() {
        let searchKeyword = mapInputSearch.value;
        if (!searchKeyword.replace(/^\s+|\s+$/g, '')) { //input태그에 값이 비어있거나 공백으로만 되어 있는 경우 검증
            alert('키워드를 입력해주세요.');
            return false;
        }
        searchByKeyword(searchKeyword); // 키워드로 장소 검색
    });

    // 함수 정의 : 키워드로 장소 검색하기 요청
    async function searchByKeyword(keyword, page) {
        try {
            // 페이지 번호가 제공되지 않은 경우 기본값은 1
            if (!page)
                page = 1;

            // 백엔드에서 키워드로 장소 검색하기
            const encodedKeyword = encodeURIComponent(keyword); // keyword 인코딩
            const response = await fetch(`/api/search?keyword=${encodedKeyword}&page=${page}`);
            if (!response.ok) {
                const errorData = response.json();
                throw new Error(`HTTP 에러 상태: ${response.status}, 메시지: ${errorData.message}`);
            }
            const data = await response.json();

            // 검색결과 처리
            displayPlaces(data.documents);
            displayPagination(data.meta);
        } catch (error) {
            console.error('키워드로 장소 검색하기에 실패했습니다: ', error);
        }
    }

    // 함수 정의 : 검색결과 목록과 마커 표출
    function displayPlaces(placesData) {
        try {
            let listFragment = document.createDocumentFragment();
            let bounds = new kakao.maps.LatLngBounds();

            // 검색결과 목록에 추가된 항목들 제거
            removeAllChildNods(listEl);

            // 지도에 표시되어 있는 마커 제거
            removeMarker();

            for (let i=0; i<placesData.length; i++) {
                // 마커를 생성하고 지도에 표시
                let placePosition = new kakao.maps.LatLng(placesData[i].y, placesData[i].x);
                addMarker(placePosition, i); // 마커 생성 및 추가
                let itemEl = getListItem(i, placesData[i]); // 검색 결과 항목 Element 생성

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해 LatLngBounds 객체에 좌표 추가
                bounds.extend(placePosition);

                listFragment.appendChild(itemEl);
            }

            // 검색결과 항목들을 검색결과 목록 Element에 추가
            listEl.appendChild(listFragment);

            // 검색된 장소 위치를 기준으로 지도 범위 재설정
            map.setBounds(bounds);
        } catch (error) {
            console.error('검색 결과 목록 및 마커 표출에 실패했습니다.: ', error);
        }
    }

    // 함수 정의 : 검색결과 항목을 Element로 반환
    function getListItem(index, place) {
        try {
            // let el = document.createElement('li');
            // let itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' + 
            //                 '<div class="info">' + 
            //                     '<h5>' + place.place_name + '</h5>';
            
            // if (place.road_address_name) {
            //     itemStr += '    <span>' + place.road_address_name + '</span>' + 
            //                 '   <span class="jibun gray">' + place.address_name + '</span>';
            // } else {
            //     itemStr += '    <span>' + place.address_name + '</span';
            // }

            // itemStr += '    <span class="tel">' + place.phone + '</span>' +
            //             '</div>';
            
            // el.innerHTML = itemStr;
            // el.className = 'item';

            // return el;

            let el = document.createElement('li');
            el.className = 'item'; // 클래스 이름 추가

            let itemStr = `
                <div class="list-card-container">
                    <div class="marker-number">
                        <span class="markerbg marker_${index + 1}"></span>
                    </div>
                    <div class="place-info">
                        <h5 class="place-name">${place.place_name}</h5>
                        <div class="address">
                            ${place.road_address_name ? `
                                <span class="road-address">${place.road_address_name}</span><br>
                                <span class="jibun gray">${place.address_name}</span>
                            ` : `
                                <span>${place.address_name}</span>
                            `}
                        </div>
                        ${place.phone ? `<span class="tel">${place.phone}</span>` : ''}
                    </div>
                </div>
            `;

            el.innerHTML = itemStr;
            return el;
        } catch (error) {
            console.error('검색결과 항목을 Element로 반환하기에 실패했습니다.: ', error);
        }
    }

    // 함수 정의 : 마커를 생성하고 지도 위에 마커를 표시
    function addMarker(position, idx) {
        try {
            let imgSrc = '/images/marker.png';
            let imgSize = new kakao.maps.Size(36, 37); // 마커 이미지 크기
            let markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize);
            let marker = new kakao.maps.Marker({
                position: position,
                image: markerImg
            });

            marker.setMap(map); // 지도 위에 마커 표출
            markers.push(marker); // 생성된 마커를 배열에 추가

            return marker;

        } catch (error) {
            console.error('마커 생성 및 지도 위에 마커 표시하기에 실패했습니다.: ', error);
        }
    }

    // 함수 정의 : 지도 위에 표시된 마커 모두 제거
    function removeMarker() {
        try {
            for (let i=0; i<markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        } catch (error) {
            console.error('지도 위에 표시된 마커 제거하기에 실패했습니다.: ', error);
        }
    }

    // 함수 정의 : 검색결과 목록 하단에 페이지번호 표시
    function displayPagination(pagination) {
        try {
            let pageFragment = document.createDocumentFragment();

            // 기존에 추가된 페이지번호 삭제
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild(paginationEl.lastChild);
            }

            for (let i=1; i<=pagination.last; i++) {
                let el = document.createElement('a');
                el.href = '#';
                el.innerHTML = i;

                if (i === pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (function(i) {
                        return function() {
                            searchByKeyword(mapInputSearch.value, i); // 페이지 번호를 클릭하면 해당 페이지 검색
                        }
                    })(i);
                }
                pageFragment.appendChild(el);
            };
            paginationEl.appendChild(pageFragment);

        } catch (error) {
            console.error('검색결과 목록 하단에 페이지번호 표시하기에 실패했습니다.: ', error);
        }
    }

    // 함수 정의 : Element의 모든 자식 노드 삭제
    function removeAllChildNods(el) {
        try {
            while (el.hasChildNodes()) {
                el.removeChild (el.lastChild);
            }
        } catch (error) {
            console.error('자식 노드 삭제에 실패했습니다: ', error);
        }
    }
});