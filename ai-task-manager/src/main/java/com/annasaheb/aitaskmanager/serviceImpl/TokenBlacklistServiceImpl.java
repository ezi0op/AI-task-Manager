package com.annasaheb.aitaskmanager.serviceImpl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.annasaheb.aitaskmanager.entity.BlacklistedToken;
import com.annasaheb.aitaskmanager.repository.BlacklistedTokenRepository;
import com.annasaheb.aitaskmanager.service.TokenBlacklistService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

	private final BlacklistedTokenRepository blacklistedTokenRepository;

	@Override
	public void blacklistToken(String token) {

		log.info("Blacklisting token");
		if (!blacklistedTokenRepository.existsByToken(token)) {
			BlacklistedToken blacklistedToken = BlacklistedToken.builder().token(token)
					.blacklistedAt(LocalDateTime.now()).build();

			blacklistedTokenRepository.save(blacklistedToken);
			log.info("Token added to blacklist");
		}

	}

	@Override
	public boolean isBlackListed(String token) {

		return blacklistedTokenRepository.existsByToken(token);
	}

}
