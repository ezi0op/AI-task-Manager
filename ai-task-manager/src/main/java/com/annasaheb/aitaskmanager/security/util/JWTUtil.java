package com.annasaheb.aitaskmanager.security.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

	@Value("${jwt.secret:MckIpShKAHjg1PNRJxaaxTrrWOuxJAFoa5Ca9vHSjD5}")
	private String SECRET_KEY;

	private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

	// Convert into byte Stream and then into SecretKey using Keys.hmacShaKeyFor()
	// method.
	private SecretKey getKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(java.nio.charset.StandardCharsets.UTF_8));
	}

	// Generate JWT token
	public String generateToken(String email) {
		return Jwts.builder().subject(email).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(getKey()).compact();
	}

	// extract email
	public String extractEmail(String token) {
		return getClaims(token).getSubject();
	}

	// validate Token
	public boolean validateToken(String token) {
		return getClaims(token).getExpiration().after(new Date());
	}

	// ✅ Parse Claims
	private Claims getClaims(String token) {
		return Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();

	}

}
