package com.annasaheb.aitaskmanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.annasaheb.aitaskmanager.dto.request.AiTaskRequest;
import com.annasaheb.aitaskmanager.dto.response.AiTaskResponse;
import com.annasaheb.aitaskmanager.dto.response.ApiResponse;
import com.annasaheb.aitaskmanager.dto.response.SmartSuggestionResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskSummaryResponse;
import com.annasaheb.aitaskmanager.service.AiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

	private final AiService aiService;

	@PostMapping("/generate-task-details")
	public ResponseEntity<ApiResponse<AiTaskResponse>> generateTaskDetails(@RequestBody AiTaskRequest request) {
		AiTaskResponse response = aiService.generateTaskDetails(request.getTitle(), request.getEmail());

		return ResponseEntity.ok(new ApiResponse<>(true, "Task details generated successfully", response));

	}

	@GetMapping("/summary/{email}")
	public ResponseEntity<ApiResponse<TaskSummaryResponse>> generateSummary(@PathVariable String email) {

		TaskSummaryResponse response = aiService.generateSummary(email);

		return ResponseEntity.ok(new ApiResponse<>(true, "Summary generated successfully", response));
	}

	@GetMapping("/suggestions/{email}")
	public ResponseEntity<ApiResponse<List<SmartSuggestionResponse>>> generateSuggestions(@PathVariable String email) {

		List<SmartSuggestionResponse> response = aiService.generateSuggestions(email);

		return ResponseEntity.ok(new ApiResponse<>(true, "Suggestions generated successfully", response));

	}
}
