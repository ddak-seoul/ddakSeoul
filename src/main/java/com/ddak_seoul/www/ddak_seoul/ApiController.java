package com.ddak_seoul.www.ddak_seoul;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", methods = RequestMethod.GET)
public class ApiController {

	@Value("${kakao.map.apikey}")
	private String kakaoMapApiKey;

	@GetMapping(value = "/api/kakao-map-key")
	public Map<String, String> getKakaoMapApiKey() {
		Map<String, String> response = new HashMap<>();
		response.put("apiKey", kakaoMapApiKey);
		return response;
	}
}