package com.annasaheb.aitaskmanager.service;

import java.util.List;

import com.annasaheb.aitaskmanager.dto.request.TaskRequest;
import com.annasaheb.aitaskmanager.dto.response.DashboardStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;

public interface TaskService {

	TaskResponse createTask(TaskRequest request);

	List<TaskResponse> getAllTasks(String userEmail);

	TaskResponse getTaskById(Long taskId, String userEmail);

	TaskResponse updateTask(Long taskId, TaskRequest request);

	TaskResponse updateTaskStatus(Long taskId, TaskStatus status, String userEmail);

	void deleteTask(Long taskId, String userEmail);

	DashboardStatsResponse getDashboardStats(String userEmail);
}