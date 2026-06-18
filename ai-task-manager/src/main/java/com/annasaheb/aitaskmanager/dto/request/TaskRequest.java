package com.annasaheb.aitaskmanager.dto.request;

import java.time.LocalDate;

import com.annasaheb.aitaskmanager.entity.enums.TaskPriority;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequest {

	@NotBlank(message = "Title is required")
	private String title;

	private String description;

	@NotBlank(message = "Email is required")
	private String email;

	@NotNull(message = "Priority is required")
	private TaskPriority priority;

	@FutureOrPresent(message = "Due date cannot be in the past")
	private LocalDate dueDate;
}