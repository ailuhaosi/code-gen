package io.gd.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ComponentConfigDTO {
    private String columnName;
    //属性名称(第一个字母大写)，如：user_name => UserName
    private String attrName;
    //属性名称(第一个字母小写)，如：user_name => userName
    private String attrname;
    private String dataType;
    //列名备注
    private String comments;

    //属性类型
    private String attrType;
    private Boolean isPrimary;
    private String componentKey;
    private String componentLabel;
    private String componentType;
    private ComponentAttrDTO componentAttr;
}
