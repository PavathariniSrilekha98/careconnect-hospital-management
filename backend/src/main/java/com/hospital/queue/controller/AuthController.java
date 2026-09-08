package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.AuthRequest;
import com.hospital.queue.dto.AuthResponse;
import com.hospital.queue.dto.RegisterRequest;
import com.hospital.queue.dto.UserDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        AuthResponse response = authService.register(request, ip);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        AuthResponse response = authService.login(request, ip);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto profile = authService.getCurrentUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Current user profile", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserDto dto) {
        UserDto updated = authService.updateProfile(currentUser.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
