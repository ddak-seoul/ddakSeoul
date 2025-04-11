package com.ddak_seoul.www.ddak_seoul;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    /**
	 * 카카오 JavaScript 키 (application-prod.properties)
	 */
	@Value("${kakao.app.js.key}")
	private String kakaoAppJsKey;
	
    /**
	 * 카카오 REST API 키 (application-prod.properties)
	 */
    @Value("${kakao.app.restapi.key}")
    private String kakaoRestApiKey;


	/**
	 * 카카오 JavaScript 키 조회 - 카카오맵 띄우기
	 * @return Map<String, String>
	 */
	@GetMapping(value = "/api/kakao-js-key")
	public Map<String, String> getKakaoAppJsKey() {
		Map<String, String> response = new HashMap<>();
		response.put("appJsKey", kakaoAppJsKey);
		return response;
	}


    /**
     * 카카오 REST API - 키워드로 장소 검색하기 호출
     * @param keyword
     * @param page (기본값 : 1)
     * @return
     */
    @GetMapping("/api/search")
    public ResponseEntity<?> searchByKeyword(
                    @RequestParam(value="keyword") String keyword,
                    @RequestParam(value="page", required=false, defaultValue = "1") int page) {
        try {
            // 카카오 API 엔드포인트 URL
            String apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json";

            // 직접 URL 생성 (인코딩 X)
            String requestUrl = apiUrl + "?query=" + keyword + "&page=" + page;

            // 요청 헤더 설정 (카카오 REST API 키)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type 설정
            headers.set("Authorization", "KakaoAK " + kakaoRestApiKey); // 인증키 설정
            HttpEntity<?> entity = new HttpEntity<>(headers);

            // 카카오 API 호출
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                    requestUrl,
                    HttpMethod.GET,
                    entity,
                    Map.class);

            // 응답 결과 반환
            return ResponseEntity.ok(response.getBody());


            /* UriComponentsBuilder가 만들어주는 uri 사용하는 방식 > 인코딩 오류 때문에 사용 X (2025-04-11)
             * 
            // // 요청 파라미터 설정
            // //String query = "?query=" + keyword + "&page=" + page;
            // UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
            //         .queryParam("query", keyword)
            //         .queryParam("page", page);

            // // 요청 헤더 설정 (카카오 REST API 키)
            // HttpHeaders headers = new HttpHeaders();
            // headers.setContentType(MediaType.APPLICATION_JSON); // Content-Type 설정
            // headers.set("Authorization", "KakaoAK " + kakaoRestApiKey); // 인증키 설정
            // HttpEntity<?> entity = new HttpEntity<>(headers);

            // // 카카오 API 호출
            // RestTemplate restTemplate = new RestTemplate();
            // ResponseEntity<Map> response = restTemplate.exchange(
            //         builder.toUriString(),
            //         HttpMethod.GET,
            //         entity,
            //         Map.class);

            // // 응답 결과 반환
            // return ResponseEntity.ok(response.getBody());
             */

        } catch (HttpClientErrorException e) {
            // 4xx 클라이언트 에러 처리
            logger.error("카카오 REST API 호출 실패 (클라이언트 에러): " + e.getMessage());
            return ResponseEntity.status(e.getRawStatusCode()).build();
        } catch (HttpServerErrorException e) {
            // 5xx 클라이언트 에러 처리
            logger.error("카카오 REST API 호출 실패 (서버 에러): " + e.getMessage());
            return ResponseEntity.status(e.getRawStatusCode()).build();
        
        } catch (Exception e) {
            // 그 외 에러 처리
            logger.error("카카오 REST API 호출 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
