package com.annasaheb.aitaskmanager.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.annasaheb.aitaskmanager.entity.enums.TaskPriority;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

	private Long id;

	private String title;

	private String description;

	private TaskPriority priority;

	private TaskStatus status;

	private LocalDate dueDate;

	private LocalDateTime createdAt;

	private String userEmail;

	private String userName;
}