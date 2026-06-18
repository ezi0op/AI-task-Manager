package com.annasaheb.aitaskmanager.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.annasaheb.aitaskmanager.entity.enums.TaskPriority;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Title is required")
	@Column(nullable = false, length = 100)
	private String title;

	@Column(length = 1000)
	private String description;

	@NotNull(message = "Priority is required")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskPriority priority;

	@FutureOrPresent(message = "Due date cannot be in the past")
	private LocalDate dueDate;
	
	@Column(nullable = false)
	@Builder.Default
	private boolean isActive = true;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private TaskStatus status = TaskStatus.TODO;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private User user;

}
