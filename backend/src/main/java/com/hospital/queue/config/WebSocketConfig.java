package com.hospital.queue.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to carry messages to clients on destinations prefixed with /topic and /queue
        config.enableSimpleBroker("/topic", "/queue");
        // Designate /app prefix for messages that are bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
        // Set prefix used to identify user destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint allowing SockJS fallback
        registry.addEndpoint("/ws-hospital")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Plain WebSocket endpoint for clients not using SockJS
        registry.addEndpoint("/ws-hospital")
                .setAllowedOriginPatterns("*");
    }
}
