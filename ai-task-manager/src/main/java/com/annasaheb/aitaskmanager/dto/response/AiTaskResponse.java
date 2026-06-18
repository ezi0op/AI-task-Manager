package com.annasaheb.aitaskmanager.dto.response;

import com.annasaheb.aitaskmanager.entity.enums.TaskPriority;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiTaskResponse {

    private String description;

    private TaskPriority priority;

    private String estimatedEffort;

    private String dueDate;
}