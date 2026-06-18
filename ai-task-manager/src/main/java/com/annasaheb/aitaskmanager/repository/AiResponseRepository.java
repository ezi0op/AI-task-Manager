package com.annasaheb.aitaskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.annasaheb.aitaskmanager.entity.AiResponse;
import com.annasaheb.aitaskmanager.entity.User;

@Repository
public interface AiResponseRepository extends JpaRepository<AiResponse, Long> {

	List<AiResponse> findByUserOrderByCreatedAtDesc(User user);

}
