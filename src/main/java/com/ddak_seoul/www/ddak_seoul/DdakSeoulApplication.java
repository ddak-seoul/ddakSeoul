package com.ddak_seoul.www.ddak_seoul;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@ComponentScan(basePackages = "com.ddak_seoul.www.ddak_seoul")
public class DdakSeoulApplication {

	public static void main(String[] args) {
		SpringApplication.run(DdakSeoulApplication.class, args);
	}

}
