package io.gd.dto;

import lombok.Data;

@Data
public class DownloadSourceCodeParamDTO {
    private String tableName;
    private GenPageInfoDTO genPageInfo;
}
