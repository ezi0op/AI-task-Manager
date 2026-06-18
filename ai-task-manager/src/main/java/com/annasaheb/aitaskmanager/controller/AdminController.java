package com.annasaheb.aitaskmanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.annasaheb.aitaskmanager.dto.response.AdminStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.ApiResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;
import com.annasaheb.aitaskmanager.entity.TaskBlock;
import com.annasaheb.aitaskmanager.entity.enums.Role;
import com.annasaheb.aitaskmanager.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Admin statistics fetched successfully",
                        adminService.getAdminStats()));
    }

    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Tasks fetched successfully",
                        adminService.getAllTasks()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users fetched successfully",
                        adminService.getAllUsers()));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User fetched successfully",
                        adminService.getUserById(userId)));
    }

    @DeleteMapping("/users/{userId}")	
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable Long userId) {

        adminService.deleteUser(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User deleted successfully",
                        null));
    }

    @PatchMapping("/users/{userId}/role/{role}")
    public ResponseEntity<ApiResponse<String>> changeUserRole(
            @PathVariable Long userId,
            @PathVariable Role role) {

        adminService.changeUserRole(userId, role);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User role updated successfully",
                        null));
    }

    @GetMapping("/audit-trail")
    public ResponseEntity<ApiResponse<List<TaskBlock>>> getAuditTrail() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Blockchain audit trail fetched successfully",
                        adminService.getAuditTrail()));
    }
}