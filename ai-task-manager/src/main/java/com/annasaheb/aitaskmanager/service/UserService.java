package com.annasaheb.aitaskmanager.service;

import com.annasaheb.aitaskmanager.dto.request.ChangePasswordRequest;
import com.annasaheb.aitaskmanager.dto.request.UpdateProfileRequest;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;

public interface UserService {

public	UserResponse getProfile(String email);

public	UserResponse updateProfile(String email, UpdateProfileRequest request);

	void changePassword(String email, ChangePasswordRequest request);

	void deleteAccount(String email);
}