package com.annasaheb.aitaskmanager.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.annasaheb.aitaskmanager.security.util.JWTUtil;
import com.annasaheb.aitaskmanager.service.TokenBlacklistService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JWTUtil jwtUtil;

	private final UserDetailsService userDetailsService;

	private final TokenBlacklistService tokenBlacklistService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);

			if (tokenBlacklistService.isBlackListed(token)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("Token has been logged out");
				return;
			}
			
			try {
				String email=jwtUtil.extractEmail(token);
				if(email!=null&&SecurityContextHolder.getContext().getAuthentication()==null) {
					UserDetails userDetails=userDetailsService.loadUserByUsername(email);
					if(jwtUtil.validateToken(token)) {
						UsernamePasswordAuthenticationToken auth=new UsernamePasswordAuthenticationToken(userDetails, null,userDetails.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(auth);
					
					}
				}
			} catch (Exception e) {
				System.out.println("JWT validation failed: " + e.getMessage());
			}
			
			
			
		}
		filterChain.doFilter(request, response);

	}

}
