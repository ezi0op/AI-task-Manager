package com.annasaheb.aitaskmanager.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.annasaheb.aitaskmanager.dto.request.TaskRequest;
import com.annasaheb.aitaskmanager.dto.response.DashboardStatsResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskResponse;
import com.annasaheb.aitaskmanager.entity.Task;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;
import com.annasaheb.aitaskmanager.repository.TaskRepository;
import com.annasaheb.aitaskmanager.repository.UserRepository;
import com.annasaheb.aitaskmanager.service.TaskService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TaskServiceImpl implements TaskService {

	private final TaskRepository taskRepository;

	private final UserRepository userRepository;

	private final BlockchainServiceImpl blockchainService;

	@Override
	public TaskResponse createTask(TaskRequest request) {
		log.info("Creating task for user: {}", request.getEmail());
		User user = getUserByEmail(request.getEmail());

		Task task = Task.builder().title(request.getTitle()).description(request.getDescription())
				.priority(request.getPriority()).dueDate(request.getDueDate()).user(user).build();

		Task savedTask = taskRepository.save(task);

		blockchainService.addBlock(savedTask.getId(), "TASK_CREATED");

		log.info("Task created successfully with id {}", savedTask.getId());
		return mapToResponse(savedTask);
	}

	@Override
	@Transactional(readOnly = true)
	public List<TaskResponse> getAllTasks(String userEmail) {
		log.info("Fetching all tasks for user {}", userEmail);
		User user = getUserByEmail(userEmail);

		List<TaskResponse> tasks = taskRepository.findByUserAndIsActiveTrue(user).stream().map(this::mapToResponse)
				.toList();

		log.info("Found {} tasks for user {}", tasks.size(), userEmail);

		return tasks;
	}

	@Override
	@Transactional(readOnly = true)
	public TaskResponse getTaskById(Long taskId, String userEmail) {

		log.info("Fetching task {} for user {}", taskId, userEmail);

		Task task = getTaskAndValidateOwner(taskId, userEmail);

		return mapToResponse(task);
	}

	@Override
	public TaskResponse updateTask(Long taskId, TaskRequest request) {
		Task task = getTaskAndValidateOwner(taskId, request.getEmail());

		log.info("Updating task {} for user {}", taskId, request.getEmail());
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setPriority(request.getPriority());
		task.setDueDate(request.getDueDate());
		Task updatedTask = taskRepository.save(task);

		blockchainService.addBlock(taskId, "TASK_UPDATED");

		log.info("Task {} updated successfully", taskId);

		return mapToResponse(updatedTask);

	}

	@Override
	public TaskResponse updateTaskStatus(Long taskId, TaskStatus status, String userEmail) {
		Task task = getTaskAndValidateOwner(taskId, userEmail);
		log.info("Updating task status for task {} to {}", taskId, status);
		task.setStatus(status);
		Task updatedTask = taskRepository.save(task);
		blockchainService.addBlock(taskId, "STATUS_UPDATED_TO_" + status);

		log.info("Task {} status updated successfully", taskId);

		return mapToResponse(updatedTask);

	}

	@Override
	public void deleteTask(Long taskId, String userEmail) {
		Task task = getTaskAndValidateOwner(taskId, userEmail);
		log.info("Soft deleting task {} for user {}", taskId, userEmail);
		task.setActive(false);

		taskRepository.save(task);
		blockchainService.addBlock(taskId, "TASK_DELETED");
		log.info("Task {} deactivated successfully", taskId);
	}

	@Override
	@Transactional(readOnly = true)
	public DashboardStatsResponse getDashboardStats(String userEmail) {

		log.info("Fetching dashboard statistics for user {}", userEmail);

		User user = getUserByEmail(userEmail);

		DashboardStatsResponse response = DashboardStatsResponse.builder()
				.totalTasks(taskRepository.countByUserAndIsActiveTrue(user))
				.todoTasks(taskRepository.countByUserAndStatusAndIsActiveTrue(user, TaskStatus.TODO))
				.inProgressTasks(taskRepository.countByUserAndStatusAndIsActiveTrue(user, TaskStatus.IN_PROGRESS))
				.completedTasks(taskRepository.countByUserAndStatusAndIsActiveTrue(user, TaskStatus.DONE)).build();

		log.info("Dashboard statistics generated successfully for user {}", userEmail);

		return response;
	}

	private User getUserByEmail(String userEmail) {

		log.debug("Fetching user with email {}", userEmail);

		return userRepository.findByEmail(userEmail).orElseThrow(() -> {
			log.error("User not found with email {}", userEmail);
			return new RuntimeException("User not found with email: " + userEmail);
		});
	}

	private Task getTaskAndValidateOwner(Long taskId, String userEmail) {

		log.debug("Validating ownership of task {} for user {}", taskId, userEmail);

		Task task = taskRepository.findById(taskId).orElseThrow(() -> {
			log.error("Task not found with id {}", taskId);
			return new RuntimeException("Task not found with id: " + taskId);
		});

		if (!task.getUser().getEmail().equals(userEmail)) {

			log.warn("Unauthorized access attempt on task {} by user {}", taskId, userEmail);

			throw new RuntimeException("Unauthorized access");
		}

		return task;
	}

	private TaskResponse mapToResponse(Task task) {
		return TaskResponse.builder().id(task.getId()).title(task.getTitle()).description(task.getDescription())
				.priority(task.getPriority()).dueDate(task.getDueDate()).status(task.getStatus())
				.createdAt(task.getCreatedAt()).build();
	}

}
