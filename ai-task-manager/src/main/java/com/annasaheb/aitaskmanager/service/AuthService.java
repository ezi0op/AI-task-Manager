package com.annasaheb.aitaskmanager.service;

import com.annasaheb.aitaskmanager.dto.request.LoginRequest;
import com.annasaheb.aitaskmanager.dto.request.RegisterRequest;
import com.annasaheb.aitaskmanager.dto.response.AuthResponse;

public interface AuthService {

	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request);

	void logout(String token);
}