package com.ddak_seoul.www.ddak_seoul;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@CrossOrigin(origins = "*", methods = RequestMethod.GET)
public class MapController {
	
	@RequestMapping(value = "/map", method = RequestMethod.GET)
	public String viewMap() {
		return "forward:/map.html";
	}
}