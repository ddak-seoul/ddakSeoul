package com.ddak_seoul.www.ddak_seoul;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@CrossOrigin(origins = "*", methods = RequestMethod.GET)
public class MapController {
	
	/**
	 * 지도화면 표출
	 */
	@GetMapping(value = "/map")
	public String viewMap() {
		return "forward:/map.html";
	}

	// @GetMapping(value = "/map")
	// public RedirectView viewMap() {
	// 	RedirectView redirectView = new RedirectView();
	// 	redirectView.setUrl("/map.html"); // HTML 파일 경로
	// 	return redirectView;
	// }
}