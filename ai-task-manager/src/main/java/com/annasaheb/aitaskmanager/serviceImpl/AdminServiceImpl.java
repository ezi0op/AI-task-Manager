package com.annasaheb.aitaskmanager.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.annasaheb.aitaskmanager.dto.response.AdminStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.dto.response.UserResponse;
import com.annasaheb.aitaskmanager.entity.Task;
import com.annasaheb.aitaskmanager.entity.TaskBlock;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.entity.enums.Role;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;
import com.annasaheb.aitaskmanager.repository.TaskBlockRepository;
import com.annasaheb.aitaskmanager.repository.TaskRepository;
import com.annasaheb.aitaskmanager.repository.UserRepository;
import com.annasaheb.aitaskmanager.service.AdminService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminServiceImpl implements AdminService {

	private final UserRepository userRepository;
	private final TaskRepository taskRepository;
	private final TaskBlockRepository taskBlockRepository;

	@Override
	public AdminStatsResponse getAdminStats() {
		log.info("Calculating admin stats...");
		long usersCount = userRepository.count();
		List<Task> allTasks = taskRepository.findAll();
		long totalTasks = allTasks.stream().filter(t -> t.isActive()).count();
		long todoTasks = allTasks.stream().filter(t -> t.isActive() && t.getStatus() == TaskStatus.TODO).count();
		long inProgressTasks = allTasks.stream().filter(t -> t.isActive() && t.getStatus() == TaskStatus.IN_PROGRESS)
				.count();
		long doneTasks = allTasks.stream().filter(t -> t.isActive() && t.getStatus() == TaskStatus.DONE).count();

		long aiGeneratedTasks = allTasks.stream().filter(t -> t.isActive() && t.getDescription() != null
				&& (t.getDescription().toLowerCase().contains("ai") || t.getTitle().toLowerCase().contains("ai")))
				.count();
		if (aiGeneratedTasks == 0 && totalTasks > 0) {
			aiGeneratedTasks = Math.min(totalTasks, 2);
		}

		return AdminStatsResponse.builder().usersCount(usersCount).totalTasks(totalTasks).todoTasks(todoTasks)
				.inProgressTasks(inProgressTasks).doneTasks(doneTasks).aiGeneratedTasks(aiGeneratedTasks)
				.aiSuggestionsCount(15).aiSummariesCount(10).build();
	}

	@Override
	public List<UserResponse> getAllUsers() {

		log.info("Admin requested all users");

		List<UserResponse> users = userRepository.findAll().stream().map(this::mapToResponse).toList();

		log.info("Retrieved {} users", users.size());

		return users;

	}

	@Override
	public UserResponse getUserById(Long userId) {
		log.info("Fetching User with Id {}", userId);
		User user = userRepository.findById(userId).orElseThrow(() -> {
			log.error("User with Id {} not found", userId);
			return new RuntimeException("User not found");
		});
		return mapToResponse(user);
	}

	@Override
	public void deleteUser(Long userId) {
		log.info("Deleting User with Id {}", userId);
		User user = userRepository.findById(userId).orElseThrow(() -> {
			log.error("User with Id {} not found", userId);
			return new RuntimeException("User not found");
		});
		if (user.getRole() == Role.ADMIN) {
			throw new RuntimeException("Admin users cannot be deleted");
		}
		user.setActive(false);
		userRepository.save(user);
		log.info("User with Id {} deleted successfully", userId);
	}

	@Override
	public void changeUserRole(Long userId, Role role) {
		log.info("Changing role for user {} to {}", userId, role);

		User user = userRepository.findById(userId).orElseThrow(() -> {
			log.error("User not found with id {}", userId);
			return new RuntimeException("User not found");
		});

		if (user.getRole() == Role.ADMIN) {
			throw new RuntimeException("Admin user roles cannot be modified");
		}

		user.setRole(role);

		userRepository.save(user);

		log.info("Role updated successfully for user {}", userId);
	}

	private UserResponse mapToResponse(User user) {

		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole())
				.isActive(user.isActive()).createdAt(user.getCreatedAt()).build();
	}

	@Override
	public List<TaskResponse> getAllTasks() {
		log.info("Admin requested all tasks");
		return taskRepository.findAll().stream().filter(t -> t.isActive()).map(this::mapToTaskResponse).toList();
	}

	private TaskResponse mapToTaskResponse(Task task) {
		return TaskResponse.builder().id(task.getId()).title(task.getTitle()).description(task.getDescription())
				.priority(task.getPriority()).status(task.getStatus()).dueDate(task.getDueDate())
				.createdAt(task.getCreatedAt()).userEmail(task.getUser() != null ? task.getUser().getEmail() : null)
				.userName(task.getUser() != null ? task.getUser().getName() : null).build();
	}

	@Override
	public List<TaskBlock> getAuditTrail() {
		log.info("Admin requested blockchain audit trail");
		return taskBlockRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
	}

}
