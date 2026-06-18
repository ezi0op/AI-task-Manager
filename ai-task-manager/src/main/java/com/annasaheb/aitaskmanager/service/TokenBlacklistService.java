package com.annasaheb.aitaskmanager.service;
public interface TokenBlacklistService {

	// ✅ Add token to blacklist (logout)
	void blacklistToken(String token);

	// ✅ Check if token is blacklisted
	boolean isBlackListed(String token);
}