package com.annasaheb.aitaskmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.annasaheb.aitaskmanager.dto.request.LoginRequest;
import com.annasaheb.aitaskmanager.dto.request.RegisterRequest;
import com.annasaheb.aitaskmanager.dto.response.ApiResponse;
import com.annasaheb.aitaskmanager.dto.response.AuthResponse;
import com.annasaheb.aitaskmanager.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {

		return ResponseEntity
				.ok(new ApiResponse<>(true, "User registered successfully", authService.register(request)));
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {

		return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authService.login(request)));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String authHeader) {

		String token = authHeader.substring(7);

		authService.logout(token);

		return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful", null));
	}
}