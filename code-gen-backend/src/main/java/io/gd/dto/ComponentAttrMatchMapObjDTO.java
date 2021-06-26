package io.gd.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ComponentAttrMatchMapObjDTO {
    private Map<Integer,String> value;
    private String _default;
}
