package com.annasaheb.aitaskmanager.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SmartSuggestionResponse {

    private String suggestion;

    private String riskLevel;
}