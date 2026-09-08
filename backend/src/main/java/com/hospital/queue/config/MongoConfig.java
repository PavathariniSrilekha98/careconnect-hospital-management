package com.hospital.queue.config;

import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.net.InetSocketAddress;
import java.net.Socket;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);
    private static MongoServer server;

    static {
        startInMemoryMongoIfNeeded();
    }

    public static synchronized void startInMemoryMongoIfNeeded() {
        if (!isMongoRunningOnPort(27017)) {
            log.info("No external MongoDB running on port 27017. Starting embedded In-Memory MongoDB server for zero-config execution...");
            try {
                server = new MongoServer(new MemoryBackend());
                server.bind("localhost", 27017);
                log.info("In-Memory MongoDB server successfully listening on localhost:27017");
            } catch (Exception e) {
                log.warn("Could not bind in-memory MongoDB to 27017: {}", e.getMessage());
            }
        } else {
            log.info("Existing MongoDB server detected on port 27017. Connecting to database.");
        }
    }

    private static boolean isMongoRunningOnPort(int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("localhost", port), 250);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PreDestroy
    public void stopServer() {
        if (server != null) {
            log.info("Stopping In-Memory MongoDB server...");
            try {
                server.shutdown();
            } catch (Exception ignored) {}
        }
    }
}
