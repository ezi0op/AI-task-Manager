package com.annasaheb.aitaskmanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.annasaheb.aitaskmanager.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findByEmailAndIsActiveTrue(String email);

	boolean existsByEmailAndIsActiveTrue(String email);

	boolean existsByEmail(String email);

}
