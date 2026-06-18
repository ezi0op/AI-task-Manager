package com.annasaheb.aitaskmanager.serviceImpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.annasaheb.aitaskmanager.dto.request.ChangePasswordRequest;
import com.annasaheb.aitaskmanager.dto.request.UpdateProfileRequest;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.repository.UserRepository;
import com.annasaheb.aitaskmanager.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	@Override
	public UserResponse getProfile(String email) {
		log.info("Fetching profile for user {}", email);

		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.error("User with email {} not found", email);
			return new RuntimeException("User not found");
		});
		return mapToResponse(user);
	}

	@Override
	public UserResponse updateProfile(String email, UpdateProfileRequest request) {

		log.info("Updating profile for user {}", email);
		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.error("User with email {} not found", email);
			return new RuntimeException("User not found");
		});
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setImage(request.getImage());

		User updatedUser = userRepository.save(user);
		log.info("Profile updated successfully for user {}", email);
		return mapToResponse(updatedUser);
	}

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {
		log.info("Password change requested for user {}", email);

		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.error("User not found with email {}", email);
			return new RuntimeException("User not found");
		});

		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {

			throw new RuntimeException("Current password incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

		log.info("Password changed successfully for user {}", email);
	}

	@Override
	public void deleteAccount(String email) {

		log.info("Deactivating account for user {}", email);

		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.error("User not found with email {}", email);
			return new RuntimeException("User not found");
		});

		user.setActive(false);

		userRepository.save(user);

		log.info("Account deactivated successfully for user {}", email);
	}

	private UserResponse mapToResponse(User user) {

		return UserResponse.builder().id(user.getId()).image(user.getImage()).name(user.getName()).email(user.getEmail()).role(user.getRole())
				.isActive(user.isActive()).createdAt(user.getCreatedAt()).build();
	}

}
