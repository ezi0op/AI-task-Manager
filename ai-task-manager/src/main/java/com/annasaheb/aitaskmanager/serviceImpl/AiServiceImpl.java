package com.annasaheb.aitaskmanager.serviceImpl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.annasaheb.aitaskmanager.dto.response.AiTaskResponse;
import com.annasaheb.aitaskmanager.dto.response.SmartSuggestionResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskSummaryResponse;
import com.annasaheb.aitaskmanager.entity.AiResponse;
import com.annasaheb.aitaskmanager.entity.Task;
import com.annasaheb.aitaskmanager.entity.User;
import com.annasaheb.aitaskmanager.entity.enums.TaskPriority;
import com.annasaheb.aitaskmanager.entity.enums.TaskStatus;
import com.annasaheb.aitaskmanager.repository.AiResponseRepository;
import com.annasaheb.aitaskmanager.repository.TaskRepository;
import com.annasaheb.aitaskmanager.repository.UserRepository;
import com.annasaheb.aitaskmanager.service.AiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

	private final ChatClient chatClient;

	private final ObjectMapper objectMapper;

	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final AiResponseRepository aiResponseRepository;

	@Override
	public AiTaskResponse generateTaskDetails(String title, String email) {
		try {
			LocalDate today = LocalDate.now();
			String prompt = """
					Task Title: %s
					Current Date: %s

					Analyze the Task Title and any implied date keywords (e.g. 'tomorrow', 'next week', 'by June 28th', 'fir 28 jube') to determine the correct due date.
					If the title mentions a specific date or relative time (like 'tomorrow'), calculate the exact date in 'YYYY-MM-DD' format relative to the Current Date (%s).
					If no time frame is mentioned in the title, default the due date to exactly 7 days from the Current Date.

					Generate:
					1. Description
					2. Suggested Priority (LOW, MEDIUM, HIGH)
					3. Estimated Effort
					4. Due Date (in YYYY-MM-DD format)

					Return ONLY valid JSON.

					Example:

					{
					  "description": "Create presentation slides",
					  "priority": "HIGH",
					  "estimatedEffort": "4 Hours",
					  "dueDate": "2026-06-25"
					}
					""".formatted(title, today, today);

			String response = chatClient.prompt().user(prompt).call().content();

			log.info("AI response: {}", response);
			JsonNode json = objectMapper.readTree(response);

			String dueDate = json.has("dueDate") ? json.get("dueDate").asText() : today.plusDays(7).toString();

			AiTaskResponse taskResponse = AiTaskResponse.builder()
					.description(json.get("description").asText())
					.priority(TaskPriority.valueOf(json.get("priority").asText().toUpperCase()))
					.estimatedEffort(json.get("estimatedEffort").asText())
					.dueDate(dueDate)
					.build();

			try {
				User user = null;
				if (email != null && !email.trim().isEmpty()) {
					user = userRepository.findByEmail(email).orElse(null);
				}
				AiResponse aiResponse = AiResponse.builder()
						.user(user)
						.prompt(title)
						.description(taskResponse.getDescription())
						.priority(taskResponse.getPriority())
						.estimatedEffort(taskResponse.getEstimatedEffort())
						.build();
				aiResponseRepository.save(aiResponse);
				log.info("Stored AI Task response for user: {}", email);
			} catch (Exception dbEx) {
				log.error("Failed to store AI task response in database", dbEx);
			}

			return taskResponse;
		} catch (Exception e) {
			log.error("Error generating task details", e);

			return AiTaskResponse.builder().description("Unable to generate description").priority(TaskPriority.MEDIUM)
					.estimatedEffort("Unknown").build();
		}

	}

	@Override
	public TaskSummaryResponse generateSummary(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		List<Task> tasks = taskRepository.findByUserAndIsActiveTrue(user);

		long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();

		long pending = tasks.stream().filter(t -> t.getStatus() != TaskStatus.DONE).count();

		String prompt = """
				Generate a productivity summary.

				Total Tasks: %d
				Completed Tasks: %d
				Pending Tasks: %d

				Keep it short and professional.
				""".formatted(tasks.size(), completed, pending);

		String summary = chatClient.prompt().user(prompt).call().content();

		return TaskSummaryResponse.builder().summary(summary).completedTasks(completed).pendingTasks(pending).build();

	}

	@Override
	public List<SmartSuggestionResponse> generateSuggestions(String email) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		List<Task> tasks = taskRepository.findByUserAndIsActiveTrue(user);

		StringBuilder taskData = new StringBuilder();
		for (Task task : tasks) {
			taskData.append("- Task: ").append(task.getTitle());
			if (task.getDescription() != null && !task.getDescription().trim().isEmpty()) {
				taskData.append(" (Description: ").append(task.getDescription()).append(")");
			}
			taskData.append(" | Status: ").append(task.getStatus());
			taskData.append(" | Priority: ").append(task.getPriority());
			taskData.append(" | Due Date: ").append(task.getDueDate() != null ? task.getDueDate() : "No due date");
			taskData.append("\n");
		}

		LocalDate today = LocalDate.now();

		String prompt = """
				You are an AI Productivity Assistant.
				Analyze the user's active tasks below and provide smart suggestions.
				
				Current Date: %s
				
				Tasks:
				%s
				
				Please format your response using exactly these three numbered sections:
				
				1. Priority Suggestions:
				- Analyze tasks based on their priorities and due dates. Suggest which tasks should be worked on first or deprioritized.
				
				2. Duplicate Task Detection:
				- Identify any tasks with similar titles/descriptions. If none, state that no duplicates were found.
				
				3. Due Date Risk Alerts:
				- Identify tasks that are overdue or close to their due date (relative to the current date: %s). If none, state that there are no immediate due date risks.
				
				Rules:
				- Ensure section headers start with '1. Priority Suggestions:', '2. Duplicate Task Detection:', and '3. Due Date Risk Alerts:'. Do NOT prefix them with markdown hashes (#) as the UI expects them to start with numbers.
				- Use bullet points starting with '*' or '-' for suggestions.
				- Use '**' to bold important task titles or key terms (e.g. **Task Name**).
				- Keep the suggestions concise, direct, and professional.
				""".formatted(today, taskData, today);

		String response = chatClient.prompt().user(prompt).call().content();

		// Dynamically compute the risk level based on task due dates
		String riskLevel = "LOW";
		for (Task task : tasks) {
			if (task.getStatus() != TaskStatus.DONE && task.getDueDate() != null) {
				long daysRemaining = ChronoUnit.DAYS.between(today, task.getDueDate());
				if (daysRemaining <= 2) {
					if (task.getPriority() == TaskPriority.HIGH) {
						riskLevel = "HIGH";
						break;
					} else {
						riskLevel = "MEDIUM";
					}
				} else if (daysRemaining <= 5 && !"HIGH".equals(riskLevel)) {
					riskLevel = "MEDIUM";
				}
			}
		}

		return List.of(SmartSuggestionResponse.builder().suggestion(response).riskLevel(riskLevel).build());
	}
}
