package com.hospital.queue;

import com.hospital.queue.config.MongoConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class HospitalQueueApplication {

    public static void main(String[] args) {
        MongoConfig.startInMemoryMongoIfNeeded();
        SpringApplication.run(HospitalQueueApplication.class, args);
    }
}
