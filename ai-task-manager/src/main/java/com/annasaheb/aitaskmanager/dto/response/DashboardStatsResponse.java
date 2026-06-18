package com.annasaheb.aitaskmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

	private long totalTasks;

	private long todoTasks;

	private long inProgressTasks;

	private long completedTasks;
}