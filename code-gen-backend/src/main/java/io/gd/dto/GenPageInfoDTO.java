package io.gd.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class GenPageInfoDTO {
    private String type;
    private Map<String, List<ComponentConfigDTO>> componentConfig;
}
