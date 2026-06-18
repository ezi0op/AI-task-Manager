package com.annasaheb.aitaskmanager.service;

import java.util.List;

import com.annasaheb.aitaskmanager.dto.response.AdminStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;
import com.annasaheb.aitaskmanager.entity.enums.Role;

public interface AdminService {

	List<UserResponse> getAllUsers();

	UserResponse getUserById(Long userId);

	void deleteUser(Long userId);

	void changeUserRole(Long userId, Role role);

	AdminStatsResponse getAdminStats();

	List<TaskResponse> getAllTasks();

	List<com.annasaheb.aitaskmanager.entity.TaskBlock> getAuditTrail();
}