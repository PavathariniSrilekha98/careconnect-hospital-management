package com.hospital.queue.service;

import com.hospital.queue.dto.DepartmentDto;
import com.hospital.queue.exception.BadRequestException;
import com.hospital.queue.exception.ResourceNotFoundException;
import com.hospital.queue.model.Department;
import com.hospital.queue.model.QueueStatus;
import com.hospital.queue.repository.DepartmentRepository;
import com.hospital.queue.repository.DoctorRepository;
import com.hospital.queue.repository.QueueTicketRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final AuditLogService auditLogService;

    public DepartmentService(DepartmentRepository departmentRepository,
                             DoctorRepository doctorRepository,
                             QueueTicketRepository queueTicketRepository,
                             AuditLogService auditLogService) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.auditLogService = auditLogService;
    }

    public List<DepartmentDto> getAllDepartments(boolean onlyActive) {
        List<Department> list = onlyActive ? departmentRepository.findByActiveTrue() : departmentRepository.findAll();
        LocalDate today = LocalDate.now();

        return list.stream().map(dept -> {
            long docCount = doctorRepository.findByDepartmentIdAndActiveTrue(dept.getId()).size();
            long queueCount = queueTicketRepository.countByDepartmentIdAndQueueDateAndStatus(dept.getId(), today, QueueStatus.WAITING);

            return DepartmentDto.builder()
                    .id(dept.getId())
                    .name(dept.getName())
                    .code(dept.getCode())
                    .description(dept.getDescription())
                    .icon(dept.getIcon())
                    .roomBlock(dept.getRoomBlock())
                    .active(dept.isActive())
                    .doctorCount(docCount)
                    .activeQueueCount(queueCount)
                    .createdAt(dept.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    public DepartmentDto getDepartmentById(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        LocalDate today = LocalDate.now();
        long docCount = doctorRepository.findByDepartmentIdAndActiveTrue(dept.getId()).size();
        long queueCount = queueTicketRepository.countByDepartmentIdAndQueueDateAndStatus(dept.getId(), today, QueueStatus.WAITING);

        return DepartmentDto.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .icon(dept.getIcon())
                .roomBlock(dept.getRoomBlock())
                .active(dept.isActive())
                .doctorCount(docCount)
                .activeQueueCount(queueCount)
                .createdAt(dept.getCreatedAt())
                .build();
    }

    public DepartmentDto createDepartment(DepartmentDto dto, String adminUserId, String adminEmail, String ipAddress) {
        if (departmentRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Department name already exists: " + dto.getName());
        }
        if (departmentRepository.existsByCodeIgnoreCase(dto.getCode())) {
            throw new BadRequestException("Department code already exists: " + dto.getCode());
        }

        Department department = Department.builder()
                .name(dto.getName().trim())
                .code(dto.getCode().trim().toUpperCase())
                .description(dto.getDescription())
                .icon(dto.getIcon() != null ? dto.getIcon() : "Activity")
                .roomBlock(dto.getRoomBlock())
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Department saved = departmentRepository.save(department);

        auditLogService.log(
                adminUserId,
                adminEmail,
                "ADMIN",
                "DEPARTMENT_CREATED",
                "Department",
                saved.getId(),
                "Created department " + saved.getName() + " (" + saved.getCode() + ")",
                ipAddress
        );

        return getDepartmentById(saved.getId());
    }

    public DepartmentDto updateDepartment(String id, DepartmentDto dto, String adminUserId, String adminEmail, String ipAddress) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        if (dto.getName() != null && !dto.getName().equalsIgnoreCase(department.getName())) {
            if (departmentRepository.existsByNameIgnoreCase(dto.getName())) {
                throw new BadRequestException("Department name already in use: " + dto.getName());
            }
            department.setName(dto.getName().trim());
        }

        if (dto.getCode() != null && !dto.getCode().equalsIgnoreCase(department.getCode())) {
            if (departmentRepository.existsByCodeIgnoreCase(dto.getCode())) {
                throw new BadRequestException("Department code already in use: " + dto.getCode());
            }
            department.setCode(dto.getCode().trim().toUpperCase());
        }

        if (dto.getDescription() != null) department.setDescription(dto.getDescription());
        if (dto.getIcon() != null) department.setIcon(dto.getIcon());
        if (dto.getRoomBlock() != null) department.setRoomBlock(dto.getRoomBlock());
        department.setActive(dto.isActive());
        department.setUpdatedAt(Instant.now());

        Department updated = departmentRepository.save(department);

        auditLogService.log(
                adminUserId,
                adminEmail,
                "ADMIN",
                "DEPARTMENT_UPDATED",
                "Department",
                updated.getId(),
                "Updated department " + updated.getName(),
                ipAddress
        );

        return getDepartmentById(updated.getId());
    }

    public void deleteDepartment(String id, String adminUserId, String adminEmail, String ipAddress) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        department.setActive(false);
        department.setUpdatedAt(Instant.now());
        departmentRepository.save(department);

        auditLogService.log(
                adminUserId,
                adminEmail,
                "ADMIN",
                "DEPARTMENT_DEACTIVATED",
                "Department",
                department.getId(),
                "Deactivated department " + department.getName(),
                ipAddress
        );
    }
}
