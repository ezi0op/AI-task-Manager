package com.annasaheb.aitaskmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.annasaheb.aitaskmanager.dto.request.ChangePasswordRequest;
import com.annasaheb.aitaskmanager.dto.request.UpdateProfileRequest;
import com.annasaheb.aitaskmanager.dto.response.ApiResponse;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;
import com.annasaheb.aitaskmanager.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/profile/{email}")
	public ResponseEntity<ApiResponse<UserResponse>> getProfile(@PathVariable String email) {

		return ResponseEntity
				.ok(new ApiResponse<>(true, "Profile fetched successfully", userService.getProfile(email)));
	}

	@PutMapping("/profile/{email}")
	public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@PathVariable String email,
			@Valid @RequestBody UpdateProfileRequest request) {

		return ResponseEntity
				.ok(new ApiResponse<>(true, "Profile updated successfully", userService.updateProfile(email, request)));
	}

	@PutMapping("/change-password/{email}")
	public ResponseEntity<ApiResponse<String>> changePassword(@PathVariable String email,
			@Valid @RequestBody ChangePasswordRequest request) {

		userService.changePassword(email, request);

		return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
	}

	@DeleteMapping("/{email}")
	public ResponseEntity<ApiResponse<String>> deleteAccount(@PathVariable String email) {

		userService.deleteAccount(email);

		return ResponseEntity.ok(new ApiResponse<>(true, "Account deleted successfully", null));
	}
}