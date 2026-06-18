package com.annasaheb.aitaskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.annasaheb.aitaskmanager.entity.BlacklistedToken;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

	boolean existsByToken(String token);

	

}
