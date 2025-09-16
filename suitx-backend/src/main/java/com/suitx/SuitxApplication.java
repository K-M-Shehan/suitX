package com.suitx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SuitxApplication {
    public static void main(String[] args) {
        SpringApplication.run(SuitxApplication.class, args);
    }
}