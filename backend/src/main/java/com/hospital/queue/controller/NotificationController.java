package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.NotificationDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        List<NotificationDto> list = unreadOnly
                ? notificationService.getUnreadNotificationsForUser(currentUser.getId())
                : notificationService.getNotificationsForUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched", list));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotificationsAlias(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        List<NotificationDto> list = unreadOnly
                ? notificationService.getUnreadNotificationsForUser(currentUser.getId())
                : notificationService.getNotificationsForUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched", list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Unread count fetched", Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}
