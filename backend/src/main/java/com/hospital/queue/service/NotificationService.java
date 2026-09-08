package com.hospital.queue.service;

import com.hospital.queue.dto.NotificationDto;
import com.hospital.queue.model.Notification;
import com.hospital.queue.repository.NotificationRepository;
import com.hospital.queue.util.AppConstants;
import com.hospital.queue.websocket.WebSocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public NotificationDto createAndSendNotification(String recipientId, String title, String message, String type, String referenceId, String tokenNumber, String roomNumber) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .tokenNumber(tokenNumber)
                .roomNumber(roomNumber)
                .isRead(false)
                .createdAt(Instant.now())
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);

        // Send real-time notification over WebSocket
        try {
            String destination = AppConstants.TOPIC_USER_NOTIFICATIONS + recipientId;
            WebSocketMessage<NotificationDto> wsMsg = WebSocketMessage.<NotificationDto>builder()
                    .type(AppConstants.EVENT_PATIENT_NOTIFICATION)
                    .tokenNumber(tokenNumber)
                    .roomNumber(roomNumber)
                    .message(message)
                    .payload(dto)
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(destination, wsMsg);
            log.info("Dispatched WebSocket notification to recipient: {}", recipientId);
        } catch (Exception e) {
            log.warn("Failed to dispatch WebSocket notification: {}", e.getMessage());
        }

        return dto;
    }

    public List<NotificationDto> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markAsRead(String notificationId, String userId) {
        notificationRepository.findById(notificationId).ifPresent(notif -> {
            if (notif.getRecipientId().equals(userId)) {
                notif.setRead(true);
                notificationRepository.save(notif);
            }
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationDto mapToDto(Notification notif) {
        return NotificationDto.builder()
                .id(notif.getId())
                .recipientId(notif.getRecipientId())
                .title(notif.getTitle())
                .message(notif.getMessage())
                .type(notif.getType())
                .referenceId(notif.getReferenceId())
                .tokenNumber(notif.getTokenNumber())
                .roomNumber(notif.getRoomNumber())
                .isRead(notif.isRead())
                .createdAt(notif.getCreatedAt())
                .build();
    }
}
