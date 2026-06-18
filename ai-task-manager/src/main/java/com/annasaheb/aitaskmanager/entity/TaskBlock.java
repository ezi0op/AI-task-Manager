package com.annasaheb.aitaskmanager.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_blockchain")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskBlock {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long taskId;

	private String action;

	private String currentHash;

	private String previousHash;

	@CreationTimestamp
	private LocalDateTime createdAt;
}