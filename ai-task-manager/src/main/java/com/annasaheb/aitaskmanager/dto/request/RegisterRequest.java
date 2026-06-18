package com.annasaheb.aitaskmanager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

	@NotBlank(message = "Name is required")
	@Size(min = 3, max = 50)
	private String name;

	@NotBlank(message = "Email is required")
	@Email
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 8, max = 20)
	private String password;
	
	@Size(max = 1000, message = "Image URL must be less than 1000 characters")
	private String image;
}