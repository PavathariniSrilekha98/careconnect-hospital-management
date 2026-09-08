package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.UserDto;
import com.hospital.queue.model.Role;
import com.hospital.queue.model.User;
import com.hospital.queue.repository.UserRepository;
import com.hospital.queue.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search) {
        List<User> users;
        if (role != null) {
            users = userRepository.findByRole(role);
        } else if (search != null && !search.isBlank()) {
            users = userRepository.findByFullNameContainingIgnoreCase(search);
        } else {
            users = userRepository.findAll();
        }

        List<UserDto> dtos = users.stream().map(authService::mapToUserDto).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Users fetched", dtos));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserDto>> toggleStatus(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        user.setActive(!user.isActive());
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("User status updated", authService.mapToUserDto(saved)));
    }
}
