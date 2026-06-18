package com.annasaheb.aitaskmanager.service;

import java.util.List;

import com.annasaheb.aitaskmanager.dto.response.AiTaskResponse;
import com.annasaheb.aitaskmanager.dto.response.SmartSuggestionResponse;
import com.annasaheb.aitaskmanager.dto.response.TaskSummaryResponse;

public interface AiService {

	AiTaskResponse generateTaskDetails(String title, String email);

	TaskSummaryResponse generateSummary(String email);

	List<SmartSuggestionResponse> generateSuggestions(String email);
}