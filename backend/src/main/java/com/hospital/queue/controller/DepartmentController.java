package com.hospital.queue.controller;

import com.hospital.queue.dto.ApiResponse;
import com.hospital.queue.dto.DepartmentDto;
import com.hospital.queue.security.UserPrincipal;
import com.hospital.queue.service.DepartmentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments(
            @RequestParam(required = false, defaultValue = "false") boolean onlyActive) {
        List<DepartmentDto> list = departmentService.getAllDepartments(onlyActive);
        return ResponseEntity.ok(ApiResponse.ok("Departments fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable String id) {
        DepartmentDto dept = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Department fetched successfully", dept));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(
            @Valid @RequestBody DepartmentDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        DepartmentDto created = departmentService.createDepartment(dto, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDto>> updateDepartment(
            @PathVariable String id,
            @Valid @RequestBody DepartmentDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        DepartmentDto updated = departmentService.updateDepartment(id, dto, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request) {
        departmentService.deleteDepartment(id, currentUser.getId(), currentUser.getEmail(), request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.ok("Department deactivated successfully", null));
    }
}
