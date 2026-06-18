package com.annasaheb.aitaskmanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.annasaheb.aitaskmanager.dto.request.TaskRequest;
import com.annasaheb.aitaskmanager.dto.response.ApiResponse;
import com.annasaheb.aitaskmanager.dto.response.DashboardStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;
import com.annasaheb.aitaskmanager.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	@PostMapping
	public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {

		TaskResponse taskResponse = taskService.createTask(request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Task created successfully", taskResponse));

	}

	@GetMapping("/email/{email}")
	public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks(@PathVariable String email) {

		return ResponseEntity.ok(new ApiResponse<>(true, "Tasks fetched successfully", taskService.getAllTasks(email)));
	}

	@GetMapping("/{id}/email/{email}")
	public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id, @PathVariable String email) {

		return ResponseEntity
				.ok(new ApiResponse<>(true, "Task fetched successfully", taskService.getTaskById(id, email)));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Long id,
			@Valid @RequestBody TaskRequest request) {

		return ResponseEntity
				.ok(new ApiResponse<>(true, "Task updated successfully", taskService.updateTask(id, request)));
	}

	@PatchMapping("/{id}/status/{status}/email/{email}")
	public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(@PathVariable Long id,
			@PathVariable TaskStatus status, @PathVariable String email) {

		return ResponseEntity.ok(new ApiResponse<>(true, "Task status updated successfully",
				taskService.updateTaskStatus(id, status, email)));
	}

	@DeleteMapping("/id/{id}/email/{email}")
	public ResponseEntity<ApiResponse<String>> deleteTask(@PathVariable Long id, @PathVariable String email) {

		taskService.deleteTask(id, email);

		return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully", null));
	}

	@GetMapping("/dashboard/{email}")
	public ResponseEntity<ApiResponse<DashboardStatsResponse>> dashboard(@PathVariable String email) {

		return ResponseEntity.ok(
				new ApiResponse<>(true, "Dashboard stats fetched successfully", taskService.getDashboardStats(email)));
	}

}
