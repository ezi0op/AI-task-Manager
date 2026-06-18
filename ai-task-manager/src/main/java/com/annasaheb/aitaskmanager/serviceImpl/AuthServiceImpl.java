package com.annasaheb.aitaskmanager.serviceImpl;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.annasaheb.aitaskmanager.dto.request.LoginRequest;
import com.annasaheb.aitaskmanager.dto.request.RegisterRequest;
import com.annasaheb.aitaskmanager.dto.response.AuthResponse;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.entity.enums.Role;
import com.annasaheb.aitaskmanager.repository.UserRepository;
import com.annasaheb.aitaskmanager.security.util.JWTUtil;
import com.annasaheb.aitaskmanager.service.AuthService;
import com.annasaheb.aitaskmanager.service.TokenBlacklistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JWTUtil jwtUtil;

	private final TokenBlacklistService tokenBlacklistService;

	@Override
	public AuthResponse register(RegisterRequest request) {

		log.info("Registration request received for email: {}", request.getEmail());

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		User user = User.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).image(request.getImage()).role(Role.USER).isActive(true).build();

		User savedUser = userRepository.save(user);

		String token = jwtUtil.generateToken(savedUser.getEmail());

		log.info("User registered successfully: {}", savedUser.getEmail());

		return AuthResponse.builder().token(token).email(savedUser.getEmail()).role(savedUser.getRole().name()).build();
	}

	@Override
	public AuthResponse login(LoginRequest request) {

		log.info("Login request for email: {}", request.getEmail());

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BadCredentialsException("Invalid email or password");
		}

		String token = jwtUtil.generateToken(user.getEmail());

		log.info("User logged in successfully: {}", user.getEmail());

		return AuthResponse.builder().token(token).email(user.getEmail()).role(user.getRole().name()).build();
	}

	@Override
	public void logout(String token) {
		log.info("Logout request received");

		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		tokenBlacklistService.blacklistToken(token);

		log.info("User logged out successfully");

	}

}
