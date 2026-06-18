package com.annasaheb.aitaskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.annasaheb.aitaskmanager.entity.Task;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByUserAndIsActiveTrue(User user);

	long countByUserAndIsActiveTrue(User user);

	long countByUserAndStatusAndIsActiveTrue(User user, TaskStatus status);

}
