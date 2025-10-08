package dev.doomsday.suitX;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SuitXApplication {

	public static void main(String[] args) {
		SpringApplication.run(SuitXApplication.class, args);
	}

}
