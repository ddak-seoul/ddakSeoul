package com.ddak_seoul.www.ddak_seoul;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "*", methods = RequestMethod.GET)
public class HomeController {
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String redirectIndex() {
		return "forward:/index.html";
	}
	
	@RequestMapping(value = "/server-time", method = RequestMethod.GET)
	@ResponseBody
	public String getServerTime(Locale locale) {
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		String formattedDate = dateFormat.format(date);
		
		return "{\"serverTime\" : \"" + formattedDate + "\"}";
	}
}