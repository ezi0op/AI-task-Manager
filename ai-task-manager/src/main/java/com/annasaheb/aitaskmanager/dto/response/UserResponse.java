package com.annasaheb.aitaskmanager.dto.response;

import java.time.LocalDateTime;

import com.annasaheb.aitaskmanager.entity.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

	private Long id;

	private String name;

	private String email;

	private String image;
	
	private Role role;

	private boolean isActive;
	
	private LocalDateTime createdAt;
}